package com.sigd.tesouraria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTOs para Equipa — request/response separados.
 */
public final class EquipaDTO {

    private EquipaDTO() {}

    /**
     * Request — dados de entrada para criar equipa.
     */
    public record Request(
        @NotBlank(message = "O nome da equipa é obrigatório")
        String nome,

        @NotNull(message = "O escalão é obrigatório")
        Long escalaoId,

        @NotNull(message = "A modalidade é obrigatória")
        Long modalidadeId
    ) {}

    /**
     * Response — dados de saída da equipa.
     */
    public record Response(
        Long id,
        String nome,
        String escalaoDesignacao,
        String modalidadeNome,
        Boolean ativa,
        int totalAtletas
    ) {}

}
