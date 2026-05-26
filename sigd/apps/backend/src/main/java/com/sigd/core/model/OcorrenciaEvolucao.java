package com.sigd.core.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ocorrencia_evolucao")
public class OcorrenciaEvolucao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ocorrencia_id", nullable = false)
    private Ocorrencia ocorrencia;

    @Enumerated(EnumType.STRING)
    @Column(name = "grau_restricao", nullable = false, length = 20)
    private GrauRestricaoDesportiva grauRestricao;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "registado_em", insertable = false, updatable = false)
    private LocalDateTime registadoEm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medico_id")
    private Utilizador medico;

    @PrePersist
    public void prePersist() {
        if (registadoEm == null) {
            registadoEm = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Ocorrencia getOcorrencia() { return ocorrencia; }
    public void setOcorrencia(Ocorrencia ocorrencia) { this.ocorrencia = ocorrencia; }

    public GrauRestricaoDesportiva getGrauRestricao() { return grauRestricao; }
    public void setGrauRestricao(GrauRestricaoDesportiva grauRestricao) { this.grauRestricao = grauRestricao; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public LocalDateTime getRegistadoEm() { return registadoEm; }
    public void setRegistadoEm(LocalDateTime registadoEm) { this.registadoEm = registadoEm; }

    public Utilizador getMedico() { return medico; }
    public void setMedico(Utilizador medico) { this.medico = medico; }
}
