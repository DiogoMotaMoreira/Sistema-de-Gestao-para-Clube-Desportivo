package com.sigd.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class UtilizadorAdminDTO {

    public record Response(
            Long id,
            String username,
            String email,
            String role,
            Boolean ativo,
            LocalDateTime criadoEm,
            LocalDateTime atualizadoEm
    ) {}

    public record Request(
            @NotBlank(message = "O username é obrigatório")
            String username,

            @NotBlank(message = "O email é obrigatório")
            @Email(message = "Email com formato inválido")
            String email,

            @NotBlank(message = "A role é obrigatória")
            String role,

            String passwordHash
    ) {}
}
