package com.sigd.audit.repository;

import com.sigd.audit.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByEntidade(String entidade);

    List<AuditLog> findByUsuarioId(Long usuarioId);

    List<AuditLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

}
