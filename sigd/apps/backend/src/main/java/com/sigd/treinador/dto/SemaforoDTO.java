package com.sigd.treinador.dto;

/**
 * DTO para resposta do Semáforo Clínico de Prontidão (RF-16).
 *
 * Contém o estado de prontidão clínica (VERDE, AMARELO, VERMELHO, BLOQUEADO)
 * de cada atleta de forma mascarada, sem divulgar quaisquer diagnósticos clínicos confidenciais.
 */
public record SemaforoDTO(
    Long atletaId,
    String atletaNome,
    String semaforo,
    String motivo
) {}
