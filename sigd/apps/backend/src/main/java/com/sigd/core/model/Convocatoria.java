package com.sigd.core.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "convocatoria")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Convocatoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private EventoDesportivo evento;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "convocatoria_atletas",
        joinColumns = @JoinColumn(name = "convocatoria_id"),
        inverseJoinColumns = @JoinColumn(name = "atleta_id")
    )
    private List<Atleta> atletas = new ArrayList<>();

    @Column(name = "hora_concentracao")
    private LocalTime horaConcentracao;

    @Column(name = "local_concentracao", length = 200)
    private String localConcentracao;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private EstadoConvocatoria estado;

    @Column(name = "publicada_em")
    private LocalDateTime publicadaEm;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();
}
