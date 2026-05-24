package com.sigd.tesouraria.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

/**
 * DTOs para Encarregado de Educação — request/response separados.
 */
public final class EncarregadoEducacaoDTO {

    private EncarregadoEducacaoDTO() {}

    /**
     * Request — dados de entrada para criar/atualizar EE.
     */
    public record Request(
        @NotBlank(message = "O nome é obrigatório")
        String nome,
        String nif,
        String email,
        String telemovel,
        String morada
    ) {}

    /**
     * Response — dados de saída do EE.
     */
    public record Response(
        Long id,
        String nome,
        String nif,
        String email,
        String telemovel,
        String morada,
        LocalDateTime criadoEm
    ) {}

}
