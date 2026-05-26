package com.sigd.treinador.controller;

import com.sigd.core.repository.AvaliacaoRendimentoRepository;
import com.sigd.core.repository.RegistoAssiduidadeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AtletaEstatisticasController — Estatísticas de assiduidade e rendimento de um atleta.
 *
 * GET /api/v1/treinador/atletas/{atletaId}/estatisticas
 */
@RestController
@RequestMapping("/api/v1/treinador/atletas")
@PreAuthorize("hasAnyRole('ROLE_TREINADOR', 'ROLE_DIRETOR_TECNICO')")
public class AtletaEstatisticasController {

    private final RegistoAssiduidadeRepository registoAssiduidadeRepository;
    private final AvaliacaoRendimentoRepository avaliacaoRendimentoRepository;

    public AtletaEstatisticasController(
            RegistoAssiduidadeRepository registoAssiduidadeRepository,
            AvaliacaoRendimentoRepository avaliacaoRendimentoRepository) {
        this.registoAssiduidadeRepository = registoAssiduidadeRepository;
        this.avaliacaoRendimentoRepository = avaliacaoRendimentoRepository;
    }

    public record EstatisticasAtletaDTO(
            int totalSessoes,
            int presencas,
            int ausencias,
            double taxaPresenca,
            double avaliacaoMedia
    ) {}

    /**
     * GET /api/v1/treinador/atletas/{atletaId}/estatisticas
     *
     * Devolve as estatísticas de assiduidade e avaliação de rendimento do atleta.
     */
    @GetMapping("/{atletaId}/estatisticas")
    public ResponseEntity<EstatisticasAtletaDTO> obterEstatisticas(@PathVariable Long atletaId) {
        var registos = registoAssiduidadeRepository.findByAtletaId(atletaId);
        int total = registos.size();
        long presencas = registos.stream()
                .filter(r -> "PRESENTE".equals(r.getEstado().name()))
                .count();
        long ausencias = total - presencas;
        double taxa = total > 0 ? (presencas * 100.0 / total) : 0.0;

        var avaliacoes = avaliacaoRendimentoRepository.findByAtletaId(atletaId);
        double media = avaliacoes.stream()
                .mapToDouble(a -> a.getNota().doubleValue())
                .average()
                .orElse(0.0);

        return ResponseEntity.ok(new EstatisticasAtletaDTO(
                total,
                (int) presencas,
                (int) ausencias,
                Math.round(taxa * 10.0) / 10.0,
                Math.round(media * 10.0) / 10.0
        ));
    }
}
