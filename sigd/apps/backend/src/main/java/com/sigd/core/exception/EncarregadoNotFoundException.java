package com.sigd.core.exception;

/**
 * Lançada quando um encarregado de educação não é encontrado pelo ID fornecido.
 */
public class EncarregadoNotFoundException extends RuntimeException {

    public EncarregadoNotFoundException(Long id) {
        super("Encarregado de Educação não encontrado com ID: " + id);
    }

}
