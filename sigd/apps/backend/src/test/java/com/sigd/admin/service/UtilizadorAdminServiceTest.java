package com.sigd.admin.service;

import com.sigd.admin.dto.UtilizadorAdminDTO;
import com.sigd.admin.exception.UtilizadorJaExisteException;
import com.sigd.admin.exception.UtilizadorNotFoundException;
import com.sigd.auth.service.PasswordValidator;
import com.sigd.core.model.Utilizador;
import com.sigd.core.repository.UtilizadorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UtilizadorAdminServiceTest {

    @Mock
    private UtilizadorRepository utilizadorRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PasswordValidator passwordValidator;

    @InjectMocks
    private UtilizadorAdminService utilizadorAdminService;

    private Utilizador user;

    @BeforeEach
    void setUp() {
        user = new Utilizador();
        user.setId(1L);
        user.setUsername("admin1");
        user.setEmail("admin1@test.com");
        user.setRole("ROLE_ADMIN");
        user.setAtivo(true);
    }

    // ==========================================
    // GRUPO 1 — Gestão de utilizadores (RF-38, UC-15.1)
    // ==========================================

    @Test
    @DisplayName("Deve listar todos sem pesquisa")
    void deve_listar_todos_sem_pesquisa() {
        when(utilizadorRepository.findAll(any(org.springframework.data.domain.Pageable.class)))
            .thenReturn(org.springframework.data.domain.Page.empty());
        org.springframework.data.domain.Page<UtilizadorAdminDTO.Response> res = utilizadorAdminService.listar(null, org.springframework.data.domain.Pageable.unpaged());
        assertThat(res).isEmpty();
    }

    @Test
    @DisplayName("Deve listar todos com pesquisa")
    void deve_listar_todos_com_pesquisa() {
        when(utilizadorRepository.findByPesquisa(eq("admin"), any(org.springframework.data.domain.Pageable.class)))
            .thenReturn(new org.springframework.data.domain.PageImpl<>(List.of(user)));
        org.springframework.data.domain.Page<UtilizadorAdminDTO.Response> res = utilizadorAdminService.listar("admin", org.springframework.data.domain.Pageable.unpaged());
        assertThat(res).hasSize(1);
    }

    @Test
    @DisplayName("Deve criar utilizador com sucesso")
    void deve_criar_utilizador_com_sucesso() {
        UtilizadorAdminDTO.Request req = new UtilizadorAdminDTO.Request("newuser", "new@test.com", "ROLE_MEDICO", "Pass123!");
        
        when(utilizadorRepository.existsByUsername("newuser")).thenReturn(false);
        when(utilizadorRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode("Pass123!")).thenReturn("hashed");
        when(utilizadorRepository.save(any(Utilizador.class))).thenAnswer(i -> {
            Utilizador u = i.getArgument(0);
            u.setId(2L);
            return u;
        });

        UtilizadorAdminDTO.Response res = utilizadorAdminService.criar(req);
        
        assertThat(res.id()).isEqualTo(2L);
        assertThat(res.username()).isEqualTo("newuser");
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar utilizador com username duplicado")
    void deve_lancara_excecao_criar_utilizador_username_duplicado() {
        UtilizadorAdminDTO.Request req = new UtilizadorAdminDTO.Request("admin", "new@test.com", "ROLE_MEDICO", "Pass123!");
        when(utilizadorRepository.existsByUsername("admin")).thenReturn(true);
        assertThatThrownBy(() -> utilizadorAdminService.criar(req)).isInstanceOf(com.sigd.admin.exception.UtilizadorJaExisteException.class);
    }

    @Test
    @DisplayName("Deve lançar exceção ao criar utilizador com email duplicado")
    void deve_lancara_excecao_criar_utilizador_email_duplicado() {
        UtilizadorAdminDTO.Request req = new UtilizadorAdminDTO.Request("newuser", "admin@test.com", "ROLE_MEDICO", "Pass123!");
        when(utilizadorRepository.existsByUsername("newuser")).thenReturn(false);
        when(utilizadorRepository.existsByEmail("admin@test.com")).thenReturn(true);
        assertThatThrownBy(() -> utilizadorAdminService.criar(req)).isInstanceOf(com.sigd.admin.exception.UtilizadorJaExisteException.class);
    }

    @Test
    @DisplayName("Deve lançar exceção quando username já existe")
    void deve_lancara_excecao_quando_username_ja_existe() {
        UtilizadorAdminDTO.Request req = new UtilizadorAdminDTO.Request("admin1", "new@test.com", "ROLE_MEDICO", "Pass123!");
        when(utilizadorRepository.existsByUsername("admin1")).thenReturn(true);

        assertThatThrownBy(() -> utilizadorAdminService.criar(req))
                .isInstanceOf(UtilizadorJaExisteException.class);
    }

    @Test
    @DisplayName("Deve lançar exceção quando email já existe")
    void deve_lancara_excecao_quando_email_ja_existe() {
        UtilizadorAdminDTO.Request req = new UtilizadorAdminDTO.Request("newuser", "admin1@test.com", "ROLE_MEDICO", "Pass123!");
        when(utilizadorRepository.existsByUsername("newuser")).thenReturn(false);
        when(utilizadorRepository.existsByEmail("admin1@test.com")).thenReturn(true);

        assertThatThrownBy(() -> utilizadorAdminService.criar(req))
                .isInstanceOf(UtilizadorJaExisteException.class);
    }

    @Test
    @DisplayName("Deve fazer hash da password antes de persistir")
    void deve_fazer_hash_da_password_antes_de_persistir() {
        UtilizadorAdminDTO.Request req = new UtilizadorAdminDTO.Request("newuser", "new@test.com", "ROLE_MEDICO", "Pass123!");
        
        when(utilizadorRepository.existsByUsername("newuser")).thenReturn(false);
        when(utilizadorRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode("Pass123!")).thenReturn("hashed_very_secure");
        when(utilizadorRepository.save(any(Utilizador.class))).thenAnswer(i -> i.getArgument(0));

        utilizadorAdminService.criar(req);

        verify(passwordEncoder).encode("Pass123!");
        verify(utilizadorRepository).save(argThat(u -> "hashed_very_secure".equals(u.getPasswordHash())));
    }

    // ==========================================
    // GRUPO 2 — Bloquear/Reactivar (UC-15.1)
    // ==========================================

    @Test
    @DisplayName("Deve bloquear utilizador com sucesso")
    void deve_bloquear_utilizador_com_sucesso() {
        when(utilizadorRepository.findById(1L)).thenReturn(Optional.of(user));
        when(utilizadorRepository.countByRoleAndAtivo("ROLE_ADMIN", true)).thenReturn(2L);
        when(utilizadorRepository.save(any(Utilizador.class))).thenAnswer(i -> i.getArgument(0));

        // Setup mock security context
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("otheradmin");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        UtilizadorAdminDTO.Response res = utilizadorAdminService.bloquear(1L);

        assertThat(res.ativo()).isFalse();
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar bloquear a própria conta")
    void deve_lancara_excecao_bloquear_propria_conta() {
        when(utilizadorRepository.findById(1L)).thenReturn(Optional.of(user));
        
        org.springframework.security.core.Authentication auth = mock(org.springframework.security.core.Authentication.class);
        when(auth.getName()).thenReturn("admin1");
        org.springframework.security.core.context.SecurityContext context = mock(org.springframework.security.core.context.SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        org.springframework.security.core.context.SecurityContextHolder.setContext(context);

        assertThatThrownBy(() -> utilizadorAdminService.bloquear(1L))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class)
                .hasMessageContaining("Não é permitido bloquear a própria conta.");
        
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Deve reativar utilizador com sucesso")
    void deve_reativar_utilizador_com_sucesso() {
        user.setAtivo(false);
        when(utilizadorRepository.findById(1L)).thenReturn(Optional.of(user));
        when(utilizadorRepository.save(any(Utilizador.class))).thenAnswer(i -> i.getArgument(0));

        UtilizadorAdminDTO.Response res = utilizadorAdminService.reativar(1L);

        assertThat(res.ativo()).isTrue();
    }

    @Test
    @DisplayName("Deve lançar exceção ao bloquear utilizador inexistente")
    void deve_lancara_excecao_ao_bloquear_utilizador_inexistente() {
        when(utilizadorRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> utilizadorAdminService.bloquear(99L))
                .isInstanceOf(UtilizadorNotFoundException.class);
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar bloquear único admin")
    void deve_lancara_excecao_ao_tentar_bloquear_unico_admin() {
        when(utilizadorRepository.findById(1L)).thenReturn(Optional.of(user));
        when(utilizadorRepository.countByRoleAndAtivo("ROLE_ADMIN", true)).thenReturn(1L);
        
        // Setup security context with a DIFFERENT admin, to avoid the "blocking self" exception
        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("admin2");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        // This test should expect an exception indicating that the last admin cannot be blocked
        // Since there is no such logic, this test should fail, exposing the bug.
        // I will throw an UnsupportedOperationException if we want to simulate the expected behaviour, 
        // but the code just blocks and saves. So I will expect a custom exception that doesn't exist 
        // or a generic one with a specific message.
        // Let's assert it throws an IllegalStateException
        
        try {
            assertThatThrownBy(() -> utilizadorAdminService.bloquear(1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Não é possível bloquear o único administrador");
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    // ==========================================
    // GRUPO 3 — Edge cases
    // ==========================================

    @Test
    @DisplayName("Deve lançar exceção quando username for vazio")
    void deve_lancara_excecao_quando_username_vazio() {
        UtilizadorAdminDTO.Request req = new UtilizadorAdminDTO.Request("", "test@test.com", "ROLE_MEDICO", "Pass123!");
        
        // Como o serviço não valida campos vazios, isto vai expor um bug.
        assertThatThrownBy(() -> utilizadorAdminService.criar(req))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Deve lançar exceção quando role for inválido")
    void deve_lancara_excecao_quando_role_invalido() {
        UtilizadorAdminDTO.Request req = new UtilizadorAdminDTO.Request("user", "test@test.com", "INVALID_ROLE", "Pass123!");
        
        // Também não tem validação de role no momento de criação
        assertThatThrownBy(() -> utilizadorAdminService.criar(req))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
