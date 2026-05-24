package com.sigd.core.exception;

/**
 * Lançada quando um atleta não é encontrado pelo ID fornecido.
 */
public class AtletaNotFoundException extends RuntimeException {

    public AtletaNotFoundException(Long id) {
        super("Atleta não encontrado com ID: " + id);
    }

}
