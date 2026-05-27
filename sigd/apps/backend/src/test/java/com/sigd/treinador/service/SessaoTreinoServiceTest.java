package com.sigd.treinador.service;

import com.sigd.core.model.*;
import com.sigd.core.repository.*;
import com.sigd.treinador.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessaoTreinoServiceTest {

    @Mock
    private SessaoTreinoRepository sessaoTreinoRepo;
    @Mock
    private EquipaRepository equipaRepo;
    @Mock
    private AtletaRepository atletaRepo;
    @Mock
    private RegistoAssiduidadeRepository registoAssiduidadeRepo;
    @Mock
    private AvaliacaoRendimentoRepository avaliacaoRendimentoRepo;
    @Mock
    private com.sigd.tesouraria.service.AtletaService atletaService;

    @InjectMocks
    private SessaoTreinoService sessaoTreinoService;

    private Equipa equipa;
    private Atleta atleta;
    private SessaoTreino sessao;

    @BeforeEach
    void setUp() {
        equipa = new Equipa();
        equipa.setId(1L);
        equipa.setNome("Sub-15");

        atleta = new Atleta();
        atleta.setId(10L);
        atleta.setNomeCompleto("João Silva");

        sessao = new SessaoTreino();
        sessao.setId(100L);
        sessao.setEquipa(equipa);
        sessao.setData(LocalDate.now());
        sessao.setHoraInicio(LocalTime.of(10, 0));
        sessao.setHoraFim(LocalTime.of(12, 0));
        sessao.setTipo(TipoSessao.TREINO);
        sessao.setEstado(EstadoSessao.PLANEADA);
    }

    @Test
    void testCriarSessaoComSucesso() {
        SessaoTreinoDTO.Request request = new SessaoTreinoDTO.Request(
                1L, LocalDate.now(), LocalTime.of(10, 0), LocalTime.of(12, 0), TipoSessao.TREINO
        );

        when(equipaRepo.findById(1L)).thenReturn(Optional.of(equipa));
        when(sessaoTreinoRepo.save(any(SessaoTreino.class))).thenReturn(sessao);

        SessaoTreinoDTO.Response response = sessaoTreinoService.criarSessao(request);

        assertNotNull(response);
        assertEquals(100L, response.id());
        assertEquals(TipoSessao.TREINO, response.tipo());
        verify(sessaoTreinoRepo, times(1)).save(any(SessaoTreino.class));
    }

    @Test
    void testRegistarChamadaComSucesso() {
        RegistoAssiduidadeDTO.Request regReq = new RegistoAssiduidadeDTO.Request(10L, EstadoAssiduidade.PRESENTE);
        ChamadaDTO.Request request = new ChamadaDTO.Request(List.of(regReq));

        when(sessaoTreinoRepo.findById(100L)).thenReturn(Optional.of(sessao));
        when(atletaRepo.findById(10L)).thenReturn(Optional.of(atleta));
        when(registoAssiduidadeRepo.findBySessaoIdAndAtletaId(100L, 10L)).thenReturn(Optional.empty());
        
        com.sigd.tesouraria.dto.AtletaDTO.Elegibilidade eleg = new com.sigd.tesouraria.dto.AtletaDTO.Elegibilidade(
                10L, "João Silva", "APTO", false, false, false, true);
        when(atletaService.obterElegibilidade(10L)).thenReturn(eleg);

        RegistoAssiduidade registoSalvo = new RegistoAssiduidade();
        registoSalvo.setEstado(EstadoAssiduidade.PRESENTE);
        when(registoAssiduidadeRepo.save(any(RegistoAssiduidade.class))).thenReturn(registoSalvo);

        ChamadaDTO.Response response = sessaoTreinoService.registarChamada(100L, request);

        assertNotNull(response);
        assertEquals(1, response.totalPresentes());
        assertEquals(0, response.totalAusentes());
        assertEquals(EstadoSessao.EM_CURSO, sessao.getEstado());
        verify(sessaoTreinoRepo, times(1)).save(sessao);
    }

    @Test
    void testRegistarChamada_AtletaBloqueadoEmd() {
        RegistoAssiduidadeDTO.Request regReq = new RegistoAssiduidadeDTO.Request(10L, EstadoAssiduidade.PRESENTE);
        ChamadaDTO.Request request = new ChamadaDTO.Request(List.of(regReq));

        when(sessaoTreinoRepo.findById(100L)).thenReturn(Optional.of(sessao));
        when(atletaRepo.findById(10L)).thenReturn(Optional.of(atleta));
        when(registoAssiduidadeRepo.findBySessaoIdAndAtletaId(100L, 10L)).thenReturn(Optional.empty());

        com.sigd.tesouraria.dto.AtletaDTO.Elegibilidade eleg = new com.sigd.tesouraria.dto.AtletaDTO.Elegibilidade(
                10L, "João", "PENDENTE_EMD", true, false, false, false);
        when(atletaService.obterElegibilidade(10L)).thenReturn(eleg);

        assertThrows(IllegalStateException.class, () -> sessaoTreinoService.registarChamada(100L, request));
    }

    @Test
    void testRegistarChamada_AtletaBloqueadoLesao() {
        RegistoAssiduidadeDTO.Request regReq = new RegistoAssiduidadeDTO.Request(10L, EstadoAssiduidade.PRESENTE);
        ChamadaDTO.Request request = new ChamadaDTO.Request(List.of(regReq));

        when(sessaoTreinoRepo.findById(100L)).thenReturn(Optional.of(sessao));
        when(atletaRepo.findById(10L)).thenReturn(Optional.of(atleta));
        when(registoAssiduidadeRepo.findBySessaoIdAndAtletaId(100L, 10L)).thenReturn(Optional.empty());

        com.sigd.tesouraria.dto.AtletaDTO.Elegibilidade eleg = new com.sigd.tesouraria.dto.AtletaDTO.Elegibilidade(
                10L, "João", "INAPTO", false, true, false, false);
        when(atletaService.obterElegibilidade(10L)).thenReturn(eleg);

        assertThrows(IllegalStateException.class, () -> sessaoTreinoService.registarChamada(100L, request));
    }

    @Test
    void testRegistarAvaliacaoForaDaJanela24h_lancaExcecao() {
        // Sessão que terminou há mais de 24h
        sessao.setData(LocalDate.now().minusDays(2));
        sessao.setHoraFim(LocalTime.now());

        AvaliacaoDTO.Request avalReq = new AvaliacaoDTO.Request(10L, new BigDecimal("4.5"));
        AvaliacaoPosSessionDTO.Request request = new AvaliacaoPosSessionDTO.Request(List.of(avalReq));

        when(sessaoTreinoRepo.findById(100L)).thenReturn(Optional.of(sessao));

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            sessaoTreinoService.registarAvaliacoes(100L, request);
        });

        assertTrue(exception.getMessage().contains("O período de 24 horas para submeter avaliações já expirou"));
        verify(avaliacaoRendimentoRepo, never()).save(any());
    }

    @Test
    void testRegistarAvaliacoes_AtletaAusente() {
        AvaliacaoDTO.Request avalReq = new AvaliacaoDTO.Request(10L, new BigDecimal("4.5"));
        AvaliacaoPosSessionDTO.Request request = new AvaliacaoPosSessionDTO.Request(List.of(avalReq));

        when(sessaoTreinoRepo.findById(100L)).thenReturn(Optional.of(sessao));
        when(atletaRepo.findById(10L)).thenReturn(Optional.of(atleta));

        RegistoAssiduidade reg = new RegistoAssiduidade();
        reg.setEstado(EstadoAssiduidade.AUSENTE);
        when(registoAssiduidadeRepo.findBySessaoIdAndAtletaId(100L, 10L)).thenReturn(Optional.of(reg));

        assertThrows(IllegalArgumentException.class, () -> sessaoTreinoService.registarAvaliacoes(100L, request));
    }

    @Test
    void testRegistarAvaliacoes_ComSucesso() {
        AvaliacaoDTO.Request avalReq = new AvaliacaoDTO.Request(10L, new BigDecimal("4.5"));
        AvaliacaoPosSessionDTO.Request request = new AvaliacaoPosSessionDTO.Request(List.of(avalReq));

        when(sessaoTreinoRepo.findById(100L)).thenReturn(Optional.of(sessao));
        when(atletaRepo.findById(10L)).thenReturn(Optional.of(atleta));

        RegistoAssiduidade reg = new RegistoAssiduidade();
        reg.setEstado(EstadoAssiduidade.PRESENTE);
        when(registoAssiduidadeRepo.findBySessaoIdAndAtletaId(100L, 10L)).thenReturn(Optional.of(reg));

        AvaliacaoRendimento avMock = new AvaliacaoRendimento();
        avMock.setNota(new BigDecimal("4.5"));
        avMock.setRegistadoEm(LocalDate.now().atStartOfDay());
        when(avaliacaoRendimentoRepo.save(any(AvaliacaoRendimento.class))).thenReturn(avMock);

        AvaliacaoPosSessionDTO.Response resp = sessaoTreinoService.registarAvaliacoes(100L, request);
        assertEquals(1, resp.totalAvaliados());
        assertEquals(EstadoSessao.CONCLUIDA, sessao.getEstado());
    }

    @Test
    void testListarPorEquipa() {
        when(sessaoTreinoRepo.findByEquipaId(1L)).thenReturn(List.of(sessao));
        List<SessaoTreinoDTO.Response> resp = sessaoTreinoService.listarPorEquipa(1L);
        assertEquals(1, resp.size());
    }

    @Test
    void testObterComSucesso() {
        when(sessaoTreinoRepo.findById(100L)).thenReturn(Optional.of(sessao));
        SessaoTreinoDTO.Response resp = sessaoTreinoService.obter(100L);
        assertNotNull(resp);
        assertEquals(100L, resp.id());
    }

    @Test
    void testObterSessaoNaoEncontrada_lancaExcecao() {
        when(sessaoTreinoRepo.findById(99L)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> sessaoTreinoService.obter(99L));
    }
}
