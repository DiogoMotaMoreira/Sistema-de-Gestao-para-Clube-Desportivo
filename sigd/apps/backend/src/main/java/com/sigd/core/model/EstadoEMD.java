package com.sigd.core.model;

/**
 * Estado do processo EMD (Exame Médico-Desportivo) de uma ocorrência.
 *
 * EM_AVALIACAO — aguarda deliberação na fila EMD.
 * DELIBERADO  — deliberação médica já foi registada.
 * ARQUIVADO   — ocorrência encerrada/arquivada.
 */
public enum EstadoEMD {
    EM_AVALIACAO,
    DELIBERADO,
    ARQUIVADO
}
