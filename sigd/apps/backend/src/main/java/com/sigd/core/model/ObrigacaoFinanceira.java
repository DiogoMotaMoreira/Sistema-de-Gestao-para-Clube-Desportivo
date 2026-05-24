package com.sigd.core.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * ObrigacaoFinanceira — Obrigação financeira associada a um encarregado/atleta.
 *
 * Segue a regra de segregação SAD/Clube: a coluna entidadeJuridica é
 * OBRIGATÓRIA em todas as transações financeiras (RF-26+).
 */
@Entity
@Table(name = "obrigacao_financeira", indexes = {
    @Index(name = "idx_obf_encarregado", columnList = "encarregado_id"),
    @Index(name = "idx_obf_estado", columnList = "estado"),
    @Index(name = "idx_obf_entidade", columnList = "entidade_juridica")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ObrigacaoFinanceira {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @NotNull
    @Column(name = "data_vencimento", nullable = false)
    private LocalDate dataVencimento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TipoObrigacao tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoObrigacao estado = EstadoObrigacao.PENDENTE;

    @Enumerated(EnumType.STRING)
    @Column(name = "entidade_juridica", length = 10)
    private EntidadeJuridica entidadeJuridica;

    @Column(name = "data_pagamento")
    private LocalDate dataPagamento;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encarregado_id", nullable = false)
    private EncarregadoEducacao encarregado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atleta_id")
    private Atleta atleta;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

}
