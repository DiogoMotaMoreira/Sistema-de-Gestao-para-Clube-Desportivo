package com.sigd.portal;

import com.sigd.core.model.Atleta;
import com.sigd.core.model.EncarregadoEducacao;
import com.sigd.core.model.Utilizador;
import com.sigd.core.repository.EncarregadoEducacaoRepository;
import com.sigd.core.repository.UtilizadorRepository;
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

    public PortalController(UtilizadorRepository utilizadorRepository,
                            EncarregadoEducacaoRepository encarregadoEducacaoRepository,
                            EncarregadoService encarregadoService,
                            ObrigacaoFinanceiraService obrigacaoFinanceiraService) {
        this.utilizadorRepository = utilizadorRepository;
        this.encarregadoEducacaoRepository = encarregadoEducacaoRepository;
        this.encarregadoService = encarregadoService;
        this.obrigacaoFinanceiraService = obrigacaoFinanceiraService;
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
