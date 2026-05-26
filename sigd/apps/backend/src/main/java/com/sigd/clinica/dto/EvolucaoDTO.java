package com.sigd.clinica.dto;

import com.sigd.core.model.GrauRestricaoDesportiva;

import java.time.LocalDateTime;

public record EvolucaoDTO() {
    
    public record Request(
            Long ocorrenciaId,
            GrauRestricaoDesportiva grauRestricao,
            String descricao
    ) {}

    public record Response(
            Long id,
            Long ocorrenciaId,
            GrauRestricaoDesportiva grauRestricao,
            String descricao,
            LocalDateTime registadoEm
    ) {}
}
