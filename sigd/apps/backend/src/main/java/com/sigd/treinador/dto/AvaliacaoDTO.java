package com.sigd.treinador.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AvaliacaoDTO {

    public record Request(
            @NotNull Long atletaId,
            @NotNull BigDecimal nota
    ) {}

    public record Response(
            Long atletaId,
            String atletaNome,
            BigDecimal nota,
            LocalDateTime registadoEm
    ) {}
}
