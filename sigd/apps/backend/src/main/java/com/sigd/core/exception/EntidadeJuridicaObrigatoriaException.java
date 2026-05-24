package com.sigd.core.exception;

/**
 * Lançada quando uma operação financeira é tentada sem a entidade jurídica
 * (CLUBE/SAD) definida. A segregação financeira é obrigatória (RF-26+).
 */
public class EntidadeJuridicaObrigatoriaException extends RuntimeException {

    public EntidadeJuridicaObrigatoriaException() {
        super("A entidade jurídica (CLUBE/SAD) é obrigatória para operações financeiras.");
    }

}
