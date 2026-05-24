package com.sigd.tesouraria.service;

import com.sigd.core.exception.EntidadeJuridicaObrigatoriaException;
import com.sigd.core.model.*;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.EncarregadoEducacaoRepository;
import com.sigd.core.repository.EscalaoRepository;
import com.sigd.core.repository.ObrigacaoFinanceiraRepository;
import com.sigd.tesouraria.dto.ObrigacaoFinanceiraDTO;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * ObrigacaoFinanceiraService — Lógica de negócio para obrigações financeiras.
 *
 * Responsabilidades: registar pagamentos, listar obrigações, gerar obrigações de época.
 * Regra crítica: segregação SAD/Clube OBRIGATÓRIA (entidadeJuridica).
 */
@Service
@Transactional
public class ObrigacaoFinanceiraService {

    private final ObrigacaoFinanceiraRepository obrigacaoRepo;
    private final EncarregadoEducacaoRepository encarregadoRepo;
    private final AtletaRepository atletaRepo;
    private final EscalaoRepository escalaoRepo;

    public ObrigacaoFinanceiraService(ObrigacaoFinanceiraRepository obrigacaoRepo,
                                     EncarregadoEducacaoRepository encarregadoRepo,
                                     AtletaRepository atletaRepo,
                                     EscalaoRepository escalaoRepo) {
        this.obrigacaoRepo = obrigacaoRepo;
        this.encarregadoRepo = encarregadoRepo;
        this.atletaRepo = atletaRepo;
        this.escalaoRepo = escalaoRepo;
    }

    /**
     * Regista o pagamento de uma obrigação financeira.
     *
     * REGRA: entidadeJuridica OBRIGATÓRIA — segregação SAD/Clube (RF-26+).
     *
     * @throws EntidadeJuridicaObrigatoriaException se entidadeJuridica for null
     * @throws IllegalArgumentException se a obrigação não existir
     */
    public ObrigacaoFinanceiraDTO.Response registarPagamento(Long obrigacaoId, LocalDate dataPagamento) {
        ObrigacaoFinanceira obrigacao = obrigacaoRepo.findById(obrigacaoId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Obrigação financeira não encontrada com ID: " + obrigacaoId));

        // Regra de negócio: segregação financeira SAD/Clube
        if (obrigacao.getEntidadeJuridica() == null) {
            throw new EntidadeJuridicaObrigatoriaException();
        }

        obrigacao.setEstado(EstadoObrigacao.PAGO);
        obrigacao.setDataPagamento(dataPagamento != null ? dataPagamento : LocalDate.now());

        obrigacao = obrigacaoRepo.save(obrigacao);
        return toResponse(obrigacao);
    }

    /**
     * Lista todas as obrigações financeiras de um encarregado.
     */
    @Transactional(readOnly = true)
    public List<ObrigacaoFinanceiraDTO.Response> listarPorEncarregado(Long eeId) {
        return obrigacaoRepo.findByEncarregadoId(eeId).stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Gera obrigações de época (quota anual + 10 mensalidades) para todos os atletas
     * das equipas do escalão especificado.
     *
     * As obrigações são criadas com entidadeJuridica = CLUBE e estado = PENDENTE.
     */
    public void gerarObrigacoesEpoca(Long escalaoId) {
        Escalao escalao = escalaoRepo.findById(escalaoId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Escalão não encontrado com ID: " + escalaoId));

        // Buscar todos os atletas que pertencem a equipas deste escalão
        List<Atleta> atletas = atletaRepo.findAll().stream()
                .filter(a -> a.getEquipa() != null
                        && a.getEquipa().getEscalao() != null
                        && a.getEquipa().getEscalao().getId().equals(escalaoId))
                .toList();

        LocalDate hoje = LocalDate.now();

        for (Atleta atleta : atletas) {
            EncarregadoEducacao ee = atleta.getEncarregado();

            // Gerar quota anual
            if (escalao.getQuotaAnual() != null) {
                ObrigacaoFinanceira quota = new ObrigacaoFinanceira();
                quota.setValor(escalao.getQuotaAnual());
                quota.setDataVencimento(hoje.plusMonths(1));
                quota.setTipo(TipoObrigacao.QUOTA_ANUAL);
                quota.setEstado(EstadoObrigacao.PENDENTE);
                quota.setEntidadeJuridica(EntidadeJuridica.CLUBE);
                quota.setEncarregado(ee);
                quota.setAtleta(atleta);
                obrigacaoRepo.save(quota);
            }

            // Gerar 10 mensalidades (setembro a junho)
            if (escalao.getMensalidadeBase() != null) {
                for (int mes = 0; mes < 10; mes++) {
                    ObrigacaoFinanceira mensalidade = new ObrigacaoFinanceira();

                    // Usar mensalidade sócio se tiver número de sócio, senão base
                    boolean isSocio = atleta.getNumeroSocio() != null && !atleta.getNumeroSocio().isBlank();
                    mensalidade.setValor(isSocio && escalao.getMensalidadeSocio() != null
                            ? escalao.getMensalidadeSocio()
                            : escalao.getMensalidadeBase());

                    mensalidade.setDataVencimento(hoje.plusMonths(mes + 1));
                    mensalidade.setTipo(TipoObrigacao.MENSALIDADE);
                    mensalidade.setEstado(EstadoObrigacao.PENDENTE);
                    mensalidade.setEntidadeJuridica(EntidadeJuridica.CLUBE);
                    mensalidade.setEncarregado(ee);
                    mensalidade.setAtleta(atleta);
                    obrigacaoRepo.save(mensalidade);
                }
            }
        }
    }

    // === Helper privado ===

    private ObrigacaoFinanceiraDTO.Response toResponse(ObrigacaoFinanceira o) {
        return new ObrigacaoFinanceiraDTO.Response(
                o.getId(),
                o.getValor(),
                o.getDataVencimento(),
                o.getTipo() != null ? o.getTipo().name() : null,
                o.getEstado() != null ? o.getEstado().name() : null,
                o.getEntidadeJuridica() != null ? o.getEntidadeJuridica().name() : null,
                o.getDataPagamento(),
                o.getEncarregado().getId(),
                o.getEncarregado().getNome(),
                o.getAtleta() != null ? o.getAtleta().getId() : null,
                o.getAtleta() != null ? o.getAtleta().getNomeCompleto() : null
        );
    }

}
