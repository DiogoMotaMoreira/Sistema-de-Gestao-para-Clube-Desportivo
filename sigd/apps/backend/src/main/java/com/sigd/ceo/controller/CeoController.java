package com.sigd.ceo.controller;

import com.sigd.ceo.dto.CeoKpisDTO;
import com.sigd.ceo.dto.CeoKpisDesportivosDTO;
import com.sigd.core.model.EventoDesportivo;
import com.sigd.core.model.EstadoElegibilidade;
import com.sigd.core.model.EstadoObrigacao;
import com.sigd.core.model.ObrigacaoFinanceira;
import com.sigd.core.model.TipoEvento;
import com.sigd.core.model.EstadoEvento;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.EncarregadoEducacaoRepository;
import com.sigd.core.repository.EquipaRepository;
import com.sigd.core.repository.ObrigacaoFinanceiraRepository;
import com.sigd.core.repository.EventoDesportivoRepository;
import com.sigd.core.repository.SessaoTreinoRepository;
import com.sigd.core.repository.ConvocatoriaRepository;
import java.util.ArrayList;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/ceo")
@PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_CFO', 'ROLE_ADMIN')")
public class CeoController {

    private final AtletaRepository atletaRepo;
    private final EquipaRepository equipaRepo;
    private final EncarregadoEducacaoRepository encarregadoRepo;
    private final ObrigacaoFinanceiraRepository obrigacaoRepo;
    private final EventoDesportivoRepository eventoRepo;
    private final SessaoTreinoRepository sessaoTreinoRepo;
    private final ConvocatoriaRepository convocatoriaRepo;

    public CeoController(AtletaRepository atletaRepo,
                         EquipaRepository equipaRepo,
                         EncarregadoEducacaoRepository encarregadoRepo,
                         ObrigacaoFinanceiraRepository obrigacaoRepo,
                         EventoDesportivoRepository eventoRepo,
                         SessaoTreinoRepository sessaoTreinoRepo,
                         ConvocatoriaRepository convocatoriaRepo) {
        this.atletaRepo = atletaRepo;
        this.equipaRepo = equipaRepo;
        this.encarregadoRepo = encarregadoRepo;
        this.obrigacaoRepo = obrigacaoRepo;
        this.eventoRepo = eventoRepo;
        this.sessaoTreinoRepo = sessaoTreinoRepo;
        this.convocatoriaRepo = convocatoriaRepo;
    }

