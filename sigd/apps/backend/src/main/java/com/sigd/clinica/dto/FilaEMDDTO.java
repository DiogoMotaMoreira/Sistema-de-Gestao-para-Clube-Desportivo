package com.sigd.clinica.dto;

import com.sigd.core.model.GrauRestricaoDesportiva;
import com.sigd.core.model.TipoOcorrencia;

import java.time.LocalDate;

/**
 * DTO para apresentação de ocorrências na fila EMD (lista de pendentes).
 */
public record FilaEMDDTO(
    Long id,
    String atletaNome,
    LocalDate dataOcorrencia,
    TipoOcorrencia tipo,
    GrauRestricaoDesportiva grauRestricao,
    LocalDate dataReavaliacao,
    Long diasPendente
) {}
