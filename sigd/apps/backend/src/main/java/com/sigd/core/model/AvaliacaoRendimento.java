package com.sigd.core.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "avaliacao_rendimento")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoRendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sessao_id", nullable = false)
    private SessaoTreino sessao;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atleta_id", nullable = false)
    private Atleta atleta;

    @NotNull
    @Column(nullable = false, precision = 2, scale = 1)
    private BigDecimal nota;

    @Column(name = "registado_em", nullable = false)
    private LocalDateTime registadoEm = LocalDateTime.now();
}
