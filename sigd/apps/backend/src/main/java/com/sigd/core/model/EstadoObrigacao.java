package com.sigd.core.model;

/**
 * EstadoObrigacao — Estado de pagamento de uma obrigação financeira.
 *
 * - PENDENTE: ainda não pago, dentro do prazo
 * - PAGO: pagamento registado
 * - EM_ATRASO: data de vencimento ultrapassada sem pagamento
 */
public enum EstadoObrigacao {
    PENDENTE,
    PAGO,
    EM_ATRASO
}
