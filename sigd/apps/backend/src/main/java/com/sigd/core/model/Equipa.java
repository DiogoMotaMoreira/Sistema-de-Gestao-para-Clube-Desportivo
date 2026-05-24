package com.sigd.core.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "equipa", indexes = {
    @Index(name = "idx_escalao", columnList = "escalao_id"),
    @Index(name = "idx_modalidade", columnList = "modalidade_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Equipa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nome;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "escalao_id", nullable = false)
    private Escalao escalao;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modalidade_id", nullable = false)
    private Modalidade modalidade;

    @Column(nullable = false)
    private Boolean ativa = true;

    @OneToMany(mappedBy = "equipa", fetch = FetchType.LAZY)
    private List<Atleta> atletas = new ArrayList<>();

    @Column(name = "criada_em", nullable = false, updatable = false)
    private LocalDateTime criadaEm = LocalDateTime.now();

}
