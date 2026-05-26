package com.sigd.ceo.controller;

import com.sigd.ceo.dto.CeoKpisDTO;
import com.sigd.core.model.EstadoElegibilidade;
import com.sigd.core.model.EstadoObrigacao;
import com.sigd.core.model.ObrigacaoFinanceira;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.EncarregadoEducacaoRepository;
import com.sigd.core.repository.EquipaRepository;
import com.sigd.core.repository.ObrigacaoFinanceiraRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/ceo")
@PreAuthorize("hasAnyRole('ROLE_CEO', 'ROLE_ADMIN')")
public class CeoController {

    private final AtletaRepository atletaRepo;
    private final EquipaRepository equipaRepo;
    private final EncarregadoEducacaoRepository encarregadoRepo;
    private final ObrigacaoFinanceiraRepository obrigacaoRepo;

    public CeoController(AtletaRepository atletaRepo,
                         EquipaRepository equipaRepo,
                         EncarregadoEducacaoRepository encarregadoRepo,
                         ObrigacaoFinanceiraRepository obrigacaoRepo) {
        this.atletaRepo = atletaRepo;
        this.equipaRepo = equipaRepo;
        this.encarregadoRepo = encarregadoRepo;
        this.obrigacaoRepo = obrigacaoRepo;
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

    private BigDecimal sumObrigacoes(List<ObrigacaoFinanceira> obrigacoes) {
        return obrigacoes.stream()
                .map(ObrigacaoFinanceira::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
