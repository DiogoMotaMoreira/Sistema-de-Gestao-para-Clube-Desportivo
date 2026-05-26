package com.sigd.audit.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Audit log entity — append-only.
 * NUNCA fazer DELETE ou UPDATE nesta tabela (RF-24).
 */
@Entity
@Table(name = "audit_log", indexes = {
    @Index(name = "idx_audit_timestamp", columnList = "timestamp"),
    @Index(name = "idx_audit_entidade", columnList = "entidade"),
    @Index(name = "idx_audit_usuario", columnList = "usuario_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "timestamp", nullable = false, updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Column(name = "ator", length = 100)
    private String ator;

    @Column(name = "usuario_role", length = 50)
    private String usuarioRole;

    @NotBlank
    @Column(nullable = false)
    private String acao;

    @NotBlank
    @Column(nullable = false)
    private String entidade;

    @Column(name = "entidade_id")
    private Long entidadeId;

    @Lob
    @Column(name = "payload_antes", columnDefinition = "LONGTEXT")
    private String payloadAntes;

    @Lob
    @Column(name = "payload_depois", columnDefinition = "LONGTEXT")
    private String payloadDepois;

    @Column(name = "detalhes")
    private String detalhes;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

}
