package com.sigd.tesouraria.service;

import com.sigd.core.model.*;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.EpocaDesportivaRepository;
import com.sigd.core.repository.ObrigacaoFinanceiraRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class ProvisaoService {

    private final EpocaDesportivaRepository epocaRepo;
    private final AtletaRepository atletaRepo;
    private final ObrigacaoFinanceiraRepository obrigacaoRepo;

    public ProvisaoService(EpocaDesportivaRepository epocaRepo,
                           AtletaRepository atletaRepo,
                           ObrigacaoFinanceiraRepository obrigacaoRepo) {
        this.epocaRepo = epocaRepo;
        this.atletaRepo = atletaRepo;
        this.obrigacaoRepo = obrigacaoRepo;
    }

    public void gerarProvisaoEpoca(Long epocaId) {
        // 1. Carrega a época desportiva pelo ID
        EpocaDesportiva epoca = epocaRepo.findById(epocaId)
                .orElseThrow(() -> new IllegalArgumentException("Época não encontrada com ID: " + epocaId));

        // 2. Carrega todos os atletas activos (estado_elegibilidade != arquivado -> na verdade, todos)
        List<Atleta> atletas = atletaRepo.findAll();

        for (Atleta atleta : atletas) {
            // Verifica se o atleta tem escalão associado
            if (atleta.getEquipa() == null || atleta.getEquipa().getEscalao() == null) {
                continue;
            }

            // a. Carrega o escalão da equipa do atleta
            Escalao escalao = atleta.getEquipa().getEscalao();

            // b. Carrega o EE do atleta
            EncarregadoEducacao ee = atleta.getEncarregado();

            // c. Verifica se EE é sócio (campo isSocio ou estatuto -> Usamos numeroSocio do atleta)
            boolean isSocio = atleta.getNumeroSocio() != null && !atleta.getNumeroSocio().trim().isEmpty();

            // d. Calcula mensalidade
            BigDecimal valorMensalidade = isSocio ? escalao.getMensalidadeSocio() : escalao.getMensalidadeBase();
            if (valorMensalidade == null) {
                valorMensalidade = BigDecimal.ZERO;
            }

            // e. Verifica se já existe obrigação para este atleta no mesmo ano civil (QUOTA_ANUAL)
            int anoAtual = LocalDate.now().getYear();
            boolean hasQuota = obrigacaoRepo.findByAtletaId(atleta.getId()).stream()
                    .anyMatch(o -> o.getTipo() == TipoObrigacao.QUOTA_ANUAL &&
                            o.getDataVencimento() != null &&
                            o.getDataVencimento().getYear() == anoAtual);

            // Cria QUOTA_ANUAL se não existir
            if (!hasQuota && escalao.getQuotaAnual() != null && escalao.getQuotaAnual().compareTo(BigDecimal.ZERO) > 0) {
                ObrigacaoFinanceira quota = new ObrigacaoFinanceira();
                quota.setTipo(TipoObrigacao.QUOTA_ANUAL);
                quota.setValor(escalao.getQuotaAnual());
                quota.setEntidadeJuridica(EntidadeJuridica.CLUBE);
                quota.setDataVencimento(epoca.getDataInicio());
                quota.setEstado(EstadoObrigacao.PENDENTE);
                quota.setAtleta(atleta);
                quota.setEncarregado(ee);
                obrigacaoRepo.save(quota);
            }

            // f. Cria ObrigacaoFinanceira para mensalidade no mês atual/seguinte, só se não existir
            LocalDate dataVencimentoMensalidade = LocalDate.now().plusMonths(1).withDayOfMonth(1);
            boolean hasMensalidade = obrigacaoRepo.findByAtletaId(atleta.getId()).stream()
                    .anyMatch(o -> o.getTipo() == TipoObrigacao.MENSALIDADE &&
                            o.getDataVencimento() != null &&
                            o.getDataVencimento().getYear() == dataVencimentoMensalidade.getYear() &&
                            o.getDataVencimento().getMonthValue() == dataVencimentoMensalidade.getMonthValue());

            if (!hasMensalidade && valorMensalidade.compareTo(BigDecimal.ZERO) > 0) {
                ObrigacaoFinanceira mensalidade = new ObrigacaoFinanceira();
                mensalidade.setTipo(TipoObrigacao.MENSALIDADE);
                mensalidade.setValor(valorMensalidade);
                mensalidade.setDataVencimento(dataVencimentoMensalidade);
                mensalidade.setEstado(EstadoObrigacao.PENDENTE);
                mensalidade.setEntidadeJuridica(EntidadeJuridica.SAD);
                mensalidade.setAtleta(atleta);
                mensalidade.setEncarregado(ee);
                obrigacaoRepo.save(mensalidade);
            }
        }
    }
}
