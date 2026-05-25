package com.sigd.treinador.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class AvaliacaoPosSessionDTO {

    public record Request(
            @NotEmpty @Valid List<AvaliacaoDTO.Request> avaliacoes
    ) {}

    public record Response(
            Long sessaoId,
            Integer totalAvaliados,
            List<AvaliacaoDTO.Response> avaliacoes
    ) {}
}
