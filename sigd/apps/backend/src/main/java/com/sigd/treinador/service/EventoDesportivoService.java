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
public class EventoDesportivoService {

    private final EventoDesportivoRepository eventoRepo;
    private final EquipaRepository equipaRepo;
    private final AtletaRepository atletaRepo;
    private final ConvocatoriaRepository convocatoriaRepo;

    public EventoDesportivoService(EventoDesportivoRepository eventoRepo,
                                   EquipaRepository equipaRepo,
                                   AtletaRepository atletaRepo,
                                   ConvocatoriaRepository convocatoriaRepo) {
        this.eventoRepo = eventoRepo;
        this.equipaRepo = equipaRepo;
        this.atletaRepo = atletaRepo;
        this.convocatoriaRepo = convocatoriaRepo;
    }

    @Transactional
    public EventoDesportivoDTO.Response criarEvento(EventoDesportivoDTO.Request request) {
        Equipa equipa = equipaRepo.findById(request.equipaId())
                .orElseThrow(() -> new IllegalArgumentException("Equipa não encontrada"));

        EventoDesportivo evento = new EventoDesportivo();
        evento.setEquipa(equipa);
        evento.setTipo(request.tipo());
        evento.setData(request.data());
        evento.setHoraInicio(request.horaInicio());
        evento.setAdversario(request.adversario());
        evento.setLocal(request.local());
        evento.setEstado(EstadoEvento.AGENDADO);

        evento = eventoRepo.save(evento);
        return toDto(evento);
    }

    @Transactional(readOnly = true)
    public List<EventoDesportivoDTO.Response> listarPorEquipa(Long equipaId) {
        return eventoRepo.findByEquipaIdOrderByDataAsc(equipaId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ConvocatoriaDTO.Response publicarConvocatoria(ConvocatoriaDTO.Request request) {
        EventoDesportivo evento = eventoRepo.findById(request.eventoId())
                .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));

        Convocatoria convocatoria = new Convocatoria();
        convocatoria.setEvento(evento);
        convocatoria.setHoraConcentracao(request.horaConcentracao());
        convocatoria.setLocalConcentracao(request.localConcentracao());
        convocatoria.setEstado(EstadoConvocatoria.PUBLICADA);
        convocatoria.setPublicadaEm(LocalDateTime.now());

        List<Atleta> atletasConvocados = new ArrayList<>();
        List<String> nomesConvocados = new ArrayList<>();

        for (Long atletaId : request.atletaIds()) {
            Atleta atleta = atletaRepo.findById(atletaId)
                    .orElseThrow(() -> new IllegalArgumentException("Atleta não encontrado: " + atletaId));
            
            if (atleta.getEstadoElegibilidade() != EstadoElegibilidade.APTO) {
                throw new IllegalStateException("Atleta inativo ou inapto não pode ser convocado: " + atleta.getNomeCompleto());
            }

            atletasConvocados.add(atleta);
            nomesConvocados.add(atleta.getNomeCompleto());
        }

        convocatoria.setAtletas(atletasConvocados);
        convocatoria = convocatoriaRepo.save(convocatoria);

        return new ConvocatoriaDTO.Response(
                convocatoria.getId(),
                evento.getId(),
                nomesConvocados,
                convocatoria.getHoraConcentracao(),
                convocatoria.getLocalConcentracao(),
                convocatoria.getEstado(),
                convocatoria.getPublicadaEm()
        );
    }

    @Transactional(readOnly = true)
    public ConvocatoriaDTO.Response obterConvocatoria(Long id) {
        Convocatoria convocatoria = convocatoriaRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Convocatória não encontrada"));

        List<String> nomesConvocados = convocatoria.getAtletas().stream()
                .map(Atleta::getNomeCompleto)
                .collect(Collectors.toList());

        return new ConvocatoriaDTO.Response(
                convocatoria.getId(),
                convocatoria.getEvento().getId(),
                nomesConvocados,
                convocatoria.getHoraConcentracao(),
                convocatoria.getLocalConcentracao(),
                convocatoria.getEstado(),
                convocatoria.getPublicadaEm()
        );
    }

    private EventoDesportivoDTO.Response toDto(EventoDesportivo evento) {
        boolean temConvocatoria = !convocatoriaRepo.findByEventoId(evento.getId()).isEmpty();
        return new EventoDesportivoDTO.Response(
                evento.getId(),
                evento.getEquipa().getId(),
                evento.getEquipa().getNome(),
                evento.getTipo(),
                evento.getData(),
                evento.getHoraInicio(),
                evento.getAdversario(),
                evento.getLocal(),
                evento.getEstado(),
                temConvocatoria
        );
    }
}
