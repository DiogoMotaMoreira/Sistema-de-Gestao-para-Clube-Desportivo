package com.sigd.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class EpocaDesportivaDTO {

    public record Request(
            @NotBlank(message = "O nome é obrigatório")
            String nome,

            @NotNull(message = "A data de início é obrigatória")
            LocalDate dataInicio,

            @NotNull(message = "A data de fim é obrigatória")
            LocalDate dataFim
    ) {}

    public record Response(
            Long id,
            String nome,
            LocalDate dataInicio,
            LocalDate dataFim,
            String estado,
            LocalDateTime criadoEm
    ) {}
}
