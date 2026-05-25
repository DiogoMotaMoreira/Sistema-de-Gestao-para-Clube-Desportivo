package com.sigd.admin.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class UtilizadorJaExisteException extends RuntimeException {
    public UtilizadorJaExisteException(String message) {
        super(message);
    }
}
