package com.sigd.dt.controller;

import com.sigd.core.model.EventoDesportivo;
import com.sigd.core.model.SessaoTreino;
import com.sigd.core.model.Equipa;
import com.sigd.core.model.EstadoEvento;
import com.sigd.core.model.ResultadoJogo;
import com.sigd.core.repository.EquipaRepository;
import com.sigd.core.repository.EventoDesportivoRepository;
import com.sigd.core.repository.SessaoTreinoRepository;
import com.sigd.core.repository.FichaJogoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/dt")
@PreAuthorize("hasAnyRole('ROLE_DIRETOR_TECNICO', 'ROLE_ADMIN', 'ROLE_CEO')")
public class DtController {

    private final EquipaRepository equipaRepo;
    private final EventoDesportivoRepository eventoRepo;
    private final SessaoTreinoRepository sessaoTreinoRepo;
    private final FichaJogoRepository fichaJogoRepo;

    public DtController(EquipaRepository equipaRepo,
                        EventoDesportivoRepository eventoRepo,
                        SessaoTreinoRepository sessaoTreinoRepo,
                        FichaJogoRepository fichaJogoRepo) {
        this.equipaRepo = equipaRepo;
        this.eventoRepo = eventoRepo;
        this.sessaoTreinoRepo = sessaoTreinoRepo;
        this.fichaJogoRepo = fichaJogoRepo;
    }

    public record CalendarioGlobalDTO(
        Long equipaId,
        String equipaNome,
        String escalao,
        long totalTreinos,
        long totalJogos
    ) {}

    @GetMapping("/calendario")
    public ResponseEntity<List<CalendarioGlobalDTO>> getCalendarioGlobal() {
        LocalDate hoje = LocalDate.now();
        List<Equipa> equipas = equipaRepo.findAll();
        List<EventoDesportivo> eventos = eventoRepo.findAll().stream()
                .filter(e -> !e.getData().isBefore(hoje))
                .collect(Collectors.toList());
        List<SessaoTreino> treinos = sessaoTreinoRepo.findAll().stream()
                .filter(t -> !t.getData().isBefore(hoje))
                .collect(Collectors.toList());

        List<CalendarioGlobalDTO> result = new ArrayList<>();
        for (Equipa eq : equipas) {
            long totalTreinos = treinos.stream()
                    .filter(t -> t.getEquipa() != null && t.getEquipa().getId().equals(eq.getId()))
                    .count();
            long totalJogos = eventos.stream()
                    .filter(e -> e.getEquipa() != null && e.getEquipa().getId().equals(eq.getId()))
                    .count();

            String designacaoEscalao = eq.getEscalao() != null ? eq.getEscalao().getDesignacao() : "-";

            result.add(new CalendarioGlobalDTO(eq.getId(), eq.getNome(), designacaoEscalao, totalTreinos, totalJogos));
        }

        return ResponseEntity.ok(result);
    }

    public record RendimentoEquipaDTO(
        Long equipaId,
        String equipaNome,
        long totalJogosConcluidos,
        long vitorias,
        long empates,
        long derrotas,
        double winRate,
        double mediaGolosPorJogo
    ) {}

    @GetMapping("/rendimento")
    public ResponseEntity<RendimentoEquipaDTO> getRendimento(
            @RequestParam(required = false) Long equipaId) {
        
        if (equipaId == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Equipa> equipaOpt = equipaRepo.findById(equipaId);
        if (equipaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Equipa eq = equipaOpt.get();
        List<EventoDesportivo> jogos = eventoRepo.findAll().stream()
                .filter(e -> e.getEquipa() != null && e.getEquipa().getId().equals(eq.getId()))
                .filter(e -> e.getEstado() == EstadoEvento.CONCLUIDO)
                .collect(Collectors.toList());

        long concluidos = jogos.size();
        long vitorias = 0;
        long empates = 0;
        long derrotas = 0;
        long totalGolos = 0;

        for (EventoDesportivo e : jogos) {
            var fichaOpt = fichaJogoRepo.findByEventoId(e.getId());
            if (fichaOpt.isPresent()) {
                var f = fichaOpt.get();
                totalGolos += f.getGolosMarcados();
                if (f.getResultado() == ResultadoJogo.VITORIA) {
                    vitorias++;
                } else if (f.getResultado() == ResultadoJogo.EMPATE) {
                    empates++;
                } else if (f.getResultado() == ResultadoJogo.DERROTA) {
                    derrotas++;
                }
            }
        }

        double winRate = 0.0;
        double mediaGolos = 0.0;
        if (concluidos > 0) {
            winRate = ((double) vitorias / concluidos) * 100.0;
            mediaGolos = (double) totalGolos / concluidos;
        }

        return ResponseEntity.ok(new RendimentoEquipaDTO(
                eq.getId(),
                eq.getNome(),
                concluidos,
                vitorias,
                empates,
                derrotas,
                winRate,
                mediaGolos
        ));
    }
}
