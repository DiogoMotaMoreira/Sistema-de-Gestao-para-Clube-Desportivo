package com.sigd.clinica.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * DTO para o pedido de Alta Médica (RF-19).
 */
public record AltaMedicaDTO(

    @NotBlank(message = "O parecer final é obrigatório")
    @Size(min = 10, message = "O parecer deve ter pelo menos 10 caracteres")
    String parecer,

    @NotNull(message = "A data de encerramento é obrigatória")
    LocalDate dataEncerramento

) {}
