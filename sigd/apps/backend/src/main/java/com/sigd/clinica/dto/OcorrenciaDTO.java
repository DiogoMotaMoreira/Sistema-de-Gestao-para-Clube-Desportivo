package com.sigd.clinica.dto;

import com.sigd.core.model.EstadoEMD;
import com.sigd.core.model.EstadoOcorrencia;
import com.sigd.core.model.GrauRestricaoDesportiva;
import com.sigd.core.model.TipoOcorrencia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTOs para Ocorrência — request/response separados.
 */
public final class OcorrenciaDTO {

    private OcorrenciaDTO() {}

    /**
     * Request — dados de entrada para registar uma ocorrência clínica.
     */
    public record Request(
        @NotNull(message = "O ID do atleta é obrigatório")
        Long atletaId,

        @NotNull(message = "A data da ocorrência é obrigatória")
        LocalDate dataOcorrencia,

        @NotNull(message = "O tipo de ocorrência é obrigatório")
        TipoOcorrencia tipo,

        @NotBlank(message = "O diagnóstico é obrigatório")
        String diagnostico,

        @NotNull(message = "O grau de restrição é obrigatório")
        GrauRestricaoDesportiva grauRestricao,

        LocalDate dataReavaliacao
    ) {}

    /**
     * Response — dados de saída de uma ocorrência clínica.
     */
    public record Response(
        Long id,
        Long atletaId,
        String atletaNome,
        LocalDate dataOcorrencia,
        TipoOcorrencia tipo,
        String diagnostico,
        GrauRestricaoDesportiva grauRestricao,
        LocalDate dataReavaliacao,
        EstadoEMD estadoEMD,
        EstadoOcorrencia estado,
        String medicoCriadorNome,
        String medicoDeliberacaoNome,
        LocalDate dataDeliberacao,
        String obsDeliberacao,
        LocalDateTime criadoEm
    ) {}

}
