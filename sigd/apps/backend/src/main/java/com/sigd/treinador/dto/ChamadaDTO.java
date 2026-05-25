package com.sigd.treinador.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class ChamadaDTO {

    public record Request(
            @NotEmpty @Valid List<RegistoAssiduidadeDTO.Request> registos
    ) {}

    public record Response(
            Long sessaoId,
            Integer totalPresentes,
            Integer totalAusentes,
            Integer totalAtrasados,
            List<RegistoAssiduidadeDTO.Response> registos
    ) {}
}
