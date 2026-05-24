package com.sigd.clinica.dto;

import com.sigd.core.model.GrauRestricaoDesportiva;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO para registar uma deliberação EMD sobre uma ocorrência.
 */
public record DeliberacaoDTO(
    @NotNull(message = "O grau final de restrição é obrigatório")
    GrauRestricaoDesportiva grauFinal,

    @NotBlank(message = "As observações da deliberação são obrigatórias")
    String obsDeliberacao
) {}
