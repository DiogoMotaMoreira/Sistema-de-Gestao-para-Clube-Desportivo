package com.sigd.core.exception;

/**
 * Lançada quando se tenta criar/atualizar uma entidade com um NIF
 * que já está atribuído a outra entidade.
 */
public class NifDuplicadoException extends RuntimeException {

    public NifDuplicadoException(String nif) {
        super("Já existe um registo com o NIF: " + nif);
    }

}
