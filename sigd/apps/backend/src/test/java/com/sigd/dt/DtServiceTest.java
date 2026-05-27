package com.sigd.dt;

import com.sigd.dt.controller.DtController;
import com.sigd.treinador.controller.AtletaEstatisticasController;
import com.sigd.treinador.controller.EventoDesportivoController;
import com.sigd.treinador.dto.EventoDesportivoDTO;
import com.sigd.treinador.service.EventoDesportivoService;
import com.sigd.treinador.service.FichaJogoService;
import com.sigd.treinador.service.PdfConvocatoriaService;
import com.sigd.core.repository.RegistoAssiduidadeRepository;
import com.sigd.core.repository.AvaliacaoRendimentoRepository;
import com.sigd.core.repository.EquipaRepository;
import com.sigd.core.repository.EventoDesportivoRepository;
import com.sigd.core.repository.SessaoTreinoRepository;
import com.sigd.core.repository.FichaJogoRepository;
import com.sigd.core.model.Equipa;
import com.sigd.core.model.EventoDesportivo;
import com.sigd.core.model.SessaoTreino;
import com.sigd.core.model.FichaJogo;
import com.sigd.core.model.ResultadoJogo;
import com.sigd.core.model.EstadoEvento;
import com.sigd.core.model.TipoEvento;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class DtServiceTest {

    @Mock
    private EventoDesportivoService eventoService;
    @Mock
    private PdfConvocatoriaService pdfConvocatoriaService;
    @Mock
    private FichaJogoService fichaJogoService;
    @Mock
    private RegistoAssiduidadeRepository registoAssiduidadeRepository;
    @Mock
    private AvaliacaoRendimentoRepository java_avaliacaoRendimentoRepository;

    @Mock
    private EquipaRepository equipaRepo;
    @Mock
    private EventoDesportivoRepository eventoRepo;
    @Mock
    private SessaoTreinoRepository sessaoTreinoRepo;
    @Mock
    private FichaJogoRepository fichaJogoRepo;

    @InjectMocks
    private EventoDesportivoController eventoController;

    @InjectMocks
    private AtletaEstatisticasController estatisticasController;

    @InjectMocks
    private DtController dtController;

    @BeforeEach
    void setUp() {
    }

    // GRUPO 1 — Calendário Global
    @Test
    void deve_retornar_eventos_de_todas_as_equipas() {
        Equipa eq = new Equipa();
        eq.setId(1L);
        eq.setNome("Sub-15");
        when(equipaRepo.findAll()).thenReturn(List.of(eq));
        when(eventoRepo.findAll()).thenReturn(List.of());
        when(sessaoTreinoRepo.findAll()).thenReturn(List.of());

        ResponseEntity<List<DtController.CalendarioGlobalDTO>> response = dtController.getCalendarioGlobal();
        assertEquals(1, response.getBody().size());
        assertEquals("Sub-15", response.getBody().get(0).equipaNome());
    }

    @Test
    void deve_contar_treinos_e_jogos_separadamente() {
        Equipa eq = new Equipa();
        eq.setId(1L);
        eq.setNome("Sub-15");
        when(equipaRepo.findAll()).thenReturn(List.of(eq));

        EventoDesportivo ev = new EventoDesportivo();
        ev.setEquipa(eq);
        ev.setData(java.time.LocalDate.now());
        when(eventoRepo.findAll()).thenReturn(List.of(ev));

        SessaoTreino tr = new SessaoTreino();
        tr.setEquipa(eq);
        tr.setData(java.time.LocalDate.now());
        when(sessaoTreinoRepo.findAll()).thenReturn(List.of(tr));

        ResponseEntity<List<DtController.CalendarioGlobalDTO>> response = dtController.getCalendarioGlobal();
        assertEquals(1, response.getBody().get(0).totalTreinos());
        assertEquals(1, response.getBody().get(0).totalJogos());
    }

    @Test
    void deve_retornar_lista_vazia_quando_sem_eventos() {
        when(equipaRepo.findAll()).thenReturn(List.of());
        ResponseEntity<List<DtController.CalendarioGlobalDTO>> response = dtController.getCalendarioGlobal();
        assertEquals(0, response.getBody().size());
    }

    // GRUPO 2 — Análise de Rendimento
    @Test
    void deve_retornar_jogos_por_equipa() {
        Equipa eq = new Equipa();
        eq.setId(1L);
        eq.setNome("Sub-15");
        when(equipaRepo.findById(1L)).thenReturn(Optional.of(eq));

        EventoDesportivo ev = new EventoDesportivo();
        ev.setEquipa(eq);
        ev.setEstado(EstadoEvento.CONCLUIDO);
        when(eventoRepo.findAll()).thenReturn(List.of(ev));

        ResponseEntity<DtController.RendimentoEquipaDTO> response = dtController.getRendimento(1L);
        assertEquals(1, response.getBody().totalJogosConcluidos());
    }

    @Test
    void deve_calcular_vitorias_empates_derrotas_por_equipa() {
        Equipa eq = new Equipa();
        eq.setId(1L);
        eq.setNome("Sub-15");
        when(equipaRepo.findById(1L)).thenReturn(Optional.of(eq));

        EventoDesportivo ev = new EventoDesportivo();
        ev.setId(1L);
        ev.setEquipa(eq);
        ev.setEstado(EstadoEvento.CONCLUIDO);
        when(eventoRepo.findAll()).thenReturn(List.of(ev));

        FichaJogo f = new FichaJogo();
        f.setResultado(ResultadoJogo.VITORIA);
        f.setGolosMarcados(3);
        when(fichaJogoRepo.findByEventoId(1L)).thenReturn(Optional.of(f));

        ResponseEntity<DtController.RendimentoEquipaDTO> response = dtController.getRendimento(1L);
        assertEquals(1, response.getBody().vitorias());
        assertEquals(100.0, response.getBody().winRate());
        assertEquals(3.0, response.getBody().mediaGolosPorJogo());
    }

    @Test
    void deve_retornar_zero_quando_equipa_sem_jogos() {
        Equipa eq = new Equipa();
        eq.setId(1L);
        eq.setNome("Sub-15");
        when(equipaRepo.findById(1L)).thenReturn(Optional.of(eq));
        when(eventoRepo.findAll()).thenReturn(List.of());

        ResponseEntity<DtController.RendimentoEquipaDTO> response = dtController.getRendimento(1L);
        assertEquals(0, response.getBody().totalJogosConcluidos());
        assertEquals(0.0, response.getBody().winRate());
    }

    // GRUPO 3 — Gestão de Eventos
    @Test
    void deve_criar_evento_desportivo_com_sucesso() {
        EventoDesportivoDTO.Request req = new EventoDesportivoDTO.Request(1L, com.sigd.core.model.TipoEvento.JOGO_OFICIAL, java.time.LocalDate.now(), java.time.LocalTime.now(), "Equipa B", "Casa");
        EventoDesportivoDTO.Response res = new EventoDesportivoDTO.Response(1L, 1L, "Equipa A", com.sigd.core.model.TipoEvento.JOGO_OFICIAL, java.time.LocalDate.now(), java.time.LocalTime.now(), "Equipa B", "Casa", com.sigd.core.model.EstadoEvento.AGENDADO, false, null);
        
        when(eventoService.criarEvento(any(EventoDesportivoDTO.Request.class))).thenReturn(res);

        ResponseEntity<EventoDesportivoDTO.Response> response = eventoController.criarEvento(req);
        assertEquals(201, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().id());
    }

    @Test
    void deve_lancara_excecao_quando_equipa_nao_existe() {
        EventoDesportivoDTO.Request req = new EventoDesportivoDTO.Request(99L, com.sigd.core.model.TipoEvento.JOGO_OFICIAL, java.time.LocalDate.now(), java.time.LocalTime.now(), "Equipa B", "Casa");
        when(eventoService.criarEvento(req)).thenThrow(new IllegalArgumentException("Equipa não encontrada"));

        IllegalArgumentException ex = Assertions.assertThrows(IllegalArgumentException.class, () -> {
            eventoController.criarEvento(req);
        });
        assertEquals("Equipa não encontrada", ex.getMessage());
    }
}
