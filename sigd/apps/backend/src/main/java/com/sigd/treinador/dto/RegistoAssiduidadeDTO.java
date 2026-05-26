package com.sigd.treinador.dto;

import com.sigd.core.model.EstadoAssiduidade;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class RegistoAssiduidadeDTO {

    public record Request(
            @NotNull Long atletaId,
            @NotNull EstadoAssiduidade estado
    ) {}

    public record Response(
            Long atletaId,
            String atletaNome,
            EstadoAssiduidade estado,
            LocalDateTime registadoEm,
            Boolean condicionado
    ) {}
}
