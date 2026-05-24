package com.sigd.tesouraria.controller;

import com.sigd.tesouraria.dto.EncarregadoEducacaoDTO;
import com.sigd.tesouraria.dto.SituacaoFinanceiraDTO;
import com.sigd.tesouraria.service.EncarregadoService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * EncarregadoController — API REST para gestão de encarregados de educação.
 *
 * Todas as operações requerem ROLE_SECRETARIA.
 */
@RestController
@RequestMapping("/api/v1/tesouraria/ee")
@PreAuthorize("hasRole('ROLE_SECRETARIA')")
public class EncarregadoController {

    private final EncarregadoService encarregadoService;

    public EncarregadoController(EncarregadoService encarregadoService) {
        this.encarregadoService = encarregadoService;
    }

    /**
     * GET /api/v1/tesouraria/ee?pesquisa=&page=&size=
     *
     * Lista encarregados com pesquisa por nome/NIF e paginação.
     */
    @GetMapping
    public ResponseEntity<Page<EncarregadoEducacaoDTO.Response>> listar(
            @RequestParam(required = false) String pesquisa,
            Pageable pageable) {
        return ResponseEntity.ok(encarregadoService.listar(pesquisa, pageable));
    }

    /**
     * GET /api/v1/tesouraria/ee/{id}
     *
     * Obtém um encarregado pelo ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<EncarregadoEducacaoDTO.Response> obter(@PathVariable Long id) {
        return ResponseEntity.ok(encarregadoService.obter(id));
    }

    /**
     * POST /api/v1/tesouraria/ee
     *
     * Cria um novo encarregado de educação.
     */
    @PostMapping
    public ResponseEntity<EncarregadoEducacaoDTO.Response> criar(
            @RequestBody @Valid EncarregadoEducacaoDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(encarregadoService.criar(request));
    }

    /**
     * PUT /api/v1/tesouraria/ee/{id}
     *
     * Atualiza um encarregado existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EncarregadoEducacaoDTO.Response> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid EncarregadoEducacaoDTO.Request request) {
        return ResponseEntity.ok(encarregadoService.atualizar(id, request));
    }

    /**
     * GET /api/v1/tesouraria/ee/{id}/situacao-financeira
     *
     * Retorna a situação financeira de um encarregado.
     */
    @GetMapping("/{id}/situacao-financeira")
    public ResponseEntity<SituacaoFinanceiraDTO> situacaoFinanceira(@PathVariable Long id) {
        return ResponseEntity.ok(encarregadoService.obterSituacaoFinanceira(id));
    }

}
