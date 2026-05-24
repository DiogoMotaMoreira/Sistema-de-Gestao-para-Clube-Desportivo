package com.sigd.auth.dto;

/**
 * LoginResponse — DTO de resposta de autenticação.
 *
 * Contém os tokens JWT, role do utilizador e metadata.
 * Retornado por POST /api/v1/auth/login e POST /api/v1/auth/refresh.
 */
public record LoginResponse(
    String accessToken,
    String refreshToken,
    String role,
    String username,
    long expiresIn
) {}
