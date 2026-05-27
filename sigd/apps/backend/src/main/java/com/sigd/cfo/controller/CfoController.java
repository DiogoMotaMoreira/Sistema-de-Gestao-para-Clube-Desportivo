package com.sigd.cfo.controller;

import com.sigd.cfo.dto.CfoResumoDTO;
import com.sigd.core.model.EntidadeJuridica;
import com.sigd.core.model.EstadoObrigacao;
import com.sigd.core.model.ObrigacaoFinanceira;
import com.sigd.core.repository.ObrigacaoFinanceiraRepository;
import com.sigd.core.repository.UtilizadorRepository;
import com.sigd.core.repository.AtletaRepository;
import java.util.Map;
import java.util.stream.Collectors;
import com.sigd.tesouraria.dto.ObrigacaoFinanceiraDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cfo")
@PreAuthorize("hasAnyRole('ROLE_CFO', 'ROLE_ADMIN', 'ROLE_CEO')")
public class CfoController {

    private final ObrigacaoFinanceiraRepository obrigacaoRepo;
    private final UtilizadorRepository utilizadorRepo;
    private final AtletaRepository atletaRepo;

    public CfoController(ObrigacaoFinanceiraRepository obrigacaoRepo,
                         UtilizadorRepository utilizadorRepo,
                         AtletaRepository atletaRepo) {
        this.obrigacaoRepo = obrigacaoRepo;
        this.utilizadorRepo = utilizadorRepo;
        this.atletaRepo = atletaRepo;
    }

    @GetMapping("/resumo-financeiro")
    public ResponseEntity<CfoResumoDTO> getResumoFinanceiro() {
        List<ObrigacaoFinanceira> todas = obrigacaoRepo.findAll();

        BigDecimal clubeReceita = BigDecimal.ZERO;
        BigDecimal clubeDivida = BigDecimal.ZERO;
        long clubeTotal = 0;

        BigDecimal sadReceita = BigDecimal.ZERO;
        BigDecimal sadDivida = BigDecimal.ZERO;
        long sadTotal = 0;

        for (ObrigacaoFinanceira o : todas) {
            boolean isClube = o.getEntidadeJuridica() == EntidadeJuridica.CLUBE;
            boolean isPago = o.getEstado() == EstadoObrigacao.PAGO;
            boolean isDivida = o.getEstado() == EstadoObrigacao.PENDENTE || o.getEstado() == EstadoObrigacao.EM_ATRASO;

            if (isClube) {
                clubeTotal++;
                if (isPago) clubeReceita = clubeReceita.add(o.getValor());
                if (isDivida) clubeDivida = clubeDivida.add(o.getValor());
            } else if (o.getEntidadeJuridica() == EntidadeJuridica.SAD) {
                sadTotal++;
                if (isPago) sadReceita = sadReceita.add(o.getValor());
                if (isDivida) sadDivida = sadDivida.add(o.getValor());
            }
        }

        BigDecimal globalReceita = clubeReceita.add(sadReceita);
        BigDecimal globalDivida = clubeDivida.add(sadDivida);
        
        double taxaLiquidacao = 0.0;
        BigDecimal totalGlobais = globalReceita.add(globalDivida);
        if (totalGlobais.compareTo(BigDecimal.ZERO) > 0) {
            taxaLiquidacao = globalReceita.divide(totalGlobais, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
        }

        CfoResumoDTO.EntidadeResumo clube = new CfoResumoDTO.EntidadeResumo(clubeReceita, clubeDivida, clubeTotal);
        CfoResumoDTO.EntidadeResumo sad = new CfoResumoDTO.EntidadeResumo(sadReceita, sadDivida, sadTotal);
        CfoResumoDTO.GlobalResumo global = new CfoResumoDTO.GlobalResumo(globalReceita, globalDivida, taxaLiquidacao);

        Map<String, List<ObrigacaoFinanceira>> porRubrica = todas.stream()
                .collect(Collectors.groupingBy(o -> (o.getTipo() != null ? o.getTipo().name() : "OUTROS") + "#" + (o.getEntidadeJuridica() != null ? o.getEntidadeJuridica().name() : "CLUBE")));

        List<CfoResumoDTO.DetalheRubricaDTO> detalhesPorRubrica = porRubrica.entrySet().stream()
                .map(entry -> {
                    String[] parts = entry.getKey().split("#");
                    String rubrica = parts[0];
                    String entidade = parts[1];
                    List<ObrigacaoFinanceira> obs = entry.getValue();

                    BigDecimal totalGerado = obs.stream()
                            .map(ObrigacaoFinanceira::getValor)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal totalDivida = obs.stream()
                            .filter(o -> o.getEstado() == EstadoObrigacao.EM_ATRASO)
                            .map(ObrigacaoFinanceira::getValor)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    BigDecimal totalPagos = obs.stream()
                            .filter(o -> o.getEstado() == EstadoObrigacao.PAGO)
                            .map(ObrigacaoFinanceira::getValor)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    double taxaLiquidacaoRubrica = 0.0;
                    if (totalGerado.compareTo(BigDecimal.ZERO) > 0) {
                        taxaLiquidacaoRubrica = totalPagos.divide(totalGerado, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
                    }

                    return new CfoResumoDTO.DetalheRubricaDTO(rubrica, entidade, totalGerado, totalDivida, taxaLiquidacaoRubrica);
                })
                .collect(Collectors.toList());

        long sociosAtivos = utilizadorRepo.countByRoleAndAtivo("ROLE_EE", true);
        long atletasFederados = atletaRepo.countByFederado(true);

        return ResponseEntity.ok(new CfoResumoDTO(clube, sad, global, detalhesPorRubrica, sociosAtivos, atletasFederados));
    }

    @GetMapping("/obrigacoes")
    public ResponseEntity<Page<ObrigacaoFinanceiraDTO.Response>> getObrigacoes(
            @RequestParam(required = false) EstadoObrigacao estado,
            @RequestParam(required = false) EntidadeJuridica entidade,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ObrigacaoFinanceira> resultados = obrigacaoRepo.findByFiltros(estado, entidade, pageable);
        
        Page<ObrigacaoFinanceiraDTO.Response> dtoPage = resultados.map(o -> new ObrigacaoFinanceiraDTO.Response(
            o.getId(),
            o.getValor(),
            o.getDataVencimento(),
            o.getTipo().name(),
            o.getEstado().name(),
            o.getEntidadeJuridica().name(),
            o.getDataPagamento(),
            o.getEncarregado() != null ? o.getEncarregado().getId() : null,
            o.getEncarregado() != null ? o.getEncarregado().getNome() : null,
            o.getAtleta() != null ? o.getAtleta().getId() : null,
            o.getAtleta() != null ? o.getAtleta().getNomeCompleto() : null
        ));
        
        return ResponseEntity.ok(dtoPage);
    }
}
