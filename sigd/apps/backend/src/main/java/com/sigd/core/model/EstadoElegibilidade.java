package com.sigd.core.model;

/**
 * EstadoElegibilidade — Estado de elegibilidade de um atleta.
 *
 * Determina se o atleta pode ser convocado/participar em atividades:
 * - APTO: sem restrições
 * - INAPTO: bloqueado por razões clínicas
 * - PENDENTE_EMD: aguarda exame médico-desportivo
 * - BLOQUEADO_FINANCEIRO: dívidas pendentes impedem participação
 */
public enum EstadoElegibilidade {
    APTO,
    INAPTO,
    PENDENTE_EMD,
    BLOQUEADO_FINANCEIRO
}
