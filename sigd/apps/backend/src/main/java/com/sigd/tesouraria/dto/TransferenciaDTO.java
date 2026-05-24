package com.sigd.tesouraria.dto;

import jakarta.validation.constraints.NotNull;

/**
 * TransferenciaDTO — Payload para transferir um atleta de equipa.
 *
 * Usado no PATCH /api/v1/tesouraria/atletas/{id}/transferir
 */
public record TransferenciaDTO(

    @NotNull(message = "O ID da nova equipa é obrigatório")
    Long novaEquipaId

) {}
