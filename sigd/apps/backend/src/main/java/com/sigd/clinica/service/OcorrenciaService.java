package com.sigd.clinica.service;

import com.sigd.clinica.dto.AltaMedicaDTO;
import com.sigd.clinica.dto.DeliberacaoDTO;
import com.sigd.clinica.dto.FilaEMDDTO;
import com.sigd.clinica.dto.OcorrenciaDTO;
import com.sigd.core.exception.AtletaComRestricaoException;
import com.sigd.core.exception.AtletaNotFoundException;
import com.sigd.core.exception.DeliberacaoNaoAutorizadaException;
import com.sigd.core.exception.OcorrenciaNotFoundException;
import com.sigd.core.model.*;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.OcorrenciaRepository;
import com.sigd.core.repository.UtilizadorRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * OcorrenciaService — Lógica de negócio para o módulo Clínica (RF-16).
 *
 * Responsabilidades: registar ocorrências clínicas, gerir fila EMD,
 * deliberar ocorrências e listar histórico por atleta.
 */
@Service
@Transactional
public class OcorrenciaService {

    private final OcorrenciaRepository ocorrenciaRepo;
    private final AtletaRepository atletaRepo;
    private final UtilizadorRepository utilizadorRepo;

    public OcorrenciaService(OcorrenciaRepository ocorrenciaRepo,
                             AtletaRepository atletaRepo,
                             UtilizadorRepository utilizadorRepo) {
        this.ocorrenciaRepo = ocorrenciaRepo;
        this.atletaRepo = atletaRepo;
        this.utilizadorRepo = utilizadorRepo;
    }

    /**
     * Regista uma nova ocorrência clínica para um atleta.
     *
     * Regra de negócio: verifica se o atleta já possui uma ocorrência ativa
     * com restrição AMARELO ou VERMELHO antes de registar.
     *
     * @throws AtletaNotFoundException se o atleta não existir
     * @throws AtletaComRestricaoException se o atleta já tiver restrição ativa
     */
    public OcorrenciaDTO.Response registarOcorrencia(OcorrenciaDTO.Request request, Long medicoCriadorId) {
        Atleta atleta = atletaRepo.findById(request.atletaId())
                .orElseThrow(() -> new AtletaNotFoundException(request.atletaId()));

        // Verificar se o atleta já tem uma ocorrência ativa com restrição
        List<Ocorrencia> ocorrenciasAtivas = ocorrenciaRepo
                .findByEstadoEMDAndEstado(EstadoEMD.EM_AVALIACAO, EstadoOcorrencia.ATIVA);
        for (Ocorrencia oc : ocorrenciasAtivas) {
            if (oc.getAtleta().getId().equals(atleta.getId())
                    && oc.getGrauRestricao() != GrauRestricaoDesportiva.VERDE) {
                throw new AtletaComRestricaoException(
                        atleta.getNomeCompleto(),
                        oc.getGrauRestricao().name());
            }
        }

        Utilizador medico = utilizadorRepo.findById(medicoCriadorId).orElse(null);

        Ocorrencia ocorrencia = new Ocorrencia();
        ocorrencia.setAtleta(atleta);
        ocorrencia.setDataOcorrencia(request.dataOcorrencia());
        ocorrencia.setTipo(request.tipo());
        ocorrencia.setDiagnostico(request.diagnostico());
        ocorrencia.setGrauRestricao(request.grauRestricao());
        ocorrencia.setDataReavaliacao(request.dataReavaliacao());
        ocorrencia.setEstadoEMD(EstadoEMD.EM_AVALIACAO);
        ocorrencia.setEstado(EstadoOcorrencia.ATIVA);
        ocorrencia.setMedicoCriador(medico);

        ocorrencia = ocorrenciaRepo.save(ocorrencia);

        // Atualizar o estado_elegibilidade do atleta
        if (request.grauRestricao() == GrauRestricaoDesportiva.VERMELHO) {
            atleta.setEstadoElegibilidade(EstadoElegibilidade.INAPTO);
        } else if (request.grauRestricao() == GrauRestricaoDesportiva.AMARELO) {
            atleta.setEstadoElegibilidade(EstadoElegibilidade.CONDICIONADO);
        } else if (request.grauRestricao() == GrauRestricaoDesportiva.VERDE) {
            atleta.setEstadoElegibilidade(EstadoElegibilidade.APTO);
        }
        atletaRepo.save(atleta);

        return toResponse(ocorrencia);
    }

    /**
     * Lista a fila EMD (ocorrências com estadoEMD = EM_AVALIACAO), paginada.
     */
    @Transactional(readOnly = true)
    public Page<FilaEMDDTO> listarFilaEMD(Pageable pageable) {
        return ocorrenciaRepo.findByEstadoEMD(EstadoEMD.EM_AVALIACAO, pageable)
                .map(this::toFilaEMDDTO);
    }

