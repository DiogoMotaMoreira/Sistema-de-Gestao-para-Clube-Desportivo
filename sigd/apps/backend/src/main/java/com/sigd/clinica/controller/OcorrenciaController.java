package com.sigd.clinica.controller;

import com.sigd.clinica.dto.AltaMedicaDTO;
import com.sigd.clinica.dto.DeliberacaoDTO;
import com.sigd.clinica.dto.FilaEMDDTO;
import com.sigd.clinica.dto.OcorrenciaDTO;
import com.sigd.clinica.service.OcorrenciaService;
import com.sigd.core.model.Utilizador;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * OcorrenciaController — API REST para o módulo Clínica (RF-16).
 *
 * Endpoints para registar ocorrências, consultar fila EMD,
 * listar histórico por atleta e deliberar.
 */
@RestController
@RequestMapping("/api/v1/clinica")
public class OcorrenciaController {

    private final OcorrenciaService ocorrenciaService;

    public OcorrenciaController(OcorrenciaService ocorrenciaService) {
        this.ocorrenciaService = ocorrenciaService;
    }

    /**
     * POST /api/v1/clinica/ocorrencias
     *
     * Regista uma nova ocorrência clínica. Requer ROLE_MEDICO.
     */
    @PostMapping("/ocorrencias")
    @PreAuthorize("hasRole('ROLE_MEDICO')")
    public ResponseEntity<OcorrenciaDTO.Response> registarOcorrencia(
            @Valid @RequestBody OcorrenciaDTO.Request request,
            @AuthenticationPrincipal Utilizador medico) {
        OcorrenciaDTO.Response response = ocorrenciaService.registarOcorrencia(request, medico.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/v1/clinica/fila-emd
     *
     * Lista a fila EMD (ocorrências pendentes de deliberação), paginada.
     * Requer ROLE_MEDICO.
     */
    @GetMapping("/fila-emd")
    @PreAuthorize("hasAnyRole('ROLE_MEDICO', 'ROLE_DIRETOR_TECNICO')")
    public ResponseEntity<Page<FilaEMDDTO>> listarFilaEMD(Pageable pageable) {
        return ResponseEntity.ok(ocorrenciaService.listarFilaEMD(pageable));
    }

    /**
     * GET /api/v1/clinica/ocorrencias/atleta/{id}
     *
     * Lista todas as ocorrências de um atleta. Requer ROLE_MEDICO.
     */
    @GetMapping("/ocorrencias/atleta/{id}")
    @PreAuthorize("hasAnyRole('ROLE_MEDICO', 'ROLE_DIRETOR_TECNICO')")
    public ResponseEntity<List<OcorrenciaDTO.Response>> listarPorAtleta(@PathVariable Long id) {
        return ResponseEntity.ok(ocorrenciaService.listarPorAtleta(id));
    }

    /**
     * GET /api/v1/clinica/ocorrencias/{id}
     *
     * Obtém o detalhe de uma ocorrência. Requer ROLE_MEDICO.
     */
    @GetMapping("/ocorrencias/{id}")
    @PreAuthorize("hasRole('ROLE_MEDICO')")
    public ResponseEntity<OcorrenciaDTO.Response> obter(@PathVariable Long id) {
        return ResponseEntity.ok(ocorrenciaService.obter(id));
    }

    /**
     * POST /api/v1/clinica/ocorrencias/{id}/deliberar
     *
     * Regista a deliberação EMD sobre uma ocorrência. Requer ROLE_ADMIN.
     */
    @PostMapping("/ocorrencias/{id}/deliberar")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<OcorrenciaDTO.Response> deliberar(
            @PathVariable Long id,
            @Valid @RequestBody DeliberacaoDTO deliberacao,
            @AuthenticationPrincipal Utilizador admin) {
        OcorrenciaDTO.Response response = ocorrenciaService.deliberar(id, deliberacao, admin.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/clinica/ocorrencias/{id}/alta
     *
     * Emite alta médica para uma ocorrência clínica (RF-19). Requer ROLE_MEDICO.
     */
    @PostMapping("/ocorrencias/{id}/alta")
    @PreAuthorize("hasRole('ROLE_MEDICO')")
    public ResponseEntity<OcorrenciaDTO.Response> emitirAlta(
            @PathVariable Long id,
            @Valid @RequestBody AltaMedicaDTO altaDTO,
            @AuthenticationPrincipal Utilizador medico) {
        OcorrenciaDTO.Response response = ocorrenciaService.emitirAlta(id, altaDTO, medico.getId());
        return ResponseEntity.ok(response);
    }

}
