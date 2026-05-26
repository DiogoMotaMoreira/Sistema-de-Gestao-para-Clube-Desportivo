package com.sigd.audit;

import com.sigd.audit.model.AuditLog;
import com.sigd.audit.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuditInterceptor implements HandlerInterceptor {

    private final AuditLogRepository auditLogRepository;

    public AuditInterceptor(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        String method = request.getMethod();
        int status = response.getStatus();

        if ((method.equalsIgnoreCase("POST") || method.equalsIgnoreCase("PUT") || method.equalsIgnoreCase("DELETE"))
                && status >= 200 && status < 300) {

            String username = "SISTEMA";
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                username = auth.getName();
            }

            String path = request.getRequestURI();
            String entidade = getEntidadeByPath(path);
            String acao = getAcaoByMethodAndPath(method, path);

            if (entidade != null) {
                AuditLog log = new AuditLog();
                log.setAtor(username);
                log.setAcao(acao);
                log.setEntidade(entidade);
                log.setIpAddress(request.getRemoteAddr());
                log.setDetalhes("Ação " + acao + " executada em " + path);
                
                auditLogRepository.save(log);
            }
        }
    }

    private String getEntidadeByPath(String path) {
        if (path.contains("/api/v1/tesouraria/atletas")) return "Atleta";
        if (path.contains("/api/v1/tesouraria/ee")) return "EncarregadoEducacao";
        if (path.contains("/api/v1/clinica/ocorrencias")) return "Ocorrencia";
        if (path.contains("/api/v1/admin/utilizadores")) return "Utilizador";
        if (path.contains("/api/v1/auth/login")) return "Utilizador";
        if (path.contains("/api/v1/treinador/sessoes")) return "SessaoTreino";
        if (path.contains("/api/v1/treinador/convocatorias")) return "Convocatoria";
        return null; // Don't log if entity is not recognized
    }

    private String getAcaoByMethodAndPath(String method, String path) {
        if (path.contains("/api/v1/auth/login")) {
            return "LOGIN";
        }
        if (method.equalsIgnoreCase("POST")) return "CRIAR";
        if (method.equalsIgnoreCase("PUT")) return "EDITAR";
        if (method.equalsIgnoreCase("DELETE")) return "ELIMINAR";
        return "DESCONHECIDO";
    }
}
