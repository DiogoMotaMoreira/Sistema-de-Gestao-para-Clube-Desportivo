package com.sigd.admin;

import com.sigd.audit.AuditLogController;
import com.sigd.audit.model.AuditLog;
import com.sigd.audit.repository.AuditLogRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class AuditLogServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AuditLogController auditLogController;

    private AuditLog log1;
    private AuditLog log2;
    private Pageable defaultPageable;

    @BeforeEach
    void setUp() {
        log1 = new AuditLog();
        log1.setId(1L);
        log1.setAtor("medico");
        log1.setAcao("CRIAR");
        log1.setTimestamp(LocalDateTime.now().minusDays(1));

        log2 = new AuditLog();
        log2.setId(2L);
        log2.setAtor("admin");
        log2.setAcao("ATUALIZAR");
        log2.setTimestamp(LocalDateTime.now());

        defaultPageable = PageRequest.of(0, 20);
    }

    @Test
    void deve_retornar_todos_os_registos_de_auditoria() {
        Page<AuditLog> page = new PageImpl<>(List.of(log1, log2));
        when(auditLogRepository.filterLogs(isNull(), isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        Page<AuditLog> result = auditLogController.getAuditLogs(null, null, null, null, null, "timestamp", "desc", defaultPageable);
        assertEquals(2, result.getTotalElements());
    }

    @Test
    void deve_filtrar_por_ator() {
        Assertions.fail("BUG: O endpoint getAuditLogs não tem parâmetro dedicado para filtrar por ator (apenas 'search' genérico).");
    }

    @Test
    void deve_filtrar_por_accao() {
        Page<AuditLog> page = new PageImpl<>(List.of(log1));
        // O parâmetro 'tipo' mapeia para a 'accao'
        when(auditLogRepository.filterLogs(isNull(), eq("CRIAR"), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        Page<AuditLog> result = auditLogController.getAuditLogs(null, "CRIAR", null, null, null, "timestamp", "desc", defaultPageable);
        assertEquals(1, result.getTotalElements());
        assertEquals("CRIAR", result.getContent().get(0).getAcao());
    }

    @Test
    void deve_retornar_lista_vazia_quando_sem_registos() {
        Page<AuditLog> page = new PageImpl<>(List.of());
        when(auditLogRepository.filterLogs(isNull(), isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        Page<AuditLog> result = auditLogController.getAuditLogs(null, null, null, null, null, "timestamp", "desc", defaultPageable);
        assertTrue(result.isEmpty());
    }

    @Test
    void deve_ordenar_por_data_descendente() {
        Page<AuditLog> page = new PageImpl<>(List.of(log2, log1)); // log2 is more recent
        when(auditLogRepository.filterLogs(isNull(), isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenAnswer(invocation -> {
                    Pageable p = invocation.getArgument(5);
                    Sort.Order order = p.getSort().getOrderFor("timestamp");
                    if (order != null && order.getDirection() == Sort.Direction.DESC) {
                        return page;
                    }
                    return new PageImpl<>(List.of(log1, log2)); // wrong order if not desc
                });

        Page<AuditLog> result = auditLogController.getAuditLogs(null, null, null, null, null, "timestamp", "desc", defaultPageable);
        assertEquals(2, result.getTotalElements());
        assertEquals(log2.getId(), result.getContent().get(0).getId());
    }
}
