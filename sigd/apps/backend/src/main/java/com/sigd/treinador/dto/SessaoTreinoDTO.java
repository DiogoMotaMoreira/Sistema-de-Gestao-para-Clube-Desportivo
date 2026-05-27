package com.sigd.treinador.dto;

import com.sigd.core.model.EstadoSessao;
import com.sigd.core.model.TipoSessao;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public class SessaoTreinoDTO {

    public record Request(
            @NotNull Long equipaId,
            @NotNull LocalDate data,
            @NotNull LocalTime horaInicio,
            @NotNull LocalTime horaFim,
            @NotNull TipoSessao tipo
    ) {}

    public record Response(
            Long id,
            Long equipaId,
            String equipaNome,
            LocalDate data,
            LocalTime horaInicio,
            LocalTime horaFim,
            TipoSessao tipo,
            EstadoSessao estado,
            Integer totalAtletas
    ) {}

    public record DetalheAtleta(
            Long atletaId,
            String atletaNome,
            String estado,
            java.math.BigDecimal nota
    ) {}

    public record DetalheResponse(
            Long sessaoId,
            Long equipaId,
            String equipaNome,
            LocalDate data,
            LocalTime horaInicio,
            LocalTime horaFim,
            TipoSessao tipo,
            EstadoSessao estado,
            java.util.List<DetalheAtleta> detalhes
    ) {}
}
