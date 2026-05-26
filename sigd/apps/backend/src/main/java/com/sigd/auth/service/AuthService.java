package com.sigd.auth.service;

import com.sigd.auth.dto.LoginRequest;
import com.sigd.auth.dto.LoginResponse;
import com.sigd.core.model.Utilizador;
import com.sigd.core.repository.UtilizadorRepository;
import com.sigd.audit.model.AuditLog;
import com.sigd.audit.repository.AuditLogRepository;
import java.time.LocalDateTime;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * AuthService — Lógica de autenticação do SIGD.
 *
 * Responsabilidades:
 * - login: valida password com BCrypt, gera access+refresh tokens
 * - refresh: valida refresh token, gera novo access token
 *
 * AGENTS.md — 8 roles RBAC suportados:
 * ROLE_ADMIN, ROLE_CEO, ROLE_CFO, ROLE_SECRETARIA,
 * ROLE_DIRETOR_TECNICO, ROLE_MEDICO, ROLE_TREINADOR, ROLE_EE
 */
@Service
public class AuthService {

    private static final java.util.Map<String, Integer> tentativasFalhadas = new java.util.concurrent.ConcurrentHashMap<>();
    private static final java.util.Map<String, java.time.LocalDateTime> bloqueadoAte = new java.util.concurrent.ConcurrentHashMap<>();

    private final UtilizadorRepository utilizadorRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogRepository auditLogRepository;

    public AuthService(UtilizadorRepository utilizadorRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder,
                       AuditLogRepository auditLogRepository) {
        this.utilizadorRepository = utilizadorRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.auditLogRepository = auditLogRepository;
    }

    /**
     * Autentica um utilizador com username/password.
     *
     * @param request LoginRequest com username e password
     * @return LoginResponse com access token, refresh token, role e metadata
     * @throws UsernameNotFoundException se o utilizador não existe
     * @throws BadCredentialsException se a password está incorreta
     * @throws IllegalStateException se a conta está desativada
     */
    public LoginResponse login(LoginRequest request) {
        String username = request.username();

        // 0. Verificar se username está bloqueado
        if (bloqueadoAte.containsKey(username)) {
            java.time.LocalDateTime limit = bloqueadoAte.get(username);
            if (java.time.LocalDateTime.now().isBefore(limit)) {
                throw new IllegalStateException("Conta bloqueada por 15 minutos");
            } else {
                bloqueadoAte.remove(username);
                tentativasFalhadas.remove(username);
            }
        }

        // 1. Buscar utilizador pelo username
        Utilizador user = utilizadorRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

        // 2. Verificar se a conta está ativa
        if (!user.getAtivo()) {
            throw new RuntimeException("Conta bloqueada. Contacte o administrador.");
        }

        // 3. Validar password com BCrypt
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            int attempts = tentativasFalhadas.getOrDefault(username, 0) + 1;
            tentativasFalhadas.put(username, attempts);
            if (attempts >= 5) {
                bloqueadoAte.put(username, java.time.LocalDateTime.now().plusMinutes(15));
                throw new BadCredentialsException("Credenciais inválidas (5/5 tentativas)");
            }
            throw new BadCredentialsException("Credenciais inválidas (" + attempts + "/5 tentativas)");
        }

        // Sucesso: limpar tentativas e bloqueios
        tentativasFalhadas.remove(username);
        bloqueadoAte.remove(username);

        // Audit Log
        Utilizador utilizador = user;
        System.out.println("AUDIT LOGIN gravado para: " + username);
        AuditLog auditLog = new AuditLog();
        auditLog.setAtor(username);
        auditLog.setAcao("LOGIN");
        auditLog.setEntidade("Utilizador");
        auditLog.setEntidadeId(utilizador.getId());
        auditLog.setDetalhes("Login efectuado com sucesso");
        auditLog.setTimestamp(LocalDateTime.now());
        auditLog.setIpAddress("127.0.0.1");
        auditLogRepository.save(auditLog);

        // 4. Gerar tokens
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return new LoginResponse(
                accessToken,
                refreshToken,
                user.getRole(),
                user.getUsername(),
                jwtService.getAccessTokenExpiration()
        );
    }

    /**
     * Renova o access token usando um refresh token válido.
     *
     * @param refreshToken token de refresh
     * @return LoginResponse com novo access token
     * @throws BadCredentialsException se o refresh token é inválido ou expirado
     */
    public LoginResponse refresh(String refreshToken) {
        // 1. Extrair username do refresh token
        String username;
        try {
            username = jwtService.extractUsername(refreshToken);
        } catch (Exception e) {
            throw new BadCredentialsException("Refresh token inválido ou expirado");
        }

        // 2. Buscar utilizador
        Utilizador user = utilizadorRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("Utilizador não encontrado"));

        // 3. Validar refresh token
        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new BadCredentialsException("Refresh token inválido ou expirado");
        }

        // 4. Verificar se a conta continua ativa
        if (!user.getAtivo()) {
            throw new RuntimeException("Conta bloqueada. Contacte o administrador.");
        }

        // 5. Gerar novo access token (manter o mesmo refresh token)
        String newAccessToken = jwtService.generateAccessToken(user);

        return new LoginResponse(
                newAccessToken,
                refreshToken,
                user.getRole(),
                user.getUsername(),
                jwtService.getAccessTokenExpiration()
        );
    }

}
