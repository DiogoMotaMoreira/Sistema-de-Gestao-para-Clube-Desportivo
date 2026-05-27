package com.sigd.dt;

import com.sigd.treinador.controller.AtletaEstatisticasController;
import com.sigd.treinador.controller.EventoDesportivoController;
import com.sigd.treinador.dto.EventoDesportivoDTO;
import com.sigd.treinador.service.EventoDesportivoService;
import com.sigd.treinador.service.FichaJogoService;
import com.sigd.treinador.service.PdfConvocatoriaService;
import com.sigd.core.repository.RegistoAssiduidadeRepository;
import com.sigd.core.repository.AvaliacaoRendimentoRepository;
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
    private AvaliacaoRendimentoRepository avaliacaoRendimentoRepository;

    @InjectMocks
    private EventoDesportivoController eventoController;

    @InjectMocks
    private AtletaEstatisticasController estatisticasController;

    @BeforeEach
    void setUp() {
    }

    // GRUPO 1 — Calendário Global
    @Test
    void deve_retornar_eventos_de_todas_as_equipas() {
        Assertions.fail("BUG: Não existe endpoint nem implementação para listar o calendário global de todas as equipas (RF-14).");
    }

    @Test
    void deve_contar_treinos_e_jogos_separadamente() {
        Assertions.fail("BUG: Não existe endpoint nem implementação para o Calendário Global separar contagens de treinos e jogos.");
    }

    @Test
    void deve_retornar_lista_vazia_quando_sem_eventos() {
        Assertions.fail("BUG: Não existe endpoint nem implementação para o Calendário Global.");
    }

    // GRUPO 2 — Análise de Rendimento
    @Test
    void deve_retornar_jogos_por_equipa() {
        Assertions.fail("BUG: Análise de Rendimento global do DT (UC-12.4) não está implementada em nenhum Controller/Service.");
    }

    @Test
    void deve_calcular_vitorias_empates_derrotas_por_equipa() {
        Assertions.fail("BUG: Cálculo de V/E/D por equipa para o DT não está implementado.");
    }

    @Test
    void deve_retornar_zero_quando_equipa_sem_jogos() {
        Assertions.fail("BUG: Análise de Rendimento global do DT (UC-12.4) não está implementada em nenhum Controller/Service.");
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
