package com.sigd.tesouraria.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * SituacaoFinanceiraDTO — Resumo da situação financeira de um encarregado.
 *
 * Inclui totais de dívida/pagos e a lista completa de obrigações.
 */
public record SituacaoFinanceiraDTO(
    BigDecimal totalDivida,
    BigDecimal totalPago,
    List<ObrigacaoFinanceiraDTO.Response> obrigacoes
) {}
