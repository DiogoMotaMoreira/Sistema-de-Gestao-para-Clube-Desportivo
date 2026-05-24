package com.sigd.tesouraria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTOs para Atleta — request/response separados.
 */
public final class AtletaDTO {

    private AtletaDTO() {}

    /**
     * Request — dados de entrada para criar/atualizar atleta.
     */
    public record Request(
        @NotBlank(message = "O nome completo é obrigatório")
        String nomeCompleto,

        @NotNull(message = "A data de nascimento é obrigatória")
        LocalDate dataNascimento,

        String nif,
        String numeroSocio,
        String posicao,

        @NotNull(message = "O encarregado de educação é obrigatório")
        Long encarregadoId,

        Long equipaId
    ) {}

    /**
     * Response — dados de saída do atleta.
     */
    public record Response(
        Long id,
        String nomeCompleto,
        LocalDate dataNascimento,
        String nif,
        String numeroSocio,
        String posicao,
        String estadoElegibilidade,
        Long equipaId,
        String equipaNome,
        Long encarregadoId,
        String encarregadoNome,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
    ) {}

}
