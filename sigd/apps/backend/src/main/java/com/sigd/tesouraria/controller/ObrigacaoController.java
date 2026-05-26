package com.sigd.tesouraria.controller;

import com.sigd.tesouraria.dto.ObrigacaoFinanceiraDTO;
import com.sigd.tesouraria.service.ObrigacaoFinanceiraService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * ObrigacaoController — API REST para gestão de obrigações financeiras.
 *
 * Todas as operações requerem ROLE_SECRETARIA.
 */
@RestController
@RequestMapping("/api/v1/tesouraria")
@PreAuthorize("hasRole('ROLE_SECRETARIA')")
public class ObrigacaoController {

    private final ObrigacaoFinanceiraService obrigacaoService;
    private final com.sigd.tesouraria.service.ProvisaoService provisaoService;

    public ObrigacaoController(ObrigacaoFinanceiraService obrigacaoService,
                               com.sigd.tesouraria.service.ProvisaoService provisaoService) {
        this.obrigacaoService = obrigacaoService;
        this.provisaoService = provisaoService;
    }

    /**
     * POST /api/v1/tesouraria/pagamentos/{id}/registar
     *
     * Regista o pagamento de uma obrigação financeira.
     * Valida que a entidadeJuridica está definida (segregação SAD/Clube).
     */
    @PostMapping("/pagamentos/{id}/registar")
    public ResponseEntity<ObrigacaoFinanceiraDTO.Response> registarPagamento(
            @PathVariable Long id,
            @RequestParam(required = false) LocalDate dataPagamento) {
        return ResponseEntity.ok(obrigacaoService.registarPagamento(id, dataPagamento));
    }

    /**
     * GET /api/v1/tesouraria/ee/{id}/obrigacoes
     *
     * Lista todas as obrigações financeiras de um encarregado.
     */
    @GetMapping("/ee/{id}/obrigacoes")
    public ResponseEntity<List<ObrigacaoFinanceiraDTO.Response>> listarPorEncarregado(
            @PathVariable Long id) {
        return ResponseEntity.ok(obrigacaoService.listarPorEncarregado(id));
    }

    /**
     * POST /api/v1/tesouraria/provisoes/gerar?epocaId={id}
     *
     * Gera obrigações financeiras para a época corrente.
     */
    @PostMapping("/provisoes/gerar")
    @PreAuthorize("hasAnyRole('ROLE_SECRETARIA', 'ROLE_ADMIN')")
    public ResponseEntity<Void> gerarProvisaoEpoca(@RequestParam Long epocaId) {
        provisaoService.gerarProvisaoEpoca(epocaId);
        return ResponseEntity.ok().build();
    }

}
