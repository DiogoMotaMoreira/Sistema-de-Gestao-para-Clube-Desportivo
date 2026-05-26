package com.sigd.core.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "ficha_jogo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FichaJogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "evento_id", nullable = false, unique = true)
    private Long eventoId;

    @NotNull
    @Column(name = "golos_marcados", nullable = false)
    private Integer golosMarcados = 0;

    @NotNull
    @Column(name = "golos_sofridos", nullable = false)
    private Integer golosSofridos = 0;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ResultadoJogo resultado;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "submetida_por")
    private Long submetidaPor;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_submissao", nullable = false, length = 20)
    private EstadoSubmissaoFicha estadoSubmissao = EstadoSubmissaoFicha.SUBMETIDA;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();
}
