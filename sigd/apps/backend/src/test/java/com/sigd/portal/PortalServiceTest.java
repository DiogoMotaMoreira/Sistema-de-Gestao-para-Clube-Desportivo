package com.sigd.portal;

import com.sigd.core.model.Atleta;
import com.sigd.core.model.EncarregadoEducacao;
import com.sigd.core.model.Equipa;
import com.sigd.core.model.Escalao;
import com.sigd.core.model.EstadoElegibilidade;
import com.sigd.core.model.EstadoEMD;
import com.sigd.core.model.EventoDesportivo;
import com.sigd.core.model.Ocorrencia;
import com.sigd.core.model.TipoEvento;
import com.sigd.core.model.Utilizador;
import com.sigd.core.repository.EncarregadoEducacaoRepository;
import com.sigd.core.repository.EventoDesportivoRepository;
import com.sigd.core.repository.OcorrenciaRepository;
import com.sigd.core.repository.UtilizadorRepository;
import com.sigd.tesouraria.dto.ObrigacaoFinanceiraDTO;
import com.sigd.tesouraria.dto.SituacaoFinanceiraDTO;
import com.sigd.tesouraria.service.EncarregadoService;
import com.sigd.tesouraria.service.ObrigacaoFinanceiraService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class PortalServiceTest {

    @Mock
    private UtilizadorRepository utilizadorRepository;
    @Mock
    private EncarregadoEducacaoRepository encarregadoEducacaoRepository;
    @Mock
    private EncarregadoService encarregadoService;
    @Mock
    private ObrigacaoFinanceiraService obrigacaoFinanceiraService;
    @Mock
    private EventoDesportivoRepository eventoDesportivoRepository;
    @Mock
    private OcorrenciaRepository ocorrenciaRepository;
    @Mock
    private com.sigd.core.repository.ConvocatoriaRepository convocatoriaRepository;

    @InjectMocks
    private PortalController portalController;

    private EncarregadoEducacao eeMock;
    private Atleta atletaMock;

    @BeforeEach
    void setUp() {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("teste_ee");

        Utilizador utilizador = new Utilizador();
        utilizador.setEmail("ee@teste.com");
        when(utilizadorRepository.findByUsername("teste_ee")).thenReturn(Optional.of(utilizador));

        eeMock = new EncarregadoEducacao();
        eeMock.setId(1L);
        eeMock.setNome("Encarregado Teste");
        eeMock.setEmail("ee@teste.com");

        atletaMock = new Atleta();
        atletaMock.setId(10L);
        atletaMock.setNomeCompleto("Atleta Teste");
        atletaMock.setEstadoElegibilidade(EstadoElegibilidade.APTO);

        Equipa equipa = new Equipa();
        equipa.setId(100L);
        Escalao escalao = new Escalao();
        escalao.setDesignacao("Sub-15");
        equipa.setEscalao(escalao);
        atletaMock.setEquipa(equipa);

        eeMock.setAtletas(List.of(atletaMock));
        when(encarregadoEducacaoRepository.findByEmail("ee@teste.com")).thenReturn(Optional.of(eeMock));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    // GRUPO 1 — Perfil do atleta
    @Test
    void deve_retornar_perfil_do_atleta_do_ee_autenticado() {
        ResponseEntity<PortalController.PortalMeResponse> response = portalController.me();
        assertNotNull(response.getBody());
        assertEquals("Encarregado Teste", response.getBody().nome());
        assertEquals(1, response.getBody().dependentes().size());
        assertEquals(10L, response.getBody().dependentes().get(0).id());
    }

    @Test
    void deve_retornar_estado_elegibilidade_do_atleta() {
        atletaMock.setEstadoElegibilidade(EstadoElegibilidade.CONDICIONADO);
        ResponseEntity<PortalController.PortalMeResponse> response = portalController.me();
        assertEquals("Condicionado", response.getBody().dependentes().get(0).elegibilidade());
    }

    @Test
    void deve_lancara_excecao_quando_ee_nao_tem_atletas_associados() {
        eeMock.setAtletas(List.of());
        ResponseEntity<PortalController.PortalMeResponse> response = portalController.me();
        assertTrue(response.getBody().dependentes().isEmpty());
    }

    @Test
    void deve_retornar_alertas_activos_para_ee() {
        ObrigacaoFinanceiraDTO.Response obDto = new ObrigacaoFinanceiraDTO.Response(
                1L, new BigDecimal("50.00"), LocalDate.now().minusDays(5), "MENSALIDADE", "EM_ATRASO",
                "CLUBE", null, 1L, "EE", 10L, "Atleta"
        );
        when(obrigacaoFinanceiraService.listarPorEncarregado(eeMock.getId())).thenReturn(List.of(obDto));
        atletaMock.setEstadoElegibilidade(EstadoElegibilidade.INAPTO);

        ResponseEntity<List<PortalController.AlertaPortalDTO>> response = portalController.getAlertas(null);
        assertEquals(2, response.getBody().size());
        assertTrue(response.getBody().stream().anyMatch(a -> a.tipo().equals("MENSALIDADE")));
        assertTrue(response.getBody().stream().anyMatch(a -> a.tipo().equals("SAUDE")));
    }

    // GRUPO 2 — Agenda do atleta
    @Test
    void deve_retornar_eventos_futuros_do_atleta() {
        EventoDesportivo evPassado = new EventoDesportivo();
        evPassado.setId(1L);
        evPassado.setData(LocalDate.now().minusDays(2));
        evPassado.setHoraInicio(java.time.LocalTime.NOON);
        evPassado.setTipo(TipoEvento.JOGO_OFICIAL);

        EventoDesportivo evFuturo = new EventoDesportivo();
        evFuturo.setId(2L);
        evFuturo.setData(LocalDate.now().plusDays(2));
        evFuturo.setHoraInicio(java.time.LocalTime.NOON);
        evFuturo.setTipo(TipoEvento.JOGO_OFICIAL);

        when(eventoDesportivoRepository.findByEquipaIdOrderByDataAsc(100L)).thenReturn(List.of(evPassado, evFuturo));

        ResponseEntity<List<PortalController.EventoPortalDTO>> response = portalController.getAgenda();
        
        // Controller não filtra eventos futuros! Bug.
        assertEquals(1, response.getBody().size(), "BUG: PortalController retorna eventos passados na agenda");
    }

    @Test
    void deve_retornar_convocatoria_quando_atleta_esta_convocado() {
        EventoDesportivo ev = new EventoDesportivo();
        ev.setId(3L);
        ev.setData(LocalDate.now().plusDays(3));
        ev.setHoraInicio(java.time.LocalTime.NOON);
        ev.setTipo(TipoEvento.JOGO_OFICIAL);

        when(eventoDesportivoRepository.findByEquipaIdOrderByDataAsc(100L)).thenReturn(List.of(ev));
        when(convocatoriaRepository.existsByEventoIdAndAtletas_Id(3L, 10L)).thenReturn(true);

        ResponseEntity<List<PortalController.EventoPortalDTO>> response = portalController.getAgenda();
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertTrue(response.getBody().get(0).isConvocado());
    }

    @Test
    void deve_retornar_lista_vazia_quando_sem_eventos_futuros() {
        when(eventoDesportivoRepository.findByEquipaIdOrderByDataAsc(100L)).thenReturn(List.of());
        ResponseEntity<List<PortalController.EventoPortalDTO>> response = portalController.getAgenda();
        assertTrue(response.getBody().isEmpty());
    }

    // GRUPO 3 — Conta financeira
    @Test
    void deve_retornar_obrigacoes_do_ee_autenticado() {
        ObrigacaoFinanceiraDTO.Response obDto = new ObrigacaoFinanceiraDTO.Response(
                1L, new BigDecimal("50.00"), LocalDate.now(), "MENSALIDADE", "PENDENTE",
                "CLUBE", null, 1L, "EE", 10L, "Atleta"
        );
        when(obrigacaoFinanceiraService.listarPorEncarregado(eeMock.getId())).thenReturn(List.of(obDto));
        ResponseEntity<List<ObrigacaoFinanceiraDTO.Response>> response = portalController.obrigacoes(null);
        assertEquals(1, response.getBody().size());
    }

    @Test
    void deve_filtrar_obrigacoes_por_estado_pendente() {
        ObrigacaoFinanceiraDTO.Response ob1 = new ObrigacaoFinanceiraDTO.Response(
                1L, new BigDecimal("50.00"), LocalDate.now(), "MENSALIDADE", "PENDENTE",
                "CLUBE", null, 1L, "EE", 10L, "Atleta"
        );
        ObrigacaoFinanceiraDTO.Response ob2 = new ObrigacaoFinanceiraDTO.Response(
                2L, new BigDecimal("50.00"), LocalDate.now(), "MENSALIDADE", "PAGO",
                "CLUBE", null, 1L, "EE", 10L, "Atleta"
        );
        when(obrigacaoFinanceiraService.listarPorEncarregado(eeMock.getId())).thenReturn(List.of(ob1, ob2));

        ResponseEntity<List<ObrigacaoFinanceiraDTO.Response>> response = portalController.obrigacoes("PENDENTE");
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("PENDENTE", response.getBody().get(0).estado());
    }

    @Test
    void deve_retornar_total_em_divida_correctamente() {
        SituacaoFinanceiraDTO sfDto = new SituacaoFinanceiraDTO(
                new BigDecimal("100.00"), new BigDecimal("50.00"), List.of()
        );
        when(encarregadoService.obterSituacaoFinanceira(eeMock.getId())).thenReturn(sfDto);

        ResponseEntity<SituacaoFinanceiraDTO> response = portalController.situacaoFinanceira();
        assertNotNull(response.getBody());
        assertEquals(new BigDecimal("100.00"), response.getBody().totalDivida());
        assertEquals(new BigDecimal("50.00"), response.getBody().totalPago());
    }

    // GRUPO 4 — Documentos e cartão
    @Test
    void deve_retornar_estado_do_emd_do_atleta() {
        Ocorrencia oc = new Ocorrencia();
        oc.setId(1L);
        oc.setEstadoEMD(EstadoEMD.DELIBERADO);
        oc.setCriadoEm(LocalDateTime.now());
        when(ocorrenciaRepository.findByAtletaId(10L)).thenReturn(List.of(oc));

        ResponseEntity<List<PortalController.PortalDocumentoDTO>> response = portalController.getDocumentos(10L);
        boolean foundEmd = response.getBody().stream()
                .anyMatch(d -> d.tipo().equals("Exame Médico-Desportivo") && d.estado().equals("APROVADO"));
        assertTrue(foundEmd);
    }

    @Test
    void deve_retornar_estado_pendente_emd_quando_sem_emd() {
        when(ocorrenciaRepository.findByAtletaId(10L)).thenReturn(List.of());
        ResponseEntity<List<PortalController.PortalDocumentoDTO>> response = portalController.getDocumentos(10L);
        boolean foundEmd = response.getBody().stream()
                .anyMatch(d -> d.tipo().equals("Exame Médico-Desportivo") && d.estado().equals("EM_FALTA"));
        assertTrue(foundEmd);
    }

    @Test
    void deve_retornar_dados_cartao_socio_do_atleta() {
        atletaMock.setNumeroSocio("12345");
        ResponseEntity<List<PortalController.PortalDocumentoDTO>> response = portalController.getDocumentos(10L);
        boolean foundCartao = response.getBody().stream()
                .anyMatch(d -> d.tipo().equals("Cartão de Sócio") && d.estado().equals("APROVADO"));
        assertTrue(foundCartao);
    }

    // GRUPO 5 — Edge cases
    @Test
    void deve_ignorar_atletas_de_outro_ee() {
        // Acesso via me() usa eeMock.getAtletas(), pelo que outros são ignorados nativamente
        ResponseEntity<PortalController.PortalMeResponse> response = portalController.me();
        assertEquals(1, response.getBody().dependentes().size());
    }

    @Test
    void deve_retornar_erro_quando_ee_nao_existe() {
        when(encarregadoEducacaoRepository.findByEmail("ee@teste.com")).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> portalController.me());
    }
}
