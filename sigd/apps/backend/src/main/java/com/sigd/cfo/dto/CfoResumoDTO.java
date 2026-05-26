package com.sigd.cfo.dto;

import java.math.BigDecimal;

public record CfoResumoDTO(
    EntidadeResumo clube,
    EntidadeResumo sad,
    GlobalResumo global
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
}
