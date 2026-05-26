package com.sigd.portal;

import com.sigd.core.model.Atleta;
import com.sigd.core.model.EncarregadoEducacao;
import com.sigd.core.model.Utilizador;
import com.sigd.core.repository.EncarregadoEducacaoRepository;
import com.sigd.core.repository.UtilizadorRepository;
import com.sigd.core.repository.EventoDesportivoRepository;
import com.sigd.core.repository.OcorrenciaRepository;
import com.sigd.core.model.EventoDesportivo;
import com.sigd.core.model.Ocorrencia;
import com.sigd.core.model.EstadoEMD;
import com.sigd.tesouraria.dto.ObrigacaoFinanceiraDTO;
import com.sigd.tesouraria.dto.SituacaoFinanceiraDTO;
import com.sigd.tesouraria.service.EncarregadoService;
import com.sigd.tesouraria.service.ObrigacaoFinanceiraService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/portal")
@PreAuthorize("hasRole('ROLE_EE')")
@Transactional(readOnly = true)
public class PortalController {

    private final UtilizadorRepository utilizadorRepository;
    private final EncarregadoEducacaoRepository encarregadoEducacaoRepository;
    private final EncarregadoService encarregadoService;
    private final ObrigacaoFinanceiraService obrigacaoFinanceiraService;
    private final EventoDesportivoRepository eventoDesportivoRepository;
    private final OcorrenciaRepository ocorrenciaRepository;

    public PortalController(UtilizadorRepository utilizadorRepository,
                            EncarregadoEducacaoRepository encarregadoEducacaoRepository,
                            EncarregadoService encarregadoService,
                            ObrigacaoFinanceiraService obrigacaoFinanceiraService,
                            EventoDesportivoRepository eventoDesportivoRepository,
                            OcorrenciaRepository ocorrenciaRepository) {
        this.utilizadorRepository = utilizadorRepository;
        this.encarregadoEducacaoRepository = encarregadoEducacaoRepository;
        this.encarregadoService = encarregadoService;
        this.obrigacaoFinanceiraService = obrigacaoFinanceiraService;
        this.eventoDesportivoRepository = eventoDesportivoRepository;
        this.ocorrenciaRepository = ocorrenciaRepository;
    }

    public record DependenteDTO(
            Long id,
            String nome,
            String escalao,
            String equipa,
            String elegibilidade,
            Integer idade,
            String numeroSocio
    ) {}

    public record PortalMeResponse(
            Long eeId,
            String nome,
            String email,
            String telemovel,
            List<DependenteDTO> dependentes
    ) {}

    public record EventoPortalDTO(
            Long id,
            String tipo,
            String dataHora,
            String instalacao,
            String estadoPresenca,
            Integer tempoParaJustificarMs,
            String adversario,
            String quadro,
            String condicao,
            String horaConcentracao,
            String localConcentracao,
            Boolean isConvocado
    ) {}

    public record PortalDocumentoDTO(
            Long id,
            String tipo,
            String dataSubmissao,
            String estado,
            String dataValidade,
            String motivoRejeicao
    ) {}

    @GetMapping("/me")
    public ResponseEntity<PortalMeResponse> me() {
        EncarregadoEducacao ee = obterEncarregadoLogado();
        List<DependenteDTO> dependentes = ee.getAtletas().stream()
                .map(this::toDependenteDTO)
                .toList();

        return ResponseEntity.ok(new PortalMeResponse(
                ee.getId(),
                ee.getNome(),
                ee.getEmail(),
                ee.getTelemovel(),
                dependentes
        ));
    }

    @GetMapping("/obrigacoes")
    public ResponseEntity<List<ObrigacaoFinanceiraDTO.Response>> obrigacoes() {
        EncarregadoEducacao ee = obterEncarregadoLogado();
        return ResponseEntity.ok(obrigacaoFinanceiraService.listarPorEncarregado(ee.getId()));
    }

    @GetMapping("/situacao-financeira")
    public ResponseEntity<SituacaoFinanceiraDTO> situacaoFinanceira() {
        EncarregadoEducacao ee = obterEncarregadoLogado();
        return ResponseEntity.ok(encarregadoService.obterSituacaoFinanceira(ee.getId()));
    }

