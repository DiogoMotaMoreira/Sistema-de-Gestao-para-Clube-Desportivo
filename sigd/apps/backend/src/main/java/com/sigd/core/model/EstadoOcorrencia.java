package com.sigd.core.model;

/**
 * Estado geral de uma ocorrência clínica.
 *
 * ATIVA     — a ocorrência está em curso.
 * RESOLVIDA — a ocorrência foi resolvida com sucesso.
 * CANCELADA — a ocorrência foi cancelada/anulada.
 */
public enum EstadoOcorrencia {
    ATIVA,
    RESOLVIDA,
    CANCELADA
}
