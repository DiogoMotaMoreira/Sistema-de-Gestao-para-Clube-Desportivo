package com.sigd.cfo.dto;

import java.math.BigDecimal;

import java.util.List;

public record CfoResumoDTO(
    EntidadeResumo clube,
    EntidadeResumo sad,
    GlobalResumo global,
    List<DetalheRubricaDTO> detalhesPorRubrica,
    long sociosAtivos,
    long atletasFederados
) {
    public record EntidadeResumo(
        BigDecimal receita,
        BigDecimal divida,
        long totalObrigacoes
    ) {}

    public record GlobalResumo(
        BigDecimal receita,
        BigDecimal divida,
        double taxaLiquidacao
    ) {}

    public record DetalheRubricaDTO(
        String rubrica,
        String entidade,
        BigDecimal totalGerado,
        BigDecimal totalDivida,
        double taxaLiquidacao
    ) {}
}
