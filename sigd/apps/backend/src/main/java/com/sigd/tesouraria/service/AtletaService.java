package com.sigd.tesouraria.service;

import com.sigd.core.exception.AtletaNotFoundException;
import com.sigd.core.exception.EncarregadoNotFoundException;
import com.sigd.core.exception.NifDuplicadoException;
import com.sigd.core.model.Atleta;
import com.sigd.core.model.EncarregadoEducacao;
import com.sigd.core.model.Equipa;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.EncarregadoEducacaoRepository;
import com.sigd.core.repository.EquipaRepository;
import com.sigd.tesouraria.dto.AtletaDTO;
import com.sigd.util.SanitizadorHtml;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * AtletaService — Lógica de negócio para gestão de atletas.
 *
 * Responsabilidades: CRUD, pesquisa paginada, validação NIF, transferência de equipa.
 */
@Service
@Transactional
public class AtletaService {

    private final AtletaRepository atletaRepo;
    private final EncarregadoEducacaoRepository encarregadoRepo;
    private final EquipaRepository equipaRepo;
    private final com.sigd.core.repository.OcorrenciaRepository ocorrenciaRepo;

    public AtletaService(AtletaRepository atletaRepo,
                         EncarregadoEducacaoRepository encarregadoRepo,
                         EquipaRepository equipaRepo,
                         com.sigd.core.repository.OcorrenciaRepository ocorrenciaRepo) {
        this.atletaRepo = atletaRepo;
        this.encarregadoRepo = encarregadoRepo;
        this.equipaRepo = equipaRepo;
        this.ocorrenciaRepo = ocorrenciaRepo;
    }

    /**
     * Lista atletas com pesquisa por nome e filtro opcional por equipa.
     */
    @Transactional(readOnly = true)
    public Page<AtletaDTO.Response> listar(String pesquisa, Long equipaId, Pageable pageable) {
        return atletaRepo.pesquisar(pesquisa, equipaId, pageable)
                .map(this::toResponse);
    }

    /**
     * Obtém um atleta pelo ID.
     *
     * @throws AtletaNotFoundException se não existir
     */
    @Transactional(readOnly = true)
    public AtletaDTO.Response obter(Long id) {
        Atleta atleta = atletaRepo.findById(id)
                .orElseThrow(() -> new AtletaNotFoundException(id));
        return toResponse(atleta);
    }

