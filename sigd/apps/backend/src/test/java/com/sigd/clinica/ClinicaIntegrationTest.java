package com.sigd.clinica;

import com.sigd.BaseIntegrationTest;
import com.sigd.clinica.dto.AltaMedicaDTO;
import com.sigd.clinica.dto.OcorrenciaDTO;
import com.sigd.core.model.*;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.EncarregadoEducacaoRepository;
import com.sigd.core.repository.EquipaRepository;
import com.sigd.core.repository.EscalaoRepository;
import com.sigd.core.repository.ModalidadeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ClinicaIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private AtletaRepository atletaRepository;

    @Autowired
    private EncarregadoEducacaoRepository encarregadoRepository;

    @Autowired
    private EquipaRepository equipaRepository;

    @Autowired
    private EscalaoRepository escalaoRepository;

    @Autowired
    private ModalidadeRepository modalidadeRepository;

    private Long atletaId;

    @BeforeEach
    void setup() {
        seedUserIfNotExists("medico1", "ROLE_MEDICO");
        seedUserIfNotExists("medico2", "ROLE_MEDICO");
        seedUserIfNotExists("medico3", "ROLE_MEDICO");
        seedUserIfNotExists("medico4", "ROLE_MEDICO");
        seedUserIfNotExists("medico5", "ROLE_MEDICO");
        seedUserIfNotExists("medico", "ROLE_MEDICO");
        seedUserIfNotExists("treinador1", "ROLE_TREINADOR");

        if (atletaRepository.count() == 0) {
            EncarregadoEducacao ee = new EncarregadoEducacao();
            ee.setNome("Pai Teste");
            ee.setNif("987654321");
            ee.setEmail("pai@teste.com");
            encarregadoRepository.save(ee);

            Modalidade mod = new Modalidade();
            mod.setNome("Futebol");
            modalidadeRepository.save(mod);

            Escalao esc = new Escalao();
            esc.setDesignacao("Sub-19");
            esc.setModalidade(mod);
            escalaoRepository.save(esc);

            Equipa equipa = new Equipa();
            equipa.setNome("Sub-19");
            equipa.setAtiva(true);
            equipa.setEscalao(esc);
            equipa.setModalidade(mod);
            equipaRepository.save(equipa);

            Atleta atleta = new Atleta();
            atleta.setNomeCompleto("Atleta Teste");
            atleta.setDataNascimento(LocalDate.of(2005, 1, 1));
            atleta.setEstadoElegibilidade(EstadoElegibilidade.APTO);
            atleta.setEncarregado(ee);
            atleta.setEquipa(equipa);
            atleta = atletaRepository.save(atleta);
            atletaId = atleta.getId();
        } else {
            atletaId = atletaRepository.findAll().get(0).getId();
        }
    }

    private void seedUserIfNotExists(String username, String role) {
        if (!utilizadorRepository.findByUsername(username).isPresent()) {
            Utilizador u = new Utilizador();
            u.setUsername(username);
            u.setEmail(username + "@teste.com");
            u.setPasswordHash("hashed_password");
            u.setRole(role);
            u.setAtivo(true);
            u.setTentativasFalhadas(0);
            u.setCriadoEm(java.time.LocalDateTime.now());
            u.setAtualizadoEm(java.time.LocalDateTime.now());
            utilizadorRepository.save(u);
        }
    }

    // ==========================================
    // GRUPO 1 — Ocorrências (RF-16, UC-09.1)
    // ==========================================

    @Test
    @DisplayName("Criar ocorrência deve retornar 201 e persistir")
    @WithMockUser(username = "medico1", roles = {"MEDICO"})
    void criar_ocorrencia_deve_retornar_201_e_persistir() throws Exception {
        OcorrenciaDTO.Request req = new OcorrenciaDTO.Request(
                atletaId,
                LocalDate.now(),
                TipoOcorrencia.LESAO,
                "Entorse",
                GrauRestricaoDesportiva.AMARELO,
                null
        );

        mockMvc.perform(post("/api/v1/clinica/ocorrencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    @DisplayName("Criar ocorrência sem token deve retornar 401")
    @WithAnonymousUser
    void criar_ocorrencia_sem_token_deve_retornar_401() throws Exception {
        OcorrenciaDTO.Request req = new OcorrenciaDTO.Request(
                atletaId,
                LocalDate.now(),
                TipoOcorrencia.LESAO,
                "Entorse",
                GrauRestricaoDesportiva.AMARELO,
                null
        );

        mockMvc.perform(post("/api/v1/clinica/ocorrencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Criar ocorrência com role errado deve retornar 403")
    @WithMockUser(username = "treinador1", roles = {"TREINADOR"})
    void criar_ocorrencia_com_role_errado_deve_retornar_403() throws Exception {
        OcorrenciaDTO.Request req = new OcorrenciaDTO.Request(
                atletaId,
                LocalDate.now(),
                TipoOcorrencia.LESAO,
                "Entorse",
                GrauRestricaoDesportiva.AMARELO,
                null
        );

        mockMvc.perform(post("/api/v1/clinica/ocorrencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Criar ocorrência com atleta inexistente deve retornar 4xx")
    @WithMockUser(username = "medico2", roles = {"MEDICO"})
    void criar_ocorrencia_com_atleta_inexistente_deve_retornar_404_ou_400() throws Exception {
        OcorrenciaDTO.Request req = new OcorrenciaDTO.Request(
                99999L,
                LocalDate.now(),
                TipoOcorrencia.LESAO,
                "Entorse",
                GrauRestricaoDesportiva.AMARELO,
                null
        );

        mockMvc.perform(post("/api/v1/clinica/ocorrencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @DisplayName("Criar segunda ocorrência para atleta com ocorrência ativa deve retornar 409")
    @WithMockUser(username = "medico3", roles = {"MEDICO"})
    void criar_segunda_ocorrencia_para_atleta_com_ocorrencia_ativa_deve_retornar_409() throws Exception {
        // Cria a primeira ocorrência
        OcorrenciaDTO.Request req1 = new OcorrenciaDTO.Request(
                atletaId,
                LocalDate.now(),
                TipoOcorrencia.LESAO,
                "Entorse Tornozelo",
                GrauRestricaoDesportiva.AMARELO,
                null
        );

        mockMvc.perform(post("/api/v1/clinica/ocorrencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req1)));

        // Tenta criar a segunda ocorrência
        OcorrenciaDTO.Request req2 = new OcorrenciaDTO.Request(
                atletaId,
                LocalDate.now(),
                TipoOcorrencia.DOENCA,
                "Gripe",
                GrauRestricaoDesportiva.VERMELHO,
                null
        );

        mockMvc.perform(post("/api/v1/clinica/ocorrencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isConflict());
    }

    // ==========================================
    // GRUPO 2 — Alta médica (RF-18, UC-09.4)
    // ==========================================

    @Test
    @DisplayName("Emitir alta deve retornar 200 e mudar estado para RESOLVIDA")
    @WithMockUser(username = "medico4", roles = {"MEDICO"})
    void emitir_alta_deve_retornar_200_e_mudar_estado_para_RESOLVIDA() throws Exception {
        // Atleta 2 para não haver conflitos
        Atleta atleta2 = new Atleta();
        atleta2.setNomeCompleto("Atleta 2");
        atleta2.setDataNascimento(LocalDate.of(2005, 2, 2));
        atleta2.setEstadoElegibilidade(EstadoElegibilidade.APTO);
        // Atleta precisa de encarregado também!
        EncarregadoEducacao ee2 = new EncarregadoEducacao();
        ee2.setNome("Pai Teste 2");
        ee2.setNif("987654322");
        ee2.setEmail("pai2@teste.com");
        ee2 = encarregadoRepository.save(ee2);
        atleta2.setEncarregado(ee2);
        atleta2 = atletaRepository.save(atleta2);

        OcorrenciaDTO.Request req = new OcorrenciaDTO.Request(
                atleta2.getId(),
                LocalDate.now(),
                TipoOcorrencia.LESAO,
                "Entorse",
                GrauRestricaoDesportiva.AMARELO,
                null
        );

        String responseJson = mockMvc.perform(post("/api/v1/clinica/ocorrencias")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        OcorrenciaDTO.Response created = objectMapper.readValue(responseJson, OcorrenciaDTO.Response.class);
        Long ocorrenciaId = created.id();

        AltaMedicaDTO altaDTO = new AltaMedicaDTO(
                "Recuperação total.",
                LocalDate.now()
        );

        mockMvc.perform(post("/api/v1/clinica/ocorrencias/" + ocorrenciaId + "/alta")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(altaDTO)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/clinica/ocorrencias/" + ocorrenciaId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("RESOLVIDA"));
    }

    @Test
    @DisplayName("Emitir alta em ocorrência inexistente deve retornar 404")
    @WithMockUser(username = "medico5", roles = {"MEDICO"})
    void emitir_alta_em_ocorrencia_inexistente_deve_retornar_404() throws Exception {
        AltaMedicaDTO altaDTO = new AltaMedicaDTO(
                "Recuperação total.",
                LocalDate.now()
        );

        mockMvc.perform(post("/api/v1/clinica/ocorrencias/99999/alta")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(altaDTO)))
                .andExpect(status().isNotFound());
    }
}
