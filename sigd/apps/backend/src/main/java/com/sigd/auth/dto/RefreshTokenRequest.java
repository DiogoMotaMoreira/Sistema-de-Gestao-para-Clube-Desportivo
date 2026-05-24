package com.sigd.auth.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * RefreshTokenRequest — DTO para pedido de refresh de token.
 *
 * Usado no POST /api/v1/auth/refresh.
 */
public record RefreshTokenRequest(

    @NotBlank(message = "O refreshToken é obrigatório")
    String refreshToken

) {}
