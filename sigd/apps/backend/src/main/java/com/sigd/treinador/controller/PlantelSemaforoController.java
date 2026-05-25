package com.sigd.treinador.controller;

import com.sigd.treinador.dto.SemaforoDTO;
import com.sigd.treinador.service.SemaforoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * PlantelSemaforoController — API REST para consulta do Semáforo Clínico (RF-16).
 *
 * Mapeia as operações sob o papel de Treinador ou Diretor Técnico.
 */
@RestController
@RequestMapping("/api/v1/treinador/plantel")
@PreAuthorize("hasAnyRole('ROLE_TREINADOR', 'ROLE_DIRETOR_TECNICO')")
public class PlantelSemaforoController {

    private final SemaforoService semaforoService;

    public PlantelSemaforoController(SemaforoService semaforoService) {
        this.semaforoService = semaforoService;
    }

    /**
     * GET /api/v1/treinador/plantel/{equipaId}/semaforo
     *
     * Devolve a prontidão clínica mascarada para cada atleta da equipa.
     */
    @GetMapping("/{equipaId}/semaforo")
    public ResponseEntity<List<SemaforoDTO>> obterSemaforoPlantel(@PathVariable Long equipaId) {
        return ResponseEntity.ok(semaforoService.obterSemaforoPlantel(equipaId));
    }
}
