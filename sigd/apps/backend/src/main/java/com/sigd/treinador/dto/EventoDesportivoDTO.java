package com.sigd.treinador.dto;

import com.sigd.core.model.EstadoEvento;
import com.sigd.core.model.TipoEvento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class EventoDesportivoDTO {

    public record Request(
            @NotNull Long equipaId,
            @NotNull TipoEvento tipo,
            @NotNull LocalDate data,
            @NotNull LocalTime horaInicio,
            String adversario,
            @NotBlank String local
    ) {}

    public record Response(
            Long id,
            Long equipaId,
            String equipaNome,
            TipoEvento tipo,
            LocalDate data,
            LocalTime horaInicio,
            String adversario,
            String local,
            EstadoEvento estado,
            Boolean temConvocatoria
    ) {}
}