    /**
     * Cria um novo atleta.
     *
     * @throws NifDuplicadoException se o NIF já estiver atribuído
     * @throws EncarregadoNotFoundException se o encarregado não existir
     */
    public AtletaDTO.Response criar(AtletaDTO.Request request) {
        validarNifUnico(request.nif(), null);

        EncarregadoEducacao encarregado = encarregadoRepo.findById(request.encarregadoId())
                .orElseThrow(() -> new EncarregadoNotFoundException(request.encarregadoId()));

        Equipa equipa = null;
        if (request.equipaId() != null) {
            equipa = equipaRepo.findById(request.equipaId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Equipa não encontrada com ID: " + request.equipaId()));
        }

        Atleta atleta = new Atleta();
        atleta.setNomeCompleto(SanitizadorHtml.sanitizar(request.nomeCompleto()));
        atleta.setDataNascimento(request.dataNascimento());
        atleta.setNif(request.nif());
        atleta.setNumeroSocio(request.numeroSocio());
        atleta.setPosicao(request.posicao());
        atleta.setEncarregado(encarregado);
        atleta.setEquipa(equipa);

        atleta = atletaRepo.save(atleta);
        return toResponse(atleta);
    }

    /**
     * Atualiza um atleta existente.
     *
     * @throws AtletaNotFoundException se o atleta não existir
     * @throws NifDuplicadoException se o NIF já estiver atribuído a outro atleta
     * @throws EncarregadoNotFoundException se o novo encarregado não existir
     */
    public AtletaDTO.Response atualizar(Long id, AtletaDTO.Request request) {
        Atleta atleta = atletaRepo.findById(id)
                .orElseThrow(() -> new AtletaNotFoundException(id));

        validarNifUnico(request.nif(), id);

        EncarregadoEducacao encarregado = encarregadoRepo.findById(request.encarregadoId())
                .orElseThrow(() -> new EncarregadoNotFoundException(request.encarregadoId()));

        Equipa equipa = null;
        if (request.equipaId() != null) {
            equipa = equipaRepo.findById(request.equipaId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Equipa não encontrada com ID: " + request.equipaId()));
        }

        atleta.setNomeCompleto(SanitizadorHtml.sanitizar(request.nomeCompleto()));
        atleta.setDataNascimento(request.dataNascimento());
        atleta.setNif(request.nif());
        atleta.setNumeroSocio(request.numeroSocio());
        atleta.setPosicao(request.posicao());
        atleta.setEncarregado(encarregado);
        atleta.setEquipa(equipa);

        atleta = atletaRepo.save(atleta);
        return toResponse(atleta);
    }

    /**
     * Transfere um atleta para uma nova equipa.
     *
     * @throws AtletaNotFoundException se o atleta não existir
     */
    public AtletaDTO.Response transferir(Long atletaId, Long novaEquipaId) {
        Atleta atleta = atletaRepo.findById(atletaId)
                .orElseThrow(() -> new AtletaNotFoundException(atletaId));

        Equipa novaEquipa = equipaRepo.findById(novaEquipaId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Equipa não encontrada com ID: " + novaEquipaId));

        atleta.setEquipa(novaEquipa);
        atleta = atletaRepo.save(atleta);
        return toResponse(atleta);
    }

    /**
     * Valida os documentos de um atleta, alterando a sua elegibilidade para APTO.
     * Atribui também um número de sócio se estiver em falta.
     */
    public AtletaDTO.Response validarDocumentos(Long id) {
        Atleta atleta = atletaRepo.findById(id)
                .orElseThrow(() -> new AtletaNotFoundException(id));

        atleta.setEstadoElegibilidade(com.sigd.core.model.EstadoElegibilidade.APTO);

        if (atleta.getNumeroSocio() == null || atleta.getNumeroSocio().trim().isEmpty()) {
            atleta.setNumeroSocio("SOC-" + atleta.getId());
        }

        atleta = atletaRepo.save(atleta);
        return toResponse(atleta);
    }

    /**
     * Obtém a elegibilidade de um atleta.
     */
    @Transactional(readOnly = true)
    public AtletaDTO.Elegibilidade obterElegibilidade(Long id) {
        Atleta atleta = atletaRepo.findById(id)
                .orElseThrow(() -> new AtletaNotFoundException(id));

        boolean bloqueadoPorEMD = atleta.getEstadoElegibilidade() == com.sigd.core.model.EstadoElegibilidade.PENDENTE_EMD;
        
        java.util.List<com.sigd.core.model.Ocorrencia> ocorrencias = ocorrenciaRepo.findByAtletaId(id);
        boolean bloqueadoPorLesao = ocorrencias.stream()
                .anyMatch(o -> o.getEstado() == com.sigd.core.model.EstadoOcorrencia.ATIVA && 
                               o.getGrauRestricao() == com.sigd.core.model.GrauRestricaoDesportiva.VERMELHO);
                               
        boolean condicionado = ocorrencias.stream()
                .anyMatch(o -> o.getEstado() == com.sigd.core.model.EstadoOcorrencia.ATIVA && 
                               o.getGrauRestricao() == com.sigd.core.model.GrauRestricaoDesportiva.AMARELO);

        boolean apto = atleta.getEstadoElegibilidade() == com.sigd.core.model.EstadoElegibilidade.APTO && !bloqueadoPorLesao;

        return new AtletaDTO.Elegibilidade(
                atleta.getId(),
                atleta.getNomeCompleto(),
                atleta.getEstadoElegibilidade().name(),
                bloqueadoPorEMD,
                bloqueadoPorLesao,
                condicionado,
                apto
        );
    }

    // === Helpers privados ===

    private void validarNifUnico(String nif, Long excludeId) {
        if (nif == null || nif.isBlank()) return;

        atletaRepo.findByNif(nif).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new NifDuplicadoException(nif);
            }
        });
    }

    private AtletaDTO.Response toResponse(Atleta a) {
        return new AtletaDTO.Response(
                a.getId(),
                a.getNomeCompleto(),
                a.getDataNascimento(),
                a.getNif(),
                a.getNumeroSocio(),
                a.getPosicao(),
                a.getEstadoElegibilidade() != null ? a.getEstadoElegibilidade().name() : null,
                a.getEquipa() != null ? a.getEquipa().getId() : null,
                a.getEquipa() != null ? a.getEquipa().getNome() : null,
                a.getEncarregado().getId(),
                a.getEncarregado().getNome(),
                a.getCriadoEm(),
                a.getAtualizadoEm()
        );
    }

}
