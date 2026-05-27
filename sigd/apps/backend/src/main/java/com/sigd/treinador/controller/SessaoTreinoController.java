package com.sigd.treinador.controller;

import com.sigd.treinador.dto.AvaliacaoPosSessionDTO;
import com.sigd.treinador.dto.ChamadaDTO;
import com.sigd.treinador.dto.SessaoTreinoDTO;
import com.sigd.treinador.service.SessaoTreinoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/treinador/sessoes")
@PreAuthorize("hasRole('ROLE_TREINADOR')")
public class SessaoTreinoController {

    private final SessaoTreinoService sessaoTreinoService;

    public SessaoTreinoController(SessaoTreinoService sessaoTreinoService) {
        this.sessaoTreinoService = sessaoTreinoService;
    }

    @PostMapping
    public ResponseEntity<SessaoTreinoDTO.Response> criarSessao(@RequestBody @Valid SessaoTreinoDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(sessaoTreinoService.criarSessao(request));
    }

    @GetMapping
    public ResponseEntity<List<SessaoTreinoDTO.Response>> listarPorEquipa(@RequestParam Long equipaId) {
        return ResponseEntity.ok(sessaoTreinoService.listarPorEquipa(equipaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessaoTreinoDTO.Response> obter(@PathVariable Long id) {
        return ResponseEntity.ok(sessaoTreinoService.obter(id));
    }

    @PostMapping("/{id}/chamada")
    public ResponseEntity<ChamadaDTO.Response> registarChamada(@PathVariable Long id, @RequestBody @Valid ChamadaDTO.Request request) {
        return ResponseEntity.ok(sessaoTreinoService.registarChamada(id, request));
    }

    @PostMapping("/{id}/avaliacao")
    public ResponseEntity<AvaliacaoPosSessionDTO.Response> registarAvaliacoes(@PathVariable Long id, @RequestBody @Valid AvaliacaoPosSessionDTO.Request request) {
        return ResponseEntity.ok(sessaoTreinoService.registarAvaliacoes(id, request));
    }

    @GetMapping("/{id}/detalhe")
    public ResponseEntity<SessaoTreinoDTO.DetalheResponse> obterDetalhe(@PathVariable Long id) {
        return ResponseEntity.ok(sessaoTreinoService.obterDetalhe(id));
    }
}
