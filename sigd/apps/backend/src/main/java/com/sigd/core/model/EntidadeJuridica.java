package com.sigd.core.model;

/**
 * EntidadeJuridica — Discriminador de segregação financeira SAD/Clube.
 *
 * OBRIGATÓRIO em todas as transações financeiras (RF-26+).
 * Garante separação contabilística entre as duas entidades jurídicas do PER.
 *
 * - CLUBE: receitas/despesas da associação desportiva
 * - SAD: receitas/despesas da Sociedade Anónima Desportiva
 */
public enum EntidadeJuridica {
    CLUBE,
    SAD
}
