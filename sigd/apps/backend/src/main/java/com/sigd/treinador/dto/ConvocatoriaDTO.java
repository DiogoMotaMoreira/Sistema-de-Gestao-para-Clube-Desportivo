package com.sigd.treinador.dto;

import com.sigd.core.model.EstadoConvocatoria;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public class ConvocatoriaDTO {

    public record Request(
            @NotNull Long eventoId,
            @NotEmpty List<Long> atletaIds,
            @NotNull LocalTime horaConcentracao,
            @NotBlank String localConcentracao
    ) {}

    public record Response(
            Long id,
            Long eventoId,
            List<String> atletasConvocados,
            LocalTime horaConcentracao,
            String localConcentracao,
            EstadoConvocatoria estado,
            LocalDateTime publicadaEm
    ) {}
}
