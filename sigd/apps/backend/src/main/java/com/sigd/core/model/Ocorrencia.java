package com.sigd.core.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Ocorrência clínica registada para um atleta.
 *
 * Representa lesões, doenças e outros eventos médicos que podem restringir
 * a elegibilidade desportiva do atleta. Cada ocorrência passa pela fila EMD
 * para deliberação médica.
 */
@Entity
@Table(name = "ocorrencia", indexes = {
    @Index(name = "idx_ocorrencia_atleta", columnList = "atleta_id"),
    @Index(name = "idx_ocorrencia_estado_emd", columnList = "estado_emd"),
    @Index(name = "idx_ocorrencia_estado", columnList = "estado")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ocorrencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atleta_id", nullable = false)
    private Atleta atleta;

    @NotNull
    @Column(name = "data_ocorrencia", nullable = false)
    private LocalDate dataOcorrencia;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TipoOcorrencia tipo;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String diagnostico;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "grau_restricao", nullable = false, length = 50)
    private GrauRestricaoDesportiva grauRestricao;

    @Column(name = "data_reavaliacao")
    private LocalDate dataReavaliacao;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_emd", nullable = false, length = 50)
    private EstadoEMD estadoEMD = EstadoEMD.EM_AVALIACAO;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private EstadoOcorrencia estado = EstadoOcorrencia.ATIVA;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medico_id")
    private Utilizador medicoCriador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medico_deliberacao_id")
    private Utilizador medicoDeliberacao;

    @Column(name = "data_deliberacao")
    private LocalDate dataDeliberacao;

    @Column(name = "obs_deliberacao", columnDefinition = "TEXT")
    private String obsDeliberacao;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }

}
