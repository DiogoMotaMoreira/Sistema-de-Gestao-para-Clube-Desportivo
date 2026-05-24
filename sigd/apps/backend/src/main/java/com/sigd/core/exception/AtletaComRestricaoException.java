package com.sigd.core.exception;

/**
 * Lançada quando se tenta registar uma ocorrência para um atleta
 * que já possui uma restrição desportiva ativa.
 */
public class AtletaComRestricaoException extends RuntimeException {

    public AtletaComRestricaoException(String nomeAtleta, String grau) {
        super("Atleta " + nomeAtleta + " já tem restrição ativa: " + grau);
    }

}