    @GetMapping("/agenda")
    public ResponseEntity<List<EventoPortalDTO>> getAgenda() {
        EncarregadoEducacao ee = obterEncarregadoLogado();
        java.util.List<EventoPortalDTO> result = new java.util.ArrayList<>();
        
        java.util.Set<Long> equipaIds = ee.getAtletas().stream()
                .filter(a -> a.getEquipa() != null)
                .map(a -> a.getEquipa().getId())
                .collect(java.util.stream.Collectors.toSet());

        for (Long equipaId : equipaIds) {
            List<EventoDesportivo> eventos = eventoDesportivoRepository.findByEquipaIdOrderByDataAsc(equipaId);
            for (EventoDesportivo ev : eventos) {
                String tipo = ev.getTipo() == com.sigd.core.model.TipoEvento.TREINO ? "TREINO" : "JOGO";
                String dataHora = java.time.LocalDateTime.of(ev.getData(), ev.getHoraInicio()).toString();
                result.add(new EventoPortalDTO(
                        ev.getId(),
                        tipo,
                        dataHora,
                        ev.getLocal(),
                        "PRESENTE",
                        0,
                        ev.getAdversario(),
                        "Campeonato Distrital",
                        "CASA",
                        ev.getHoraInicio().toString(),
                        ev.getLocal(),
                        true
                ));
            }
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/documentos")
    public ResponseEntity<List<PortalDocumentoDTO>> getDocumentos(@RequestParam Long atletaId) {
        EncarregadoEducacao ee = obterEncarregadoLogado();
        Atleta atleta = ee.getAtletas().stream()
                .filter(a -> a.getId().equals(atletaId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Não tem permissão para aceder a este atleta."));

        java.util.List<PortalDocumentoDTO> docs = new java.util.ArrayList<>();

        // 1. EMD
        List<Ocorrencia> ocorrencias = ocorrenciaRepository.findByAtletaId(atletaId);
        String estadoEMD = "EM_FALTA";
        String dataSubmissaoEMD = java.time.LocalDateTime.now().toString();
        if (!ocorrencias.isEmpty()) {
            Ocorrencia maisRecente = ocorrencias.stream()
                    .max(java.util.Comparator.comparing(Ocorrencia::getId))
                    .get();
            if (maisRecente.getEstadoEMD() == EstadoEMD.DELIBERADO) {
                estadoEMD = "APROVADO";
            } else if (maisRecente.getEstadoEMD() == EstadoEMD.EM_AVALIACAO) {
                estadoEMD = "EM_ANALISE";
            }
            dataSubmissaoEMD = maisRecente.getCriadoEm().toString();
        }
        docs.add(new PortalDocumentoDTO(1L, "Exame Médico-Desportivo", dataSubmissaoEMD, estadoEMD, null, null));

        // 2. Cartão de Sócio
        String estadoSocio = (atleta.getNumeroSocio() != null && !atleta.getNumeroSocio().trim().isEmpty()) ? "APROVADO" : "EM_FALTA";
        docs.add(new PortalDocumentoDTO(2L, "Cartão de Sócio", java.time.LocalDateTime.now().toString(), estadoSocio, null, null));

        // 3. Dados Pessoais
        docs.add(new PortalDocumentoDTO(3L, "Dados Pessoais", atleta.getCriadoEm().toString(), "APROVADO", null, null));

        return ResponseEntity.ok(docs);
    }

    private EncarregadoEducacao obterEncarregadoLogado() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilizador utilizador = utilizadorRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Utilizador não encontrado."));

        return encarregadoEducacaoRepository.findByEmail(utilizador.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Encarregado de Educação não associado ao email do utilizador."));
    }

    private DependenteDTO toDependenteDTO(Atleta atleta) {
        String equipaNome = atleta.getEquipa() != null ? atleta.getEquipa().getNome() : "-";
        String escalaoNome = (atleta.getEquipa() != null && atleta.getEquipa().getEscalao() != null)
                ? atleta.getEquipa().getEscalao().getDesignacao()
                : "-";
        String elegibilidade = atleta.getEstadoElegibilidade() != null ? atleta.getEstadoElegibilidade().name() : "APTO";
        int idade = 0;
        if (atleta.getDataNascimento() != null) {
            idade = java.time.Period.between(atleta.getDataNascimento(), java.time.LocalDate.now()).getYears();
        }
        return new DependenteDTO(
                atleta.getId(),
                atleta.getNomeCompleto(),
                escalaoNome,
                equipaNome,
                elegibilidade,
                idade,
                atleta.getNumeroSocio()
        );
    }
}
