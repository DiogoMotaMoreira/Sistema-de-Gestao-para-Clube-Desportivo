package com.sigd.core.model;

/**
 * TipoObrigacao — Tipo de obrigação financeira.
 *
 * - QUOTA_ANUAL: quota anual de inscrição no escalão
 * - MENSALIDADE: mensalidade mensal (base ou sócio)
 * - INSCRICAO: taxa de inscrição avulsa
 */
public enum TipoObrigacao {
    QUOTA_ANUAL,
    MENSALIDADE,
    INSCRICAO
}
