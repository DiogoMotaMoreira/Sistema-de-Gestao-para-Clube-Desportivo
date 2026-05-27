package com.sigd.ceo.service;

import com.sigd.ceo.controller.CeoController;
import com.sigd.ceo.dto.CeoKpisDTO;
import com.sigd.ceo.dto.CeoKpisDesportivosDTO;
import com.sigd.core.model.EstadoElegibilidade;
import com.sigd.core.model.EstadoObrigacao;
import com.sigd.core.model.ObrigacaoFinanceira;
import com.sigd.core.model.TipoEvento;
import com.sigd.core.model.EstadoEvento;
import com.sigd.core.model.EventoDesportivo;
import com.sigd.core.model.Equipa;
import com.sigd.core.model.Escalao;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.ConvocatoriaRepository;
import com.sigd.core.repository.EncarregadoEducacaoRepository;
import com.sigd.core.repository.EquipaRepository;
import com.sigd.core.repository.EventoDesportivoRepository;
import com.sigd.core.repository.ObrigacaoFinanceiraRepository;
import com.sigd.core.repository.SessaoTreinoRepository;
import com.sigd.core.repository.FichaJogoRepository;
import com.sigd.core.model.FichaJogo;
import com.sigd.core.model.ResultadoJogo;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class CeoServiceTest {

    @Mock
    private AtletaRepository atletaRepo;
    @Mock
    private EquipaRepository equipaRepo;
    @Mock
    private EncarregadoEducacaoRepository encarregadoRepo;
    @Mock
    private ObrigacaoFinanceiraRepository obrigacaoRepo;
    @Mock
    private EventoDesportivoRepository eventoRepo;
    @Mock
    private SessaoTreinoRepository sessaoTreinoRepo;
    @Mock
    private ConvocatoriaRepository convocatoriaRepo;
    @Mock
    private FichaJogoRepository fichaJogoRepo;

    @InjectMocks
    private CeoController ceoController;

    // GRUPO 1 — KPIs financeiros
    @Test
    void deve_calcular_receita_total_correctamente() {
        ObrigacaoFinanceira ob1 = new ObrigacaoFinanceira();
        ob1.setValor(new BigDecimal("100.00"));
        ObrigacaoFinanceira ob2 = new ObrigacaoFinanceira();
        ob2.setValor(new BigDecimal("250.00"));

        when(obrigacaoRepo.findByEstado(EstadoObrigacao.PAGO)).thenReturn(List.of(ob1, ob2));

        ResponseEntity<CeoKpisDTO> response = ceoController.getKpis();
        assertEquals(new BigDecimal("350.00"), response.getBody().receitaTotal());
    }

    @Test
    void deve_calcular_divida_vencida_correctamente() {
        ObrigacaoFinanceira atraso = new ObrigacaoFinanceira();
        atraso.setValor(new BigDecimal("50.00"));
        when(obrigacaoRepo.findByEstado(EstadoObrigacao.EM_ATRASO)).thenReturn(List.of(atraso));

        ObrigacaoFinanceira pendente = new ObrigacaoFinanceira();
        pendente.setValor(new BigDecimal("20.00"));
        when(obrigacaoRepo.findByEstado(EstadoObrigacao.PENDENTE)).thenReturn(List.of(pendente));

        ResponseEntity<CeoKpisDTO> response = ceoController.getKpis();
        assertEquals(new BigDecimal("70.00"), response.getBody().dividaTotal());
    }

    @Test
    void deve_calcular_racio_liquidez_correctamente() {
        ObrigacaoFinanceira ob1 = new ObrigacaoFinanceira();
        ob1.setValor(new BigDecimal("100.00"));
        when(obrigacaoRepo.findByEstado(EstadoObrigacao.PAGO)).thenReturn(List.of(ob1));

        ObrigacaoFinanceira ob2 = new ObrigacaoFinanceira();
        ob2.setValor(new BigDecimal("100.00"));
        when(obrigacaoRepo.findByEstado(EstadoObrigacao.EM_ATRASO)).thenReturn(List.of(ob2));
        when(obrigacaoRepo.findByEstado(EstadoObrigacao.PENDENTE)).thenReturn(List.of());

        ResponseEntity<CeoKpisDTO> response = ceoController.getKpis();
        assertEquals(new BigDecimal("50.0"), response.getBody().racioLiquidez());
    }

    @Test
    void deve_retornar_zero_quando_sem_obrigacoes() {
        when(obrigacaoRepo.findByEstado(EstadoObrigacao.PAGO)).thenReturn(List.of());
        when(obrigacaoRepo.findByEstado(EstadoObrigacao.PENDENTE)).thenReturn(List.of());
        when(obrigacaoRepo.findByEstado(EstadoObrigacao.EM_ATRASO)).thenReturn(List.of());

        ResponseEntity<CeoKpisDTO> response = ceoController.getKpis();
        assertEquals(BigDecimal.ZERO, response.getBody().receitaTotal());
        assertEquals(BigDecimal.ZERO, response.getBody().dividaTotal());
    }

    // GRUPO 2 — Alertas estratégicos
    @Test
    void deve_detectar_atletas_com_emd_pendente() {
        when(atletaRepo.findByEstadoElegibilidade(EstadoElegibilidade.PENDENTE_EMD)).thenReturn(List.of(new com.sigd.core.model.Atleta()));
        
        ResponseEntity<List<CeoController.CeoAlertaDTO>> response = ceoController.getAlertas();
        boolean found = response.getBody().stream().anyMatch(a -> a.mensagem().contains("EMD pendente"));
        Assertions.assertTrue(found);
    }

    @Test
    void deve_detectar_obrigacoes_em_atraso() {
        when(obrigacaoRepo.findByEstado(EstadoObrigacao.EM_ATRASO)).thenReturn(List.of(new ObrigacaoFinanceira(), new ObrigacaoFinanceira()));
        
        ResponseEntity<List<CeoController.CeoAlertaDTO>> response = ceoController.getAlertas();
        boolean found = response.getBody().stream().anyMatch(a -> a.mensagem().contains("obrigações em atraso"));
        Assertions.assertTrue(found);
    }

    @Test
    void deve_detectar_atletas_com_lesao_grave() {
        when(atletaRepo.findByEstadoElegibilidade(EstadoElegibilidade.INAPTO)).thenReturn(List.of(new com.sigd.core.model.Atleta()));
        
        ResponseEntity<List<CeoController.CeoAlertaDTO>> response = ceoController.getAlertas();
        boolean found = response.getBody().stream().anyMatch(a -> a.mensagem().contains("lesão grave"));
        Assertions.assertTrue(found);
    }

    @Test
    void deve_retornar_lista_vazia_de_alertas_quando_tudo_ok() {
        when(atletaRepo.findByEstadoElegibilidade(EstadoElegibilidade.PENDENTE_EMD)).thenReturn(List.of());
        when(obrigacaoRepo.findByEstado(EstadoObrigacao.EM_ATRASO)).thenReturn(List.of());
        when(atletaRepo.findByEstadoElegibilidade(EstadoElegibilidade.INAPTO)).thenReturn(List.of());
        when(eventoRepo.findAll()).thenReturn(List.of());

        ResponseEntity<List<CeoController.CeoAlertaDTO>> response = ceoController.getAlertas();
        Assertions.assertTrue(response.getBody().isEmpty());
    }

    // GRUPO 3 — Performance desportiva
    @Test
    void deve_agrupar_jogos_por_escalao() {
        Escalao esc = new Escalao();
        esc.setDesignacao("Sub-15");
        Equipa equipa = new Equipa();
        equipa.setEscalao(esc);
        EventoDesportivo jogo = new EventoDesportivo();
        jogo.setTipo(TipoEvento.JOGO_OFICIAL);
        jogo.setEstado(EstadoEvento.CONCLUIDO);
        jogo.setEquipa(equipa);

        when(eventoRepo.findAll()).thenReturn(List.of(jogo));

        ResponseEntity<List<CeoController.PerformanceEscalaoDTO>> response = ceoController.getPerformanceEscaloes();
        assertEquals(1, response.getBody().size());
        assertEquals("Sub-15", response.getBody().get(0).escalao());
        assertEquals(1, response.getBody().get(0).totalJogos());
    }

    @Test
    void deve_calcular_win_rate_por_escalao() {
        Escalao esc = new Escalao();
        esc.setDesignacao("Sub-15");
        Equipa equipa = new Equipa();
        equipa.setEscalao(esc);
        
        EventoDesportivo jogo1 = new EventoDesportivo();
        jogo1.setId(1L);
        jogo1.setTipo(TipoEvento.JOGO_OFICIAL);
        jogo1.setEstado(EstadoEvento.CONCLUIDO);
        jogo1.setEquipa(equipa);

        EventoDesportivo jogo2 = new EventoDesportivo();
        jogo2.setId(2L);
        jogo2.setTipo(TipoEvento.JOGO_OFICIAL);
        jogo2.setEstado(EstadoEvento.CONCLUIDO);
        jogo2.setEquipa(equipa);

        when(eventoRepo.findAll()).thenReturn(List.of(jogo1, jogo2));

        FichaJogo f1 = new FichaJogo();
        f1.setResultado(ResultadoJogo.VITORIA);
        when(fichaJogoRepo.findByEventoId(1L)).thenReturn(Optional.of(f1));

        FichaJogo f2 = new FichaJogo();
        f2.setResultado(ResultadoJogo.DERROTA);
        when(fichaJogoRepo.findByEventoId(2L)).thenReturn(Optional.of(f2));

        ResponseEntity<List<CeoController.PerformanceEscalaoDTO>> response = ceoController.getPerformanceEscaloes();
        assertEquals(1, response.getBody().size());
        assertEquals("Sub-15", response.getBody().get(0).escalao());
        assertEquals(50.0, response.getBody().get(0).winRate());
    }

    @Test
    void deve_contar_jogos_concluidos_e_agendados() {
        when(eventoRepo.countByTipoAndEstado(TipoEvento.JOGO_OFICIAL, EstadoEvento.CONCLUIDO)).thenReturn(5L);
        when(eventoRepo.countByTipoAndEstado(TipoEvento.JOGO_OFICIAL, EstadoEvento.AGENDADO)).thenReturn(3L);

        ResponseEntity<CeoKpisDesportivosDTO> response = ceoController.getKpisDesportivos();
        assertEquals(5L, response.getBody().jogosConcluidos());
        assertEquals(3L, response.getBody().jogosAgendados());
    }
}
