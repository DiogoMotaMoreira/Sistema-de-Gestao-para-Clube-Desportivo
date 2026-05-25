package com.sigd.tesouraria.controller;

import com.sigd.core.model.Equipa;
import com.sigd.core.model.Escalao;
import com.sigd.core.model.Modalidade;
import com.sigd.core.repository.EquipaRepository;
import com.sigd.core.repository.EscalaoRepository;
import com.sigd.core.repository.ModalidadeRepository;
import com.sigd.tesouraria.dto.EquipaDTO;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * EquipaController — API REST para gestão de equipas.
 *
 * Todas as operações requerem ROLE_SECRETARIA.
 */
@RestController
@RequestMapping("/api/v1/tesouraria/equipas")
@PreAuthorize("hasRole('ROLE_SECRETARIA')")
public class EquipaController {

    private final EquipaRepository equipaRepo;
    private final EscalaoRepository escalaoRepo;
    private final ModalidadeRepository modalidadeRepo;

    public EquipaController(EquipaRepository equipaRepo,
                            EscalaoRepository escalaoRepo,
                            ModalidadeRepository modalidadeRepo) {
        this.equipaRepo = equipaRepo;
        this.escalaoRepo = escalaoRepo;
        this.modalidadeRepo = modalidadeRepo;
    }

    /**
     * GET /api/v1/tesouraria/equipas
     *
     * Lista todas as equipas ativas.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_SECRETARIA', 'ROLE_TREINADOR', 'ROLE_DIRETOR_TECNICO')")
    public ResponseEntity<List<EquipaDTO.Response>> listar() {
        List<EquipaDTO.Response> equipas = equipaRepo.findByAtivaTrue().stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(equipas);
    }

    /**
     * POST /api/v1/tesouraria/equipas
     *
     * Cria uma nova equipa.
     */
    @PostMapping
    public ResponseEntity<EquipaDTO.Response> criar(@RequestBody @Valid EquipaDTO.Request request) {
        Escalao escalao = escalaoRepo.findById(request.escalaoId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Escalão não encontrado com ID: " + request.escalaoId()));

        Modalidade modalidade = modalidadeRepo.findById(request.modalidadeId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Modalidade não encontrada com ID: " + request.modalidadeId()));

        Equipa equipa = new Equipa();
        equipa.setNome(request.nome());
        equipa.setEscalao(escalao);
        equipa.setModalidade(modalidade);

        equipa = equipaRepo.save(equipa);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(equipa));
    }

    private EquipaDTO.Response toResponse(Equipa e) {
        return new EquipaDTO.Response(
                e.getId(),
                e.getNome(),
                e.getEscalao() != null ? e.getEscalao().getDesignacao() : null,
                e.getModalidade() != null ? e.getModalidade().getNome() : null,
                e.getAtiva(),
                e.getAtletas() != null ? e.getAtletas().size() : 0
        );
    }

}
