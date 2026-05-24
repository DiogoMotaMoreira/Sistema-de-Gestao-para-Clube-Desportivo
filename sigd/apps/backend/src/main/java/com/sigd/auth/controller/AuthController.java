package com.sigd.auth.controller;

import com.sigd.auth.dto.LoginRequest;
import com.sigd.auth.dto.LoginResponse;
import com.sigd.auth.dto.RefreshTokenRequest;
import com.sigd.auth.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * AuthController — Endpoints de autenticação do SIGD.
 *
 * Rotas públicas (SecurityConfig permite sem autenticação):
 * - POST /api/v1/auth/login   → autentica e retorna JWT tokens
 * - POST /api/v1/auth/refresh → renova access token com refresh token
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /api/v1/auth/login
     *
     * Autentica um utilizador com username/password.
     * Retorna access token, refresh token, role e metadata.
     *
     * @param request LoginRequest com username e password (@Valid)
     * @return LoginResponse com tokens JWT
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/auth/refresh
     *
     * Renova o access token usando um refresh token válido.
     *
     * @param request RefreshTokenRequest com o refresh token (@Valid)
     * @return LoginResponse com novo access token
     */
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@RequestBody @Valid RefreshTokenRequest request) {
        LoginResponse response = authService.refresh(request.refreshToken());
        return ResponseEntity.ok(response);
    }

}
