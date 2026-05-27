package com.sigd.core.exception;

public class EventoNotFoundException extends RuntimeException {
    public EventoNotFoundException(Long id) {
        super("Evento não encontrado com o ID: " + id);
    }
}
