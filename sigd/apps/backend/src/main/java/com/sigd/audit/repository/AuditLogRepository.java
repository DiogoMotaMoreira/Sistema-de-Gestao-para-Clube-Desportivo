package com.sigd.audit.repository;

import com.sigd.audit.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByEntidade(String entidade);

    List<AuditLog> findByUsuarioId(Long usuarioId);

    List<AuditLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:modulo IS NULL OR :modulo = '' OR a.entidade = :modulo) AND " +
           "(:tipo IS NULL OR :tipo = '' OR a.acao = :tipo) AND " +
           "(:dataInicio IS NULL OR a.timestamp >= :dataInicio) AND " +
           "(:dataFim IS NULL OR a.timestamp <= :dataFim) AND " +
           "(:search IS NULL OR :search = '' OR LOWER(a.ator) LIKE LOWER(CONCAT('%', :search, '%')) OR CAST(a.usuarioId AS string) LIKE CONCAT('%', :search, '%'))")
    Page<AuditLog> filterLogs(
        @Param("modulo") String modulo, 
        @Param("tipo") String tipo, 
        @Param("dataInicio") LocalDateTime dataInicio, 
        @Param("dataFim") LocalDateTime dataFim, 
        @Param("search") String search,
        Pageable pageable);
}