    /**
     * Lista todas as ocorrências de um atleta.
     *
     * @throws AtletaNotFoundException se o atleta não existir
     */
    @Transactional(readOnly = true)
    public List<OcorrenciaDTO.Response> listarPorAtleta(Long atletaId) {
        if (!atletaRepo.existsById(atletaId)) {
            throw new AtletaNotFoundException(atletaId);
        }
        return ocorrenciaRepo.findByAtletaId(atletaId).stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Regista a deliberação EMD sobre uma ocorrência.
     *
     * Atualiza o grau de restrição final, muda o estadoEMD para DELIBERADO,
     * e regista o médico que deliberou.
     *
     * @throws OcorrenciaNotFoundException se a ocorrência não existir
     * @throws DeliberacaoNaoAutorizadaException se o utilizador não tiver role ADMIN
     */
    public OcorrenciaDTO.Response deliberar(Long ocorrenciaId, DeliberacaoDTO deliberacao,
                                             Long medicoDeliberacaoId) {
        Ocorrencia ocorrencia = ocorrenciaRepo.findById(ocorrenciaId)
                .orElseThrow(() -> new OcorrenciaNotFoundException(ocorrenciaId));

        Utilizador medico = utilizadorRepo.findById(medicoDeliberacaoId)
                .orElseThrow(() -> new DeliberacaoNaoAutorizadaException());

        // Verificar que o utilizador tem role ADMIN
        if (!"ROLE_ADMIN".equals(medico.getRole())) {
            throw new DeliberacaoNaoAutorizadaException();
        }

        ocorrencia.setGrauRestricao(deliberacao.grauFinal());
        ocorrencia.setObsDeliberacao(deliberacao.obsDeliberacao());
        ocorrencia.setEstadoEMD(EstadoEMD.DELIBERADO);
        ocorrencia.setMedicoDeliberacao(medico);
        ocorrencia.setDataDeliberacao(LocalDate.now());

        // Se o grau final for VERDE, resolver a ocorrência automaticamente
        if (deliberacao.grauFinal() == GrauRestricaoDesportiva.VERDE) {
            ocorrencia.setEstado(EstadoOcorrencia.RESOLVIDA);
        }

        ocorrencia = ocorrenciaRepo.save(ocorrencia);

        // Atualizar o estado_elegibilidade do atleta
        Atleta atleta = ocorrencia.getAtleta();
        if (ocorrencia.getEstado() == EstadoOcorrencia.RESOLVIDA) {
            // Verificar se o atleta tem outras ocorrências ativas
            final Long ocId = ocorrencia.getId();
            List<Ocorrencia> outrasAtivas = ocorrenciaRepo.findByAtletaId(atleta.getId()).stream()
                    .filter(o -> !o.getId().equals(ocId) && o.getEstado() == EstadoOcorrencia.ATIVA)
                    .toList();

            if (outrasAtivas.isEmpty()) {
                atleta.setEstadoElegibilidade(EstadoElegibilidade.APTO);
            } else {
                boolean temVermelho = outrasAtivas.stream().anyMatch(o -> o.getGrauRestricao() == GrauRestricaoDesportiva.VERMELHO);
                boolean temAmarelo = outrasAtivas.stream().anyMatch(o -> o.getGrauRestricao() == GrauRestricaoDesportiva.AMARELO);
                if (temVermelho) {
                    atleta.setEstadoElegibilidade(EstadoElegibilidade.INAPTO);
                } else if (temAmarelo) {
                    atleta.setEstadoElegibilidade(EstadoElegibilidade.CONDICIONADO);
                } else {
                    atleta.setEstadoElegibilidade(EstadoElegibilidade.APTO);
                }
            }
        } else {
            if (deliberacao.grauFinal() == GrauRestricaoDesportiva.VERMELHO) {
                atleta.setEstadoElegibilidade(EstadoElegibilidade.INAPTO);
            } else if (deliberacao.grauFinal() == GrauRestricaoDesportiva.AMARELO) {
                atleta.setEstadoElegibilidade(EstadoElegibilidade.CONDICIONADO);
            }
        }
        atletaRepo.save(atleta);

        return toResponse(ocorrencia);
    }

    /**
     * Emite Alta Médica (RF-19) — encerramento formal de uma ocorrência clínica.
     *
     * Regras de negócio:
     * - Ocorrência deve estar ATIVA
     * - dataEncerramento não pode ser futura
     * - Altera estado para RESOLVIDA e grau para VERDE
     * - Recalcula a elegibilidade do atleta
     *
     * @throws OcorrenciaNotFoundException se a ocorrência não existir
     * @throws IllegalStateException se a ocorrência não estiver ATIVA
     * @throws IllegalArgumentException se a data de encerramento for futura
     */
    public OcorrenciaDTO.Response emitirAlta(Long ocorrenciaId, AltaMedicaDTO altaDTO, Long medicoId) {
        Ocorrencia ocorrencia = ocorrenciaRepo.findById(ocorrenciaId)
                .orElseThrow(() -> new OcorrenciaNotFoundException(ocorrenciaId));

        // Validar que a ocorrência está ATIVA
        if (ocorrencia.getEstado() != EstadoOcorrencia.ATIVA) {
            throw new IllegalStateException(
                    "Apenas ocorrências com estado ATIVA podem receber alta. Estado atual: "
                            + ocorrencia.getEstado());
        }

        // Validar que a data de encerramento não é futura
        if (altaDTO.dataEncerramento().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("A data de encerramento não pode ser futura.");
        }

        Utilizador medico = utilizadorRepo.findById(medicoId).orElse(null);

        // Encerrar a ocorrência
        ocorrencia.setEstado(EstadoOcorrencia.RESOLVIDA);
        ocorrencia.setGrauRestricao(GrauRestricaoDesportiva.VERDE);
        ocorrencia.setObsDeliberacao(altaDTO.parecer());
        ocorrencia.setDataDeliberacao(altaDTO.dataEncerramento());
        ocorrencia.setMedicoDeliberacao(medico);

        ocorrencia = ocorrenciaRepo.save(ocorrencia);

        // Recalcular a elegibilidade do atleta
        Atleta atleta = ocorrencia.getAtleta();
        final Long ocId = ocorrencia.getId();
        List<Ocorrencia> outrasAtivas = ocorrenciaRepo.findByAtletaId(atleta.getId()).stream()
                .filter(o -> !o.getId().equals(ocId) && o.getEstado() == EstadoOcorrencia.ATIVA)
                .toList();

        if (outrasAtivas.isEmpty()) {
            atleta.setEstadoElegibilidade(EstadoElegibilidade.APTO);
        } else {
            boolean temVermelho = outrasAtivas.stream()
                    .anyMatch(o -> o.getGrauRestricao() == GrauRestricaoDesportiva.VERMELHO);
            boolean temAmarelo = outrasAtivas.stream()
                    .anyMatch(o -> o.getGrauRestricao() == GrauRestricaoDesportiva.AMARELO);
            if (temVermelho) {
                atleta.setEstadoElegibilidade(EstadoElegibilidade.INAPTO);
            } else if (temAmarelo) {
                atleta.setEstadoElegibilidade(EstadoElegibilidade.CONDICIONADO);
            } else {
                atleta.setEstadoElegibilidade(EstadoElegibilidade.APTO);
            }
        }
        atletaRepo.save(atleta);

        return toResponse(ocorrencia);
    }

    /**
     * Obtém uma ocorrência pelo ID.
     *
     * @throws OcorrenciaNotFoundException se a ocorrência não existir
     */
    @Transactional(readOnly = true)
    public OcorrenciaDTO.Response obter(Long id) {
        Ocorrencia ocorrencia = ocorrenciaRepo.findById(id)
                .orElseThrow(() -> new OcorrenciaNotFoundException(id));
        return toResponse(ocorrencia);
    }

    // === Helpers privados ===

    private OcorrenciaDTO.Response toResponse(Ocorrencia o) {
        return new OcorrenciaDTO.Response(
                o.getId(),
                o.getAtleta().getId(),
                o.getAtleta().getNomeCompleto(),
                o.getDataOcorrencia(),
                o.getTipo(),
                o.getDiagnostico(),
                o.getGrauRestricao(),
                o.getDataReavaliacao(),
                o.getEstadoEMD(),
                o.getEstado(),
                o.getMedicoCriador() != null ? o.getMedicoCriador().getUsername() : null,
                o.getMedicoDeliberacao() != null ? o.getMedicoDeliberacao().getUsername() : null,
                o.getDataDeliberacao(),
                o.getObsDeliberacao(),
                o.getCriadoEm()
        );
    }

    private FilaEMDDTO toFilaEMDDTO(Ocorrencia o) {
        long diasPendente = ChronoUnit.DAYS.between(o.getCriadoEm().toLocalDate(), LocalDate.now());
        return new FilaEMDDTO(
                o.getId(),
                o.getAtleta().getNomeCompleto(),
                o.getDataOcorrencia(),
                o.getTipo(),
                o.getGrauRestricao(),
                o.getDataReavaliacao(),
                diasPendente
        );
    }

}
