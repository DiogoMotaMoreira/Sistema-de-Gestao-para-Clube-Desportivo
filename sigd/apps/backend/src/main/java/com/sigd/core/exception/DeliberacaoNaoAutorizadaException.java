package com.sigd.core.exception;

/**
 * Lançada quando um utilizador sem permissão tenta registar uma deliberação EMD.
 */
public class DeliberacaoNaoAutorizadaException extends RuntimeException {

    public DeliberacaoNaoAutorizadaException() {
        super("Apenas medico pode registar deliberações");
    }

    public DeliberacaoNaoAutorizadaException(String message) {
        super(message);
    }

}
