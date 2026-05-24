package com.sigd.core.exception;

/**
 * Lançada quando uma ocorrência clínica não é encontrada pelo ID fornecido.
 */
public class OcorrenciaNotFoundException extends RuntimeException {

    public OcorrenciaNotFoundException(Long id) {
        super("Ocorrência não encontrada com ID: " + id);
    }

}
