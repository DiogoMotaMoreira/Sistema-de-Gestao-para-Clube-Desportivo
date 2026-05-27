package com.sigd.core.exception;

public class FichaJogoDuplicadaException extends RuntimeException {
    public FichaJogoDuplicadaException(Long eventoId) {
        super("Já existe uma ficha de jogo submetida para o evento com o ID: " + eventoId);
    }
}
