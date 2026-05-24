package com.sigd.core.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "encarregado_educacao", indexes = {
    @Index(name = "idx_ee_nif", columnList = "nif")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EncarregadoEducacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String nome;

    @Column(unique = true, length = 20)
    private String nif;

    private String email;

    @Column(length = 20)
    private String telemovel;

    private String morada;

    @OneToMany(mappedBy = "encarregado", fetch = FetchType.LAZY)
    private List<Atleta> atletas = new ArrayList<>();

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

}
