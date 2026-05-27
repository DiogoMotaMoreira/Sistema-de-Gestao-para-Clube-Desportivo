package com.sigd.admin.service;

import com.sigd.admin.dto.UtilizadorAdminDTO;
import com.sigd.admin.exception.UtilizadorJaExisteException;
import com.sigd.admin.exception.UtilizadorNotFoundException;
import com.sigd.core.model.Utilizador;
import com.sigd.core.repository.UtilizadorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.sigd.audit.repository.AuditLogRepository;
import com.sigd.audit.model.AuditLog;
import java.time.LocalDateTime;

@Service
public class UtilizadorAdminService {

    private final UtilizadorRepository utilizadorRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.sigd.auth.service.PasswordValidator passwordValidator;
    private final AuditLogRepository auditLogRepository;

    public UtilizadorAdminService(UtilizadorRepository utilizadorRepository, 
                                  PasswordEncoder passwordEncoder,
                                  com.sigd.auth.service.PasswordValidator passwordValidator,
                                  AuditLogRepository auditLogRepository) {
        this.utilizadorRepository = utilizadorRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordValidator = passwordValidator;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(readOnly = true)
    public Page<UtilizadorAdminDTO.Response> listar(String pesquisa, Pageable pageable) {
        Page<Utilizador> page;
        if (pesquisa != null && !pesquisa.isBlank()) {
            page = utilizadorRepository.findByPesquisa(pesquisa, pageable);
        } else {
            page = utilizadorRepository.findAll(pageable);
        }
        return page.map(this::toResponse);
    }

    @Transactional
    public UtilizadorAdminDTO.Response criar(UtilizadorAdminDTO.Request request) {
        if (request.username() == null || request.username().isBlank()) {
            throw new IllegalArgumentException("Username não pode estar vazio");
        }
        java.util.List<String> rolesValidos = java.util.List.of(
            "ROLE_ADMIN","ROLE_MEDICO","ROLE_TREINADOR",
            "ROLE_SECRETARIA","ROLE_EE","ROLE_CEO","ROLE_CFO",
            "ROLE_DIRETOR_TECNICO"
        );
        if (!rolesValidos.contains(request.role())) {
            throw new IllegalArgumentException("Role inválido: " + request.role());
        }

        if (utilizadorRepository.existsByUsername(request.username())) {
            throw new UtilizadorJaExisteException("Já existe um utilizador com o username: " + request.username());
        }
        if (utilizadorRepository.existsByEmail(request.email())) {
            throw new UtilizadorJaExisteException("Já existe um utilizador com o email: " + request.email());
        }

        String rawPassword = (request.passwordHash() != null && !request.passwordHash().isBlank())
                ? request.passwordHash()
                : "Sigd@2025";
                
        passwordValidator.validarPassword(rawPassword);

        Utilizador novo = new Utilizador();
        novo.setUsername(request.username());
        novo.setEmail(request.email());
        novo.setRole(request.role());
        novo.setPasswordHash(passwordEncoder.encode(rawPassword));
        novo.setAtivo(true);

        novo = utilizadorRepository.save(novo);
        return toResponse(novo);
    }

    @Transactional
    public UtilizadorAdminDTO.Response bloquear(Long id) {
        Utilizador utilizador = utilizadorRepository.findById(id)
                .orElseThrow(() -> new UtilizadorNotFoundException("Utilizador não encontrado com id: " + id));

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName().equals(utilizador.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é permitido bloquear a própria conta.");
        }

        long adminsActivos = utilizadorRepository.countByRoleAndAtivo("ROLE_ADMIN", true);
        if (adminsActivos <= 1 && utilizador.getRole().equals("ROLE_ADMIN")) {
            throw new IllegalStateException("Não é possível bloquear o único administrador activo");
        }

        utilizador.setAtivo(false);
        utilizador = utilizadorRepository.save(utilizador);
        return toResponse(utilizador);
    }

    @Transactional
    public UtilizadorAdminDTO.Response reativar(Long id) {
        Utilizador utilizador = utilizadorRepository.findById(id)
                .orElseThrow(() -> new UtilizadorNotFoundException("Utilizador não encontrado com id: " + id));

        utilizador.setAtivo(true);
        utilizador = utilizadorRepository.save(utilizador);
        return toResponse(utilizador);
    }

    @Transactional
    public void anonimizarUtilizador(Long id) {
        Utilizador u = utilizadorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));
        u.setUsername("eliminado_" + id);
        u.setEmail("eliminado_" + id + "@sigd.eliminado");
        u.setPasswordHash("[ELIMINADO]");
        u.setAtivo(false);
        utilizadorRepository.save(u);

        // Registar no audit log
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String operador = (auth != null) ? auth.getName() : "ADMIN";

        AuditLog audit = new AuditLog();
        audit.setAtor(operador);
        audit.setAcao("ANONIMIZAR");
        audit.setEntidade("Utilizador");
        audit.setEntidadeId(id);
        audit.setDetalhes("Utilizador anonimizado por motivos de RGPD");
        audit.setTimestamp(LocalDateTime.now());
        audit.setIpAddress("127.0.0.1");
        auditLogRepository.save(audit);
    }

    private UtilizadorAdminDTO.Response toResponse(Utilizador u) {
        return new UtilizadorAdminDTO.Response(
                u.getId(),
                u.getUsername(),
                u.getEmail(),
                u.getRole(),
                u.getAtivo(),
                u.getCriadoEm(),
                u.getAtualizadoEm()
        );
    }
}