    @GetMapping("/kpis")
    public ResponseEntity<CeoKpisDTO> getKpis() {
        long totalAtletas = atletaRepo.count();
        long totalEquipas = equipaRepo.count();
        long totalSocios = encarregadoRepo.count();

        BigDecimal receitaTotal = sumObrigacoes(obrigacaoRepo.findByEstado(EstadoObrigacao.PAGO));
        
        List<ObrigacaoFinanceira> pendentes = obrigacaoRepo.findByEstado(EstadoObrigacao.PENDENTE);
        List<ObrigacaoFinanceira> atraso = obrigacaoRepo.findByEstado(EstadoObrigacao.EM_ATRASO);
        BigDecimal dividaTotal = sumObrigacoes(pendentes).add(sumObrigacoes(atraso));

        long atletasAptos = atletaRepo.findByEstadoElegibilidade(EstadoElegibilidade.APTO).size();
        long atletasCondicionados = atletaRepo.findByEstadoElegibilidade(EstadoElegibilidade.CONDICIONADO).size();
        
        // Inaptos = total - aptos - condicionados
        long atletasInaptos = totalAtletas - atletasAptos - atletasCondicionados;

        CeoKpisDTO dto = new CeoKpisDTO(
                totalAtletas,
                totalEquipas,
                totalSocios,
                receitaTotal,
                dividaTotal,
                atletasAptos,
                atletasCondicionados,
                atletasInaptos
        );

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/kpis-desportivos")
    public ResponseEntity<CeoKpisDesportivosDTO> getKpisDesportivos() {
        long totalJogos = eventoRepo.countByTipo(TipoEvento.JOGO_OFICIAL);
        long jogosConcluidos = eventoRepo.countByTipoAndEstado(TipoEvento.JOGO_OFICIAL, EstadoEvento.CONCLUIDO);
        long jogosAgendados = eventoRepo.countByTipoAndEstado(TipoEvento.JOGO_OFICIAL, EstadoEvento.AGENDADO);
        long totalSessoesTreino = sessaoTreinoRepo.count();

        CeoKpisDesportivosDTO dto = new CeoKpisDesportivosDTO(
                totalJogos,
                jogosConcluidos,
                jogosAgendados,
                totalSessoesTreino
        );

        return ResponseEntity.ok(dto);
    }

    public record PerformanceEscalaoDTO(
            String escalao,
            long totalJogos,
            long jogosConcluidos,
            long jogosAgendados
    ) {}

    @GetMapping("/performance-escaloes")
    public ResponseEntity<List<PerformanceEscalaoDTO>> getPerformanceEscaloes() {
        List<EventoDesportivo> eventos = eventoRepo.findAll();
        
        Map<String, List<EventoDesportivo>> byEscalao = eventos.stream()
                .filter(e -> e.getEquipa() != null && e.getEquipa().getEscalao() != null && e.getTipo() == TipoEvento.JOGO_OFICIAL)
                .collect(Collectors.groupingBy(e -> e.getEquipa().getEscalao().getDesignacao()));

        List<PerformanceEscalaoDTO> result = byEscalao.entrySet().stream()
                .map(entry -> {
                    String escalao = entry.getKey();
                    List<EventoDesportivo> evs = entry.getValue();
                    long total = evs.size();
                    long concluidos = evs.stream().filter(e -> e.getEstado() == EstadoEvento.CONCLUIDO).count();
                    long agendados = evs.stream().filter(e -> e.getEstado() == EstadoEvento.AGENDADO).count();
                    return new PerformanceEscalaoDTO(escalao, total, concluidos, agendados);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    private BigDecimal sumObrigacoes(List<ObrigacaoFinanceira> obrigacoes) {
        return obrigacoes.stream()
                .map(ObrigacaoFinanceira::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public record CeoAlertaDTO(String tipo, String mensagem, boolean urgente) {}

    @GetMapping("/alertas")
    public ResponseEntity<List<CeoAlertaDTO>> getAlertas() {
        List<CeoAlertaDTO> alertas = new ArrayList<>();

        long pendentesEmd = atletaRepo.findByEstadoElegibilidade(EstadoElegibilidade.PENDENTE_EMD).size();
        if (pendentesEmd > 0) {
            alertas.add(new CeoAlertaDTO("SAUDE", pendentesEmd + " atletas com EMD pendente", false));
        }

        long atraso = obrigacaoRepo.findByEstado(EstadoObrigacao.EM_ATRASO).size();
        if (atraso > 0) {
            alertas.add(new CeoAlertaDTO("FINANCEIRO", atraso + " obrigações em atraso", true));
        }

        long inaptos = atletaRepo.findByEstadoElegibilidade(EstadoElegibilidade.INAPTO).size();
        if (inaptos > 0) {
            alertas.add(new CeoAlertaDTO("SAUDE", inaptos + " atletas com lesão grave", true));
        }

        long semConvocatoria = eventoRepo.findAll().stream()
                .filter(e -> e.getTipo() == TipoEvento.JOGO_OFICIAL && e.getEstado() == EstadoEvento.AGENDADO)
                .filter(e -> convocatoriaRepo.findByEventoId(e.getId()).isEmpty())
                .count();

        if (semConvocatoria > 0) {
            alertas.add(new CeoAlertaDTO("DESPORTIVO", semConvocatoria + " Jogo(s) sem convocatória", true));
        }

        return ResponseEntity.ok(alertas);
    }
}
