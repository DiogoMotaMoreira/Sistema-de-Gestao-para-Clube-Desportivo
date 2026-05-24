package com.sigd.core.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "atleta", indexes = {
    @Index(name = "idx_estado", columnList = "estado_elegibilidade"),
    @Index(name = "idx_atleta_nif", columnList = "nif")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Atleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "nome_completo", nullable = false)
    private String nomeCompleto;

    @NotNull
    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @Column(unique = true, length = 20)
    private String nif;

    @Column(name = "numero_socio", length = 50)
    private String numeroSocio;

    @Column(length = 100)
    private String posicao;

    @Column(name = "estado_elegibilidade", nullable = false, length = 50)
    private String estadoElegibilidade = "APTO";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipa_id")
    private Equipa equipa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encarregado_id")
    private EncarregadoEducacao encarregado;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }

}
