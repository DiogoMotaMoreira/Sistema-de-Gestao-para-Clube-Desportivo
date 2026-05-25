package com.sigd.tesouraria.controller;

import com.sigd.tesouraria.dto.AtletaDTO;
import com.sigd.tesouraria.dto.TransferenciaDTO;
import com.sigd.tesouraria.service.AtletaService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * AtletaController — API REST para gestão de atletas.
 *
 * Todas as operações requerem ROLE_SECRETARIA.
 */
@RestController
@RequestMapping("/api/v1/tesouraria/atletas")
@PreAuthorize("hasRole('ROLE_SECRETARIA')")
public class AtletaController {

    private final AtletaService atletaService;

    public AtletaController(AtletaService atletaService) {
        this.atletaService = atletaService;
    }

    /**
     * GET /api/v1/tesouraria/atletas?pesquisa=&equipaId=&page=&size=
     *
     * Lista atletas com pesquisa por nome e filtro opcional por equipa.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_SECRETARIA', 'ROLE_TREINADOR', 'ROLE_DIRETOR_TECNICO')")
    public ResponseEntity<Page<AtletaDTO.Response>> listar(
            @RequestParam(required = false) String pesquisa,
            @RequestParam(required = false) Long equipaId,
            Pageable pageable) {
        return ResponseEntity.ok(atletaService.listar(pesquisa, equipaId, pageable));
    }

    /**
     * GET /api/v1/tesouraria/atletas/{id}
     *
     * Obtém um atleta pelo ID.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SECRETARIA', 'ROLE_TREINADOR', 'ROLE_DIRETOR_TECNICO')")
    public ResponseEntity<AtletaDTO.Response> obter(@PathVariable Long id) {
        return ResponseEntity.ok(atletaService.obter(id));
    }

    /**
     * POST /api/v1/tesouraria/atletas
     *
     * Cria um novo atleta.
     */
    @PostMapping
    public ResponseEntity<AtletaDTO.Response> criar(
            @RequestBody @Valid AtletaDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(atletaService.criar(request));
    }

    /**
     * PUT /api/v1/tesouraria/atletas/{id}
     *
     * Atualiza um atleta existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AtletaDTO.Response> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid AtletaDTO.Request request) {
        return ResponseEntity.ok(atletaService.atualizar(id, request));
    }

    /**
     * PATCH /api/v1/tesouraria/atletas/{id}/transferir
     *
     * Transfere um atleta para uma nova equipa.
     */
    @PatchMapping("/{id}/transferir")
    public ResponseEntity<AtletaDTO.Response> transferir(
            @PathVariable Long id,
            @RequestBody @Valid TransferenciaDTO request) {
        return ResponseEntity.ok(atletaService.transferir(id, request.novaEquipaId()));
    }

}
