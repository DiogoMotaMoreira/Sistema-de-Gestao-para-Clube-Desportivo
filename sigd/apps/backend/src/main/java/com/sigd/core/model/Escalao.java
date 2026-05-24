package com.sigd.core.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "escalao")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Escalao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String designacao;

    @Column(name = "limite_idade_min")
    private Integer limiteIdadeMin;

    @Column(name = "limite_idade_max")
    private Integer limiteIdadeMax;

    @Column(name = "quota_anual", precision = 10, scale = 2)
    private BigDecimal quotaAnual;

    @Column(name = "mensalidade_base", precision = 10, scale = 2)
    private BigDecimal mensalidadeBase;

    @Column(name = "mensalidade_socio", precision = 10, scale = 2)
    private BigDecimal mensalidadeSocio;

    @Column(name = "teto_convocatoria")
    private Integer tetoConvocatoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modalidade_id")
    private Modalidade modalidade;

}
