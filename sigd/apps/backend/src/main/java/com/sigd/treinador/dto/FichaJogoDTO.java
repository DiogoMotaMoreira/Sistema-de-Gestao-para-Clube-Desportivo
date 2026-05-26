package com.sigd.treinador.dto;

import java.time.LocalDateTime;

public class FichaJogoDTO {

    public record Request(
        Long eventoId,
        int golosMarcados,
        int golosSofridos,
        String observacoes
    ) {}

    public record Response(
        Long id,
        Long eventoId,
        int golosMarcados,
        int golosSofridos,
        String resultado,
        String observacoes,
        String estadoSubmissao,
        LocalDateTime criadoEm
    ) {}
}
