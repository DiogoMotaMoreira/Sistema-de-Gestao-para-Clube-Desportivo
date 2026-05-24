package com.sigd.auth.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * LoginRequest — DTO para pedido de autenticação.
 *
 * Ambos os campos são obrigatórios (@NotBlank).
 * Usado no POST /api/v1/auth/login.
 */
public record LoginRequest(

    @NotBlank(message = "O username é obrigatório")
    String username,

    @NotBlank(message = "A password é obrigatória")
    String password

) {}
