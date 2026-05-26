package com.sigd.clinica.dto;

/**
 * DTO para as estatísticas da Fila de EMDs.
 */
public record FilaEMDStatsDTO(
    long pendentes,
    long aprovadosEsteMes,
    long rejeitados
) {}
