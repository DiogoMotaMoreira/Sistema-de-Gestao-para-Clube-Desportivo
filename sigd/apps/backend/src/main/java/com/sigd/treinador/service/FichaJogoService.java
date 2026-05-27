package com.sigd.treinador.service;

import com.sigd.core.model.*;
import com.sigd.core.repository.*;
import com.sigd.treinador.dto.FichaJogoDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class FichaJogoService {

    private final FichaJogoRepository fichaJogoRepo;
    private final EventoDesportivoRepository eventoRepo;

    public FichaJogoService(FichaJogoRepository fichaJogoRepo, EventoDesportivoRepository eventoRepo) {
        this.fichaJogoRepo = fichaJogoRepo;
        this.eventoRepo = eventoRepo;
    }

    @Transactional
    public FichaJogoDTO.Response submeter(FichaJogoDTO.Request request, Long userId) {
        if (request.golosMarcados() < 0) {
            throw new IllegalArgumentException("Golos marcados não podem ser negativos");
        }
        if (request.golosSofridos() < 0) {
            throw new IllegalArgumentException("Golos sofridos não podem ser negativos");
        }

        EventoDesportivo evento = eventoRepo.findById(request.eventoId())
                .orElseThrow(() -> new com.sigd.core.exception.EventoNotFoundException(request.eventoId()));

        Optional<FichaJogo> existing = fichaJogoRepo.findByEventoId(request.eventoId());
        if (existing.isPresent()) {
            throw new com.sigd.core.exception.FichaJogoDuplicadaException(request.eventoId());
        }

        ResultadoJogo resultado;
        if (request.golosMarcados() > request.golosSofridos()) {
            resultado = ResultadoJogo.VITORIA;
        } else if (request.golosMarcados() < request.golosSofridos()) {
            resultado = ResultadoJogo.DERROTA;
        } else {
            resultado = ResultadoJogo.EMPATE;
        }

        evento.setEstado(EstadoEvento.CONCLUIDO);
        eventoRepo.save(evento);

        FichaJogo ficha = new FichaJogo();
        ficha.setEventoId(request.eventoId());
        ficha.setGolosMarcados(request.golosMarcados());
        ficha.setGolosSofridos(request.golosSofridos());
        ficha.setResultado(resultado);
        ficha.setObservacoes(request.observacoes());
        ficha.setSubmetidaPor(userId);
        ficha.setEstadoSubmissao(EstadoSubmissaoFicha.SUBMETIDA);
        ficha.setCriadoEm(LocalDateTime.now());

        ficha = fichaJogoRepo.save(ficha);

        return toDto(ficha);
    }

    @Transactional(readOnly = true)
    public FichaJogoDTO.Response obterPorEvento(Long eventoId) {
        FichaJogo ficha = fichaJogoRepo.findByEventoId(eventoId)
                .orElseThrow(() -> new IllegalArgumentException("Ficha de jogo não encontrada"));
        return toDto(ficha);
    }

    private FichaJogoDTO.Response toDto(FichaJogo ficha) {
        return new FichaJogoDTO.Response(
                ficha.getId(),
                ficha.getEventoId(),
                ficha.getGolosMarcados(),
                ficha.getGolosSofridos(),
                ficha.getResultado().name(),
                ficha.getObservacoes(),
                ficha.getEstadoSubmissao().name(),
                ficha.getCriadoEm()
        );
    }
}
