package com.sigd.tesouraria.service;

import com.sigd.core.model.*;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.EpocaDesportivaRepository;
import com.sigd.core.repository.ObrigacaoFinanceiraRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProvisaoServiceTest {

    @Mock
    private EpocaDesportivaRepository epocaRepo;

    @Mock
    private AtletaRepository atletaRepo;

    @Mock
    private ObrigacaoFinanceiraRepository obrigacaoRepo;

    @InjectMocks
    private ProvisaoService provisaoService;

    private EpocaDesportiva epoca;
    private Atleta atleta;
    private Equipa equipa;
    private Escalao escalao;
    private EncarregadoEducacao ee;

    @BeforeEach
    void setUp() {
        epoca = new EpocaDesportiva();
        epoca.setId(1L);
        epoca.setDataInicio(LocalDate.of(LocalDate.now().getYear(), 9, 1));

        ee = new EncarregadoEducacao();
        ee.setId(100L);

        escalao = new Escalao();
        escalao.setId(10L);
        escalao.setMensalidadeBase(new BigDecimal("30.00"));
        escalao.setMensalidadeSocio(new BigDecimal("25.00"));
        escalao.setQuotaAnual(new BigDecimal("50.00"));

        equipa = new Equipa();
        equipa.setId(20L);
        equipa.setEscalao(escalao);

        atleta = new Atleta();
        atleta.setId(1000L);
        atleta.setEncarregado(ee);
        atleta.setEquipa(equipa);
        atleta.setNumeroSocio("12345"); // É sócio
    }

    // ==========================================
    // GRUPO 1 — Geração de obrigações (RF-29, UC-04)
    // ==========================================

    @Test
    @DisplayName("Deve gerar mensalidade para atleta sem obrigação no mês")
    void deve_gerar_mensalidade_para_atleta_sem_obrigacao_no_mes() {
        when(epocaRepo.findById(1L)).thenReturn(Optional.of(epoca));
        when(atletaRepo.findAll()).thenReturn(List.of(atleta));
        
        // Quota anual já existe, apenas mensalidade não existe
        ObrigacaoFinanceira quotaExistente = new ObrigacaoFinanceira();
        quotaExistente.setTipo(TipoObrigacao.QUOTA_ANUAL);
        quotaExistente.setDataVencimento(LocalDate.now());
        when(obrigacaoRepo.findByAtletaId(1000L)).thenReturn(List.of(quotaExistente));

        provisaoService.gerarProvisaoEpoca(1L);

        ArgumentCaptor<ObrigacaoFinanceira> captor = ArgumentCaptor.forClass(ObrigacaoFinanceira.class);
        verify(obrigacaoRepo, times(1)).save(captor.capture());

        ObrigacaoFinanceira saved = captor.getValue();
        assertThat(saved.getTipo()).isEqualTo(TipoObrigacao.MENSALIDADE);
        assertThat(saved.getValor()).isEqualTo(new BigDecimal("25.00")); // Sócio
    }

    @Test
    @DisplayName("Não deve duplicar mensalidade quando já existe no mês")
    void deve_nao_duplicar_mensalidade_quando_ja_existe_no_mes() {
        when(epocaRepo.findById(1L)).thenReturn(Optional.of(epoca));
        when(atletaRepo.findAll()).thenReturn(List.of(atleta));

        ObrigacaoFinanceira mensalidadeExistente = new ObrigacaoFinanceira();
        mensalidadeExistente.setTipo(TipoObrigacao.MENSALIDADE);
        mensalidadeExistente.setDataVencimento(LocalDate.now().plusMonths(1).withDayOfMonth(1));

        ObrigacaoFinanceira quotaExistente = new ObrigacaoFinanceira();
        quotaExistente.setTipo(TipoObrigacao.QUOTA_ANUAL);
        quotaExistente.setDataVencimento(LocalDate.now());

        when(obrigacaoRepo.findByAtletaId(1000L)).thenReturn(List.of(mensalidadeExistente, quotaExistente));

        provisaoService.gerarProvisaoEpoca(1L);

        verify(obrigacaoRepo, never()).save(any());
    }

    @Test
    @DisplayName("Deve gerar quota anual para atleta sem quota no ano")
    void deve_gerar_quota_anual_para_atleta_sem_quota_no_ano() {
        when(epocaRepo.findById(1L)).thenReturn(Optional.of(epoca));
        when(atletaRepo.findAll()).thenReturn(List.of(atleta));

        ObrigacaoFinanceira mensalidadeExistente = new ObrigacaoFinanceira();
        mensalidadeExistente.setTipo(TipoObrigacao.MENSALIDADE);
        mensalidadeExistente.setDataVencimento(LocalDate.now().plusMonths(1).withDayOfMonth(1));

        when(obrigacaoRepo.findByAtletaId(1000L)).thenReturn(List.of(mensalidadeExistente));

        provisaoService.gerarProvisaoEpoca(1L);

        ArgumentCaptor<ObrigacaoFinanceira> captor = ArgumentCaptor.forClass(ObrigacaoFinanceira.class);
        verify(obrigacaoRepo, times(1)).save(captor.capture());

        ObrigacaoFinanceira saved = captor.getValue();
        assertThat(saved.getTipo()).isEqualTo(TipoObrigacao.QUOTA_ANUAL);
        assertThat(saved.getValor()).isEqualTo(new BigDecimal("50.00"));
    }

    @Test
    @DisplayName("Não deve duplicar quota anual quando já existe no ano")
    void deve_nao_duplicar_quota_anual_quando_ja_existe_no_ano() {
        when(epocaRepo.findById(1L)).thenReturn(Optional.of(epoca));
        when(atletaRepo.findAll()).thenReturn(List.of(atleta));

        ObrigacaoFinanceira quotaExistente = new ObrigacaoFinanceira();
        quotaExistente.setTipo(TipoObrigacao.QUOTA_ANUAL);
        quotaExistente.setDataVencimento(LocalDate.now());

        when(obrigacaoRepo.findByAtletaId(1000L)).thenReturn(List.of(quotaExistente));

        provisaoService.gerarProvisaoEpoca(1L);

        // Deve gravar APENAS a mensalidade
        ArgumentCaptor<ObrigacaoFinanceira> captor = ArgumentCaptor.forClass(ObrigacaoFinanceira.class);
        verify(obrigacaoRepo, times(1)).save(captor.capture());
        assertThat(captor.getValue().getTipo()).isEqualTo(TipoObrigacao.MENSALIDADE);
    }

    @Test
    @DisplayName("Deve gerar obrigações para todos os atletas da equipa")
    void deve_gerar_obrigacoes_para_todos_os_atletas_da_equipa() {
        Atleta atleta2 = new Atleta();
        atleta2.setId(1001L);
        atleta2.setEncarregado(ee);
        atleta2.setEquipa(equipa);

        when(epocaRepo.findById(1L)).thenReturn(Optional.of(epoca));
        when(atletaRepo.findAll()).thenReturn(List.of(atleta, atleta2));
        when(obrigacaoRepo.findByAtletaId(anyLong())).thenReturn(Collections.emptyList());

        provisaoService.gerarProvisaoEpoca(1L);

        // 2 atletas * 2 obrigações (quota + mensalidade) = 4 saves
        verify(obrigacaoRepo, times(4)).save(any(ObrigacaoFinanceira.class));
    }

    // ==========================================
    // GRUPO 2 — Validações (RF-29)
    // ==========================================

    @Test
    @DisplayName("Deve lançar exceção quando a época não existe")
    void deve_lancara_excecao_quando_epoca_nao_existe() {
        when(epocaRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> provisaoService.gerarProvisaoEpoca(99L))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Deve lançar exceção quando a equipa não tem atletas")
    void deve_lancara_excecao_quando_equipa_sem_atletas() {
        when(epocaRepo.findById(1L)).thenReturn(Optional.of(epoca));
        when(atletaRepo.findAll()).thenReturn(Collections.emptyList());

        // O código atual apenas retorna silenciosamente.
        // O teste espera uma exceção, o que vai expor um BUG de validação.
        assertThatThrownBy(() -> provisaoService.gerarProvisaoEpoca(1L))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    @DisplayName("Deve associar o encarregado correto à obrigação")
    void deve_associar_encarregado_correcto_a_obrigacao() {
        when(epocaRepo.findById(1L)).thenReturn(Optional.of(epoca));
        when(atletaRepo.findAll()).thenReturn(List.of(atleta));
        when(obrigacaoRepo.findByAtletaId(1000L)).thenReturn(Collections.emptyList());

        provisaoService.gerarProvisaoEpoca(1L);

        ArgumentCaptor<ObrigacaoFinanceira> captor = ArgumentCaptor.forClass(ObrigacaoFinanceira.class);
        verify(obrigacaoRepo, atLeastOnce()).save(captor.capture());

        for (ObrigacaoFinanceira o : captor.getAllValues()) {
            assertThat(o.getEncarregado()).isEqualTo(ee);
        }
    }

    // ==========================================
    // GRUPO 3 — Edge cases
    // ==========================================

    @Test
    @DisplayName("Deve calcular valor correto baseado no escalão (sócio vs não-sócio)")
    void deve_calcular_valor_correcto_baseado_no_escalao() {
        Atleta atletaNaoSocio = new Atleta();
        atletaNaoSocio.setId(1002L);
        atletaNaoSocio.setEncarregado(ee);
        atletaNaoSocio.setEquipa(equipa);
        atletaNaoSocio.setNumeroSocio(null); // Não é sócio

        when(epocaRepo.findById(1L)).thenReturn(Optional.of(epoca));
        when(atletaRepo.findAll()).thenReturn(List.of(atleta, atletaNaoSocio));
        when(obrigacaoRepo.findByAtletaId(anyLong())).thenReturn(Collections.emptyList());

        provisaoService.gerarProvisaoEpoca(1L);

        ArgumentCaptor<ObrigacaoFinanceira> captor = ArgumentCaptor.forClass(ObrigacaoFinanceira.class);
        verify(obrigacaoRepo, times(4)).save(captor.capture());

        List<ObrigacaoFinanceira> saves = captor.getAllValues();
        
        // Mensalidade atleta (Sócio) -> 25.00
        boolean isSocioMensalidadeOk = saves.stream().anyMatch(o -> o.getAtleta().getId().equals(1000L) && o.getTipo() == TipoObrigacao.MENSALIDADE && o.getValor().equals(new BigDecimal("25.00")));
        assertThat(isSocioMensalidadeOk).isTrue();

        // Mensalidade atleta2 (Não sócio) -> 30.00
        boolean isNaoSocioMensalidadeOk = saves.stream().anyMatch(o -> o.getAtleta().getId().equals(1002L) && o.getTipo() == TipoObrigacao.MENSALIDADE && o.getValor().equals(new BigDecimal("30.00")));
        assertThat(isNaoSocioMensalidadeOk).isTrue();
    }

    @Test
    @DisplayName("Deve definir estado PENDENTE na criação")
    void deve_definir_estado_PENDENTE_na_criacao() {
        when(epocaRepo.findById(1L)).thenReturn(Optional.of(epoca));
        when(atletaRepo.findAll()).thenReturn(List.of(atleta));
        when(obrigacaoRepo.findByAtletaId(1000L)).thenReturn(Collections.emptyList());

        provisaoService.gerarProvisaoEpoca(1L);

        ArgumentCaptor<ObrigacaoFinanceira> captor = ArgumentCaptor.forClass(ObrigacaoFinanceira.class);
        verify(obrigacaoRepo, atLeastOnce()).save(captor.capture());

        for (ObrigacaoFinanceira o : captor.getAllValues()) {
            assertThat(o.getEstado()).isEqualTo(EstadoObrigacao.PENDENTE);
        }
    }

    @Test
    @DisplayName("Deve definir data de vencimento correta para a mensalidade (dia 1 do mês seguinte)")
    void deve_definir_data_vencimento_correcta_para_mes_corrente() {
        when(epocaRepo.findById(1L)).thenReturn(Optional.of(epoca));
        when(atletaRepo.findAll()).thenReturn(List.of(atleta));
        when(obrigacaoRepo.findByAtletaId(1000L)).thenReturn(Collections.emptyList());

        provisaoService.gerarProvisaoEpoca(1L);

        ArgumentCaptor<ObrigacaoFinanceira> captor = ArgumentCaptor.forClass(ObrigacaoFinanceira.class);
        verify(obrigacaoRepo, atLeastOnce()).save(captor.capture());

        ObrigacaoFinanceira mensalidade = captor.getAllValues().stream()
                .filter(o -> o.getTipo() == TipoObrigacao.MENSALIDADE)
                .findFirst().orElseThrow();

        LocalDate expected = LocalDate.now().plusMonths(1).withDayOfMonth(1);
        assertThat(mensalidade.getDataVencimento()).isEqualTo(expected);
    }

    @Test
    @DisplayName("Deve ignorar atletas sem encarregado associado")
    void deve_ignorar_atletas_sem_encarregado_associado() {
        atleta.setEncarregado(null); // Atleta sem encarregado
        
        when(epocaRepo.findById(1L)).thenReturn(Optional.of(epoca));
        when(atletaRepo.findAll()).thenReturn(List.of(atleta));
        
        // O teste espera que o serviço ignore o atleta e continue o loop
        // Sem fazer chamadas ao repo.save
        provisaoService.gerarProvisaoEpoca(1L);

        // Se o bug existir, o serviço tentou gravar e isto vai falhar, ou a asserção apanha a chamada
        verify(obrigacaoRepo, never()).save(any(ObrigacaoFinanceira.class));
    }
}
