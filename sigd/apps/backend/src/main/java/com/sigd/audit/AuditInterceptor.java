package com.sigd.audit;

import com.sigd.audit.model.AuditLog;
import com.sigd.audit.repository.AuditLogRepository;
import com.sigd.auth.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuditInterceptor implements HandlerInterceptor {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private JwtService jwtService;

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        if (request.getRequestURI().contains("/auth/login")) return;

        String method = request.getMethod();
        int status = response.getStatus();

        if ((method.equalsIgnoreCase("POST") || method.equalsIgnoreCase("PUT") || method.equalsIgnoreCase("DELETE"))
                && status >= 200 && status < 300) {

            String username = "SISTEMA";
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                try {
                    String token = authHeader.substring(7);
                    username = jwtService.extractUsername(token);
                } catch (Exception e) {
                    username = "SISTEMA";
                }
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
