package com.sigd.tesouraria.service;

import com.sigd.core.exception.EntidadeJuridicaObrigatoriaException;
import com.sigd.core.model.*;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.EncarregadoEducacaoRepository;
import com.sigd.core.repository.EscalaoRepository;
import com.sigd.core.repository.ObrigacaoFinanceiraRepository;
import com.sigd.tesouraria.dto.ObrigacaoFinanceiraDTO;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * ObrigacaoFinanceiraServiceTest — Testes unitários para ObrigacaoFinanceiraService.
 *
 * Usa JUnit 5 + Mockito (sem TestContainers, conforme convenção AGENTS.md).
 */
@ExtendWith(MockitoExtension.class)
class ObrigacaoFinanceiraServiceTest {

    @Mock
    private ObrigacaoFinanceiraRepository obrigacaoRepo;

    @Mock
    private EncarregadoEducacaoRepository encarregadoRepo;

    @Mock
    private AtletaRepository atletaRepo;

    @Mock
    private EscalaoRepository escalaoRepo;

    @InjectMocks
    private ObrigacaoFinanceiraService obrigacaoService;

    private ObrigacaoFinanceira obrigacao;
    private EncarregadoEducacao encarregado;

    @BeforeEach
    void setUp() {
        encarregado = new EncarregadoEducacao();
        encarregado.setId(1L);
        encarregado.setNome("João Silva");
        encarregado.setCriadoEm(LocalDateTime.now());

        obrigacao = new ObrigacaoFinanceira();
        obrigacao.setId(100L);
        obrigacao.setValor(new BigDecimal("250.00"));
        obrigacao.setDataVencimento(LocalDate.of(2026, 6, 1));
        obrigacao.setTipo(TipoObrigacao.MENSALIDADE);
        obrigacao.setEstado(EstadoObrigacao.PENDENTE);
        obrigacao.setEncarregado(encarregado);
        obrigacao.setCriadoEm(LocalDateTime.now());
    }

    @Test
    @DisplayName("Registar pagamento sem entidadeJuridica lança EntidadeJuridicaObrigatoriaException")
    void registarPagamento_semEntidadeJuridica_lancaExcecao() {
        // Arrange — obrigação sem entidadeJuridica (null)
        obrigacao.setEntidadeJuridica(null);
        when(obrigacaoRepo.findById(100L)).thenReturn(Optional.of(obrigacao));

        // Act & Assert
        assertThatThrownBy(() -> obrigacaoService.registarPagamento(100L, LocalDate.now()))
                .isInstanceOf(EntidadeJuridicaObrigatoriaException.class)
                .hasMessageContaining("entidade jurídica");

        verify(obrigacaoRepo, never()).save(any());
    }

    @Test
    @DisplayName("Registar pagamento com sucesso altera estado para PAGO")
    void registarPagamento_comSucesso() {
        // Arrange
        obrigacao.setEntidadeJuridica(EntidadeJuridica.CLUBE);
        when(obrigacaoRepo.findById(100L)).thenReturn(Optional.of(obrigacao));
        when(obrigacaoRepo.save(any(ObrigacaoFinanceira.class))).thenAnswer(i -> i.getArgument(0));

        LocalDate dataPagamento = LocalDate.of(2026, 5, 24);

        // Act
        ObrigacaoFinanceiraDTO.Response response = obrigacaoService.registarPagamento(100L, dataPagamento);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.estado()).isEqualTo("PAGO");
        assertThat(response.dataPagamento()).isEqualTo(dataPagamento);
        assertThat(response.entidadeJuridica()).isEqualTo("CLUBE");

        verify(obrigacaoRepo).save(any(ObrigacaoFinanceira.class));
    }

    @Test
    @DisplayName("Registar pagamento com obrigação inexistente lança IllegalArgumentException")
    void registarPagamento_obrigacaoInexistente_lancaExcecao() {
        // Arrange
        when(obrigacaoRepo.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> obrigacaoService.registarPagamento(999L, LocalDate.now()))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("999");
    }

}
