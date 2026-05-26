package com.sigd.admin;

import com.sigd.BaseIntegrationTest;
import com.sigd.core.model.Utilizador;
import com.sigd.core.repository.UtilizadorRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import org.springframework.security.test.context.support.WithMockUser;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

public class AdminIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private UtilizadorRepository utilizadorRepository;

    @Test
    @WithMockUser(username = "admin1", roles = {"ADMIN"})
    void consultar_audit_log_com_role_admin_deve_retornar_200() throws Exception {
        mockMvc.perform(get("/api/v1/admin/audit-log"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "treinador1", roles = {"TREINADOR"})
    void consultar_audit_log_sem_role_admin_deve_retornar_403() throws Exception {
        mockMvc.perform(get("/api/v1/admin/audit-log"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin1", roles = {"ADMIN"})
    void consultar_audit_log_com_filtro_ator_deve_filtrar() throws Exception {
        mockMvc.perform(get("/api/v1/admin/audit-log?search=admin"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin1", roles = {"ADMIN"})
    void bloquear_utilizador_deve_retornar_200_e_ativo_false() throws Exception {
        Utilizador alvo = new Utilizador();
        alvo.setUsername("alvo_bloqueio");
        alvo.setEmail("alvo_bloqueio@test.com");
        alvo.setPasswordHash("dummy");
        alvo.setRole("ROLE_TREINADOR");
        alvo.setAtivo(true);
        alvo = utilizadorRepository.save(alvo);

        mockMvc.perform(put("/api/v1/admin/utilizadores/{id}/bloquear", alvo.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(false));

        Utilizador guardado = utilizadorRepository.findById(alvo.getId()).orElseThrow();
        assertThat(guardado.getAtivo()).isFalse();
    }

    @Test
    @WithMockUser(username = "admin1", roles = {"ADMIN"})
    void reativar_utilizador_deve_retornar_200_e_ativo_true() throws Exception {
        Utilizador alvo = new Utilizador();
        alvo.setUsername("alvo_reativar");
        alvo.setEmail("alvo_reativar@test.com");
        alvo.setPasswordHash("dummy");
        alvo.setRole("ROLE_TREINADOR");
        alvo.setAtivo(false);
        alvo = utilizadorRepository.save(alvo);

        mockMvc.perform(put("/api/v1/admin/utilizadores/{id}/reativar", alvo.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(true));

        Utilizador guardado = utilizadorRepository.findById(alvo.getId()).orElseThrow();
        assertThat(guardado.getAtivo()).isTrue();
    }

    @Test
    @WithMockUser(username = "secretaria1", roles = {"SECRETARIA"})
    void bloquear_utilizador_sem_role_admin_deve_retornar_403() throws Exception {
        mockMvc.perform(put("/api/v1/admin/utilizadores/1/bloquear"))
                .andExpect(status().isForbidden());
    }
}
