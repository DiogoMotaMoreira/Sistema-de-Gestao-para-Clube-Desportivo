package com.sigd.exception;

import com.sigd.core.exception.AtletaComRestricaoException;
import com.sigd.core.exception.AtletaNotFoundException;
import com.sigd.core.exception.DeliberacaoNaoAutorizadaException;
import com.sigd.core.exception.EncarregadoNotFoundException;
import com.sigd.core.exception.EntidadeJuridicaObrigatoriaException;
import com.sigd.core.exception.NifDuplicadoException;
import com.sigd.core.exception.OcorrenciaNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Formato padronizado de erro: { status, error, message, timestamp, path }

    // === Exceções de domínio (Tesouraria / Secretaria) ===

    @ExceptionHandler(AtletaNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleAtletaNotFound(
            AtletaNotFoundException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request);
    }

    @ExceptionHandler(EncarregadoNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleEncarregadoNotFound(
            EncarregadoNotFoundException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request);
    }

    @ExceptionHandler(NifDuplicadoException.class)
    public ResponseEntity<Map<String, Object>> handleNifDuplicado(
            NifDuplicadoException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.CONFLICT, "Conflict", ex.getMessage(), request);
    }

    @ExceptionHandler(EntidadeJuridicaObrigatoriaException.class)
    public ResponseEntity<Map<String, Object>> handleEntidadeJuridicaObrigatoria(
            EntidadeJuridicaObrigatoriaException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request);
    }

    // === Exceções de domínio (Clínica / RF-16) ===

    @ExceptionHandler(OcorrenciaNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleOcorrenciaNotFound(
            OcorrenciaNotFoundException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request);
    }

    @ExceptionHandler(com.sigd.core.exception.EventoNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleEventoNotFound(
            com.sigd.core.exception.EventoNotFoundException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request);
    }

    @ExceptionHandler(DeliberacaoNaoAutorizadaException.class)
    public ResponseEntity<Map<String, Object>> handleDeliberacaoNaoAutorizada(
            DeliberacaoNaoAutorizadaException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Forbidden", ex.getMessage(), request);
    }

    @ExceptionHandler(AtletaComRestricaoException.class)
    public ResponseEntity<Map<String, Object>> handleAtletaComRestricao(
            AtletaComRestricaoException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.CONFLICT, "Conflict", ex.getMessage(), request);
    }

    @ExceptionHandler(com.sigd.core.exception.FichaJogoDuplicadaException.class)
    public ResponseEntity<Map<String, Object>> handleFichaJogoDuplicada(
            com.sigd.core.exception.FichaJogoDuplicadaException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.CONFLICT, "Conflict", ex.getMessage(), request);
    }

    // === Exceções de validação e segurança ===

    // BUG-023: JSON malformado
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleInvalidJson(
            HttpMessageNotReadableException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("erro", "Formato JSON inválido ou corpo do pedido em falta");
        error.put("codigo", "400");
        return ResponseEntity.badRequest().body(error);
    }

    // BUG-015: Conta desactivada/bloqueada
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<Map<String, String>> handleContaBloqueada(
            DisabledException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("erro", "Conta bloqueada. Contacte o administrador.");
        error.put("codigo", "403");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    // BUG-015: Garantir que LockedException também é tratada
    @ExceptionHandler(LockedException.class)
    public ResponseEntity<Map<String, String>> handleContaLocked(
            LockedException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("erro", "Conta bloqueada. Contacte o administrador.");
        error.put("codigo", "403");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(
            IllegalStateException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("erro", ex.getMessage());
        error.put("codigo", "403");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex, WebRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));

        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Validation Error", message, request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(
            BadCredentialsException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Unauthorized",
                "Credenciais inválidas", request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(
            AccessDeniedException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Forbidden",
                "Sem permissão para aceder a este recurso", request);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(
            NoHandlerFoundException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "Not Found",
                "Recurso não encontrado: " + ex.getRequestURL(), request);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(
            IllegalArgumentException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request",
                ex.getMessage(), request);
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Map<String, String>> handleNPE(
            NullPointerException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("erro", "Erro interno de processamento");
        error.put("codigo", "500");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error",
                ex.getMessage(), request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(
            Exception ex, WebRequest request) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error",
                "Ocorreu um erro interno. Tente novamente mais tarde.", request);
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(
            HttpStatus status, String error, String message, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("path", request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(body, status);
    }

}
