package com.sigd.tesouraria.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTOs para ObrigacaoFinanceira — request/response separados.
 */
public final class ObrigacaoFinanceiraDTO {

    private ObrigacaoFinanceiraDTO() {}

    /**
     * Request — dados de entrada para criar obrigação financeira.
     */
    public record Request(
        @NotNull(message = "O valor é obrigatório")
        BigDecimal valor,

        @NotNull(message = "A data de vencimento é obrigatória")
        LocalDate dataVencimento,

        @NotNull(message = "O tipo de obrigação é obrigatório")
        String tipo,

        @NotNull(message = "A entidade jurídica é obrigatória")
        String entidadeJuridica,

        @NotNull(message = "O encarregado de educação é obrigatório")
        Long encarregadoId,

        Long atletaId
    ) {}

    /**
     * Response — dados de saída da obrigação financeira.
     */
    public record Response(
        Long id,
        BigDecimal valor,
        LocalDate dataVencimento,
        String tipo,
        String estado,
        String entidadeJuridica,
        LocalDate dataPagamento,
        Long encarregadoId,
        String encarregadoNome,
        Long atletaId,
        String atletaNome
    ) {}

}
