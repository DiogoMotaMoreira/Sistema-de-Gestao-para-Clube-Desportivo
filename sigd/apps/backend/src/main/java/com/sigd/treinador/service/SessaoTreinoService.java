package com.sigd.treinador.service;

import com.sigd.core.model.*;
import com.sigd.core.repository.*;
import com.sigd.treinador.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SessaoTreinoService {

    private final SessaoTreinoRepository sessaoTreinoRepo;
    private final EquipaRepository equipaRepo;
    private final AtletaRepository atletaRepo;
    private final RegistoAssiduidadeRepository registoAssiduidadeRepo;
    private final AvaliacaoRendimentoRepository avaliacaoRendimentoRepo;
    private final com.sigd.tesouraria.service.AtletaService atletaService;

    public SessaoTreinoService(SessaoTreinoRepository sessaoTreinoRepo,
                               EquipaRepository equipaRepo,
                               AtletaRepository atletaRepo,
                               RegistoAssiduidadeRepository registoAssiduidadeRepo,
                               AvaliacaoRendimentoRepository avaliacaoRendimentoRepo,
                               com.sigd.tesouraria.service.AtletaService atletaService) {
        this.sessaoTreinoRepo = sessaoTreinoRepo;
        this.equipaRepo = equipaRepo;
        this.atletaRepo = atletaRepo;
        this.registoAssiduidadeRepo = registoAssiduidadeRepo;
        this.avaliacaoRendimentoRepo = avaliacaoRendimentoRepo;
        this.atletaService = atletaService;
    }

    @Transactional
    public SessaoTreinoDTO.Response criarSessao(SessaoTreinoDTO.Request request) {
        Equipa equipa = equipaRepo.findById(request.equipaId())
                .orElseThrow(() -> new IllegalArgumentException("Equipa não encontrada"));

        SessaoTreino sessao = new SessaoTreino();
        sessao.setEquipa(equipa);
        sessao.setData(request.data());
        sessao.setHoraInicio(request.horaInicio());
        sessao.setHoraFim(request.horaFim());
        sessao.setTipo(request.tipo());
        sessao.setEstado(EstadoSessao.PLANEADA);

        sessao = sessaoTreinoRepo.save(sessao);
        return toDto(sessao);
    }

    @Transactional(readOnly = true)
    public List<SessaoTreinoDTO.Response> listarPorEquipa(Long equipaId) {
        return sessaoTreinoRepo.findByEquipaId(equipaId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SessaoTreinoDTO.Response obter(Long id) {
        SessaoTreino sessao = sessaoTreinoRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sessão de treino não encontrada"));
        return toDto(sessao);
    }

    @Transactional
    public ChamadaDTO.Response registarChamada(Long sessaoId, ChamadaDTO.Request request) {
        SessaoTreino sessao = sessaoTreinoRepo.findById(sessaoId)
                .orElseThrow(() -> new IllegalArgumentException("Sessão não encontrada"));

        List<RegistoAssiduidadeDTO.Response> registosResponse = new ArrayList<>();
        int presentes = 0, ausentes = 0, atrasados = 0;

        for (RegistoAssiduidadeDTO.Request regReq : request.registos()) {
            Atleta atleta = atletaRepo.findById(regReq.atletaId())
                    .orElseThrow(() -> new IllegalArgumentException("Atleta não encontrado"));

            RegistoAssiduidade registo = registoAssiduidadeRepo.findBySessaoIdAndAtletaId(sessaoId, regReq.atletaId())
                    .orElse(new RegistoAssiduidade());

            registo.setSessao(sessao);
            registo.setAtleta(atleta);
            registo.setEstado(regReq.estado());
            registo.setRegistadoEm(LocalDateTime.now());

            Boolean isCondicionado = false;

            if (regReq.estado() == EstadoAssiduidade.PRESENTE) {
                com.sigd.tesouraria.dto.AtletaDTO.Elegibilidade eleg = atletaService.obterElegibilidade(atleta.getId());
                if (eleg.bloqueadoPorEMD()) {
                    throw new IllegalStateException("Atleta " + atleta.getNomeCompleto() + " não pode ser marcado presente: EMD em falta");
                }
                if (eleg.bloqueadoPorLesao()) {
                    throw new IllegalStateException("Atleta " + atleta.getNomeCompleto() + " não pode ser marcado presente: baixa médica activa");
                }
                isCondicionado = eleg.condicionado();
            }

            registo = registoAssiduidadeRepo.save(registo);

            if (regReq.estado() == EstadoAssiduidade.PRESENTE) presentes++;
            else if (regReq.estado() == EstadoAssiduidade.AUSENTE) ausentes++;
            else if (regReq.estado() == EstadoAssiduidade.ATRASADO) atrasados++;

            registosResponse.add(new RegistoAssiduidadeDTO.Response(
                    atleta.getId(), atleta.getNomeCompleto(), registo.getEstado(), registo.getRegistadoEm(), isCondicionado
            ));
        }

        if (sessao.getEstado() == EstadoSessao.PLANEADA) {
            sessao.setEstado(EstadoSessao.EM_CURSO);
            sessaoTreinoRepo.save(sessao);
        }

        return new ChamadaDTO.Response(sessaoId, presentes, ausentes, atrasados, registosResponse);
    }

    @Transactional
    public AvaliacaoPosSessionDTO.Response registarAvaliacoes(Long sessaoId, AvaliacaoPosSessionDTO.Request request) {
        SessaoTreino sessao = sessaoTreinoRepo.findById(sessaoId)
                .orElseThrow(() -> new IllegalArgumentException("Sessão não encontrada"));

        LocalDateTime fimSessao = LocalDateTime.of(sessao.getData(), sessao.getHoraFim());
        LocalDateTime limiteAvaliacao = fimSessao.plusHours(24);

        if (LocalDateTime.now().isAfter(limiteAvaliacao)) {
            throw new IllegalStateException("O período de 24 horas para submeter avaliações já expirou.");
        }

        List<AvaliacaoDTO.Response> avaliacoesResponse = new ArrayList<>();

        for (AvaliacaoDTO.Request avalReq : request.avaliacoes()) {
            Atleta atleta = atletaRepo.findById(avalReq.atletaId())
                    .orElseThrow(() -> new IllegalArgumentException("Atleta não encontrado"));

            // Ensure the athlete was present or delayed, not absent
            RegistoAssiduidade reg = registoAssiduidadeRepo.findBySessaoIdAndAtletaId(sessaoId, atleta.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Atleta não tem registo de presença nesta sessão"));
            
            if (reg.getEstado() == EstadoAssiduidade.AUSENTE) {
                throw new IllegalArgumentException("Não é possível avaliar um atleta ausente: " + atleta.getNomeCompleto());
            }

            AvaliacaoRendimento avaliacao = new AvaliacaoRendimento();
            avaliacao.setSessao(sessao);
            avaliacao.setAtleta(atleta);
            avaliacao.setNota(avalReq.nota());
            avaliacao.setRegistadoEm(LocalDateTime.now());

            avaliacao = avaliacaoRendimentoRepo.save(avaliacao);

            avaliacoesResponse.add(new AvaliacaoDTO.Response(
                    atleta.getId(), atleta.getNomeCompleto(), avaliacao.getNota(), avaliacao.getRegistadoEm()
            ));
        }

        if (sessao.getEstado() != EstadoSessao.CONCLUIDA) {
            sessao.setEstado(EstadoSessao.CONCLUIDA);
            sessaoTreinoRepo.save(sessao);
        }

        return new AvaliacaoPosSessionDTO.Response(sessaoId, avaliacoesResponse.size(), avaliacoesResponse);
    }

    private SessaoTreinoDTO.Response toDto(SessaoTreino sessao) {
        int totalAtletas = registoAssiduidadeRepo.findBySessaoId(sessao.getId()).size();
        return new SessaoTreinoDTO.Response(
                sessao.getId(),
                sessao.getEquipa().getId(),
                sessao.getEquipa().getNome(),
                sessao.getData(),
                sessao.getHoraInicio(),
                sessao.getHoraFim(),
                sessao.getTipo(),
                sessao.getEstado(),
                totalAtletas
        );
    }
}
