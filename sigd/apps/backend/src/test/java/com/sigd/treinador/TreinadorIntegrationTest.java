package com.sigd.treinador;

import com.sigd.BaseIntegrationTest;
import com.sigd.core.model.Equipa;
import com.sigd.core.model.EventoDesportivo;
import com.sigd.core.repository.EquipaRepository;
import com.sigd.core.repository.EventoDesportivoRepository;
import com.sigd.core.repository.FichaJogoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TreinadorIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private EventoDesportivoRepository eventoRepository;

    @Autowired
    private EquipaRepository equipaRepository;

    @Autowired
    private FichaJogoRepository fichaJogoRepository;

    @Autowired
    private com.sigd.core.repository.ModalidadeRepository modalidadeRepository;

    @Autowired
    private com.sigd.core.repository.EscalaoRepository escalaoRepository;

    private EventoDesportivo eventoTeste;

    @BeforeEach
    void setUp() {
        fichaJogoRepository.deleteAll();
        eventoRepository.deleteAll();
        equipaRepository.deleteAll();
        escalaoRepository.deleteAll();
        modalidadeRepository.deleteAll();

        com.sigd.core.model.Modalidade modalidade = new com.sigd.core.model.Modalidade();
        modalidade.setNome("Futebol");
        modalidade = modalidadeRepository.save(modalidade);

        com.sigd.core.model.Escalao escalao = new com.sigd.core.model.Escalao();
        escalao.setDesignacao("Seniores");
        escalao.setModalidade(modalidade);
        escalao = escalaoRepository.save(escalao);

        Equipa equipa = new Equipa();
        equipa.setNome("Seniores A");
        equipa.setEscalao(escalao);
        equipa.setModalidade(modalidade);
        equipa.setAtiva(true);
        equipa = equipaRepository.save(equipa);

        eventoTeste = new EventoDesportivo();
        eventoTeste.setEquipa(equipa);
        eventoTeste.setTipo(com.sigd.core.model.TipoEvento.JOGO_OFICIAL);
        eventoTeste.setData(LocalDate.now());
        eventoTeste.setHoraInicio(LocalTime.of(15, 0));
        eventoTeste.setAdversario("Equipa B");
        eventoTeste.setLocal("Estádio");
        eventoTeste.setEstado(com.sigd.core.model.EstadoEvento.AGENDADO);
        eventoTeste = eventoRepository.save(eventoTeste);
    }

    @Test
    @WithMockUser(username = "treinador", roles = {"TREINADOR"})
    void submeter_ficha_jogo_deve_retornar_201() throws Exception {
        String body = """
                {
                    "eventoId": %d,
                    "golosMarcados": 2,
                    "golosSofridos": 1,
                    "observacoes": "Boa vitória"
                }
                """.formatted(eventoTeste.getId());

        mockMvc.perform(post("/api/v1/treinador/eventos/{id}/ficha-jogo", eventoTeste.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultado").value("VITORIA"));

        assertThat(fichaJogoRepository.findByEventoId(eventoTeste.getId())).isPresent();
    }

    @Test
    @WithMockUser(username = "treinador", roles = {"TREINADOR"})
    void submeter_ficha_jogo_duplicada_deve_retornar_409() throws Exception {
        String body = """
                {
                    "eventoId": %d,
                    "golosMarcados": 2,
                    "golosSofridos": 1,
                    "observacoes": "Boa vitória"
                }
                """.formatted(eventoTeste.getId());

        // Primeira submissão
        mockMvc.perform(post("/api/v1/treinador/eventos/{id}/ficha-jogo", eventoTeste.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated());

        // Segunda submissão
        mockMvc.perform(post("/api/v1/treinador/eventos/{id}/ficha-jogo", eventoTeste.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict());
    }

    @Test
    @WithAnonymousUser
    void submeter_ficha_jogo_sem_token_deve_retornar_401() throws Exception {
        String body = """
                {
                    "eventoId": %d,
                    "golosMarcados": 2,
                    "golosSofridos": 1,
                    "observacoes": "Boa vitória"
                }
                """.formatted(eventoTeste.getId());

        mockMvc.perform(post("/api/v1/treinador/eventos/{id}/ficha-jogo", eventoTeste.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "medico", roles = {"MEDICO"})
    void submeter_ficha_com_role_errado_deve_retornar_403() throws Exception {
        String body = """
                {
                    "eventoId": %d,
                    "golosMarcados": 2,
                    "golosSofridos": 1,
                    "observacoes": "Boa vitória"
                }
                """.formatted(eventoTeste.getId());

        mockMvc.perform(post("/api/v1/treinador/eventos/{id}/ficha-jogo", eventoTeste.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "treinador", roles = {"TREINADOR"})
    void submeter_ficha_evento_inexistente_deve_retornar_404() throws Exception {
        String body = """
                {
                    "eventoId": 99999,
                    "golosMarcados": 2,
                    "golosSofridos": 1,
                    "observacoes": "Boa vitória"
                }
                """;

        mockMvc.perform(post("/api/v1/treinador/eventos/99999/ficha-jogo")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "treinador", roles = {"TREINADOR"})
    void submeter_ficha_com_golos_negativos_deve_retornar_400() throws Exception {
        String body = """
                {
                    "eventoId": %d,
                    "golosMarcados": -1,
                    "golosSofridos": 0,
                    "observacoes": ""
                }
                """.formatted(eventoTeste.getId());

        mockMvc.perform(post("/api/v1/treinador/eventos/{id}/ficha-jogo", eventoTeste.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }
}
