package com.sigd.auth.service;

import com.sigd.auth.dto.LoginRequest;
import com.sigd.auth.dto.LoginResponse;
import com.sigd.audit.model.AuditLog;
import com.sigd.audit.repository.AuditLogRepository;
import com.sigd.core.model.Utilizador;
import com.sigd.core.repository.UtilizadorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UtilizadorRepository utilizadorRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AuthService authService;

    private Utilizador user;

    @BeforeEach
    void setUp() {
        user = new Utilizador();
        user.setId(1L);
        user.setUsername("testuser");
        user.setPasswordHash("hashed_password");
        user.setRole("ROLE_ADMIN");
        user.setAtivo(true);
    }

    // ==========================================
    // GRUPO 1 — Login (RF-40, RNF-08)
    // ==========================================

    @Test
    @DisplayName("Deve fazer login com sucesso e devolver token")
    void deve_fazer_login_com_sucesso_e_devolver_token() {
        String username = "user1";
        user.setUsername(username);
        LoginRequest req = new LoginRequest(username, "password123");
        
        when(utilizadorRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);
        when(jwtService.generateAccessToken(user)).thenReturn("access.token.here");
        when(jwtService.generateRefreshToken(user)).thenReturn("refresh.token.here");
        when(jwtService.getAccessTokenExpiration()).thenReturn(3600000L);

        LoginResponse res = authService.login(req);

        assertThat(res.accessToken()).isEqualTo("access.token.here");
        assertThat(res.refreshToken()).isEqualTo("refresh.token.here");
        assertThat(res.username()).isEqualTo(username);
    }

    @Test
    @DisplayName("Deve lançar exceção quando username não existe")
    void deve_lancara_excecao_quando_username_nao_existe() {
        LoginRequest req = new LoginRequest("nao_existe", "pass");
        when(utilizadorRepository.findByUsername("nao_existe")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("Credenciais inválidas");
    }

    @Test
    @DisplayName("Deve lançar exceção quando password está incorrecta")
    void deve_lancara_excecao_quando_password_incorrecta() {
        String username = "user3";
        user.setUsername(username);
        LoginRequest req = new LoginRequest(username, "wrong_pass");
        
        when(utilizadorRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong_pass", "hashed_password")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    @DisplayName("Deve lançar exceção quando conta está bloqueada (ativo=false)")
    void deve_lancara_excecao_quando_conta_bloqueada() {
        String username = "user4";
        user.setUsername(username);
        user.setAtivo(false);
        LoginRequest req = new LoginRequest(username, "password");

        when(utilizadorRepository.findByUsername(username)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Conta bloqueada");
    }

    @Test
    @DisplayName("Deve registar audit log após login com sucesso")
    void deve_registar_audit_log_apos_login_com_sucesso() {
        String username = "user5";
        user.setUsername(username);
        LoginRequest req = new LoginRequest(username, "password123");
        
        when(utilizadorRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);
        when(jwtService.generateAccessToken(user)).thenReturn("token");

        authService.login(req);

        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }

    // ==========================================
    // GRUPO 2 — Lockout (RNF-07)
    // ==========================================

    @Test
    @DisplayName("Deve bloquear conta após 5 tentativas falhadas consecutivas")
    void deve_bloquear_conta_apos_5_tentativas_falhadas_consecutivas() {
        String username = "user6_lockout";
        user.setUsername(username);
        LoginRequest req = new LoginRequest(username, "wrong");

        when(utilizadorRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "hashed_password")).thenReturn(false);

        // 5 tentativas falhadas
        for (int i = 0; i < 5; i++) {
            try {
                authService.login(req);
            } catch (BadCredentialsException ignored) {}
        }

        // A 6ª tentativa deve lançar IllegalStateException (bloqueio de 15 min)
        // Se lançar BadCredentialsException, o bloqueio não está a funcionar corretamente na pré-validação.
        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Conta bloqueada por 15 minutos");
    }

    @Test
    @DisplayName("Deve permitir login após desbloqueio manual pelo admin")
    void deve_permitir_login_apos_desbloqueio_manual_pelo_admin() {
        String username = "user7_unlock";
        user.setUsername(username);
        LoginRequest wrongReq = new LoginRequest(username, "wrong");
        LoginRequest correctReq = new LoginRequest(username, "password123");

        when(utilizadorRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "hashed_password")).thenReturn(false);

        // Bloquear conta (5 tentativas)
        for (int i = 0; i < 5; i++) {
            try { authService.login(wrongReq); } catch (Exception ignored) {}
        }

        // Simulando que o admin vai à BD e faz ativo = true
        user.setAtivo(true);
        when(passwordEncoder.matches("password123", "hashed_password")).thenReturn(true);
        
        // O utilizador com a conta ativa deveria conseguir entrar, MAS o mapa estático ainda tem o bloqueio.
        // O teste deve ESPERAR sucesso, forçando assim a falha e expondo o bug da memória estática vs DB.
        
        when(jwtService.generateAccessToken(user)).thenReturn("token");
        when(jwtService.generateRefreshToken(user)).thenReturn("refresh");

        LoginResponse res = authService.login(correctReq);
        assertThat(res.accessToken()).isNotNull();
    }

    // ==========================================
    // GRUPO 3 — JWT (RNF-08)
    // ==========================================

    @Test
    @DisplayName("Deve gerar token com role correcto no payload")
    void deve_gerar_token_com_role_correcto_no_payload() {
        String username = "user8";
        user.setUsername(username);
        user.setRole("ROLE_TREINADOR");
        LoginRequest req = new LoginRequest(username, "password");

        when(utilizadorRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "hashed_password")).thenReturn(true);
        when(jwtService.generateAccessToken(user)).thenReturn("token");

        LoginResponse res = authService.login(req);

        assertThat(res.role()).isEqualTo("ROLE_TREINADOR");
    }

    @Test
    @DisplayName("Deve lançar exceção com token expirado no refresh")
    void deve_lancara_excecao_com_token_expirado() {
        when(jwtService.extractUsername("expired_token")).thenThrow(new RuntimeException("Token expired"));

        assertThatThrownBy(() -> authService.refresh("expired_token"))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("Refresh token inválido");
    }

    @Test
    @DisplayName("Deve lançar exceção com token inválido no refresh")
    void deve_lancara_excecao_com_token_invalido() {
        String username = "user10";
        user.setUsername(username);
        
        when(jwtService.extractUsername("invalid_token")).thenReturn(username);
        when(utilizadorRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(jwtService.isTokenValid("invalid_token", user)).thenReturn(false);

        assertThatThrownBy(() -> authService.refresh("invalid_token"))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("Refresh token inválido");
    }

    // ==========================================
    // GRUPO 4 — Edge cases
    // ==========================================

    @Test
    @DisplayName("Deve lançar exceção IllegalArgumentException quando username for vazio")
    void deve_lancara_excecao_quando_username_vazio() {
        LoginRequest req = new LoginRequest("", "pass");

        // O teste espera que falhe a validação antes de sequer ir à base de dados
        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Deve lançar exceção IllegalArgumentException quando password for vazia")
    void deve_lancara_excecao_quando_password_vazia() {
        LoginRequest req = new LoginRequest("user12", "");

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Deve ser case sensitive no username")
    void deve_ser_case_sensitive_no_username() {
        String username = "AdminUser";
        LoginRequest lowerReq = new LoginRequest("adminuser", "pass");

        // Simulando o comportamento DB: a pesquisa exata não encontra o utilizador em lowercase
        when(utilizadorRepository.findByUsername("adminuser")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(lowerReq))
                .isInstanceOf(BadCredentialsException.class);
    }
}
