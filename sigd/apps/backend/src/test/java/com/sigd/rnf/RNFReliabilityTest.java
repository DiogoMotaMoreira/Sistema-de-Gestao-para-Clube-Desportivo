package com.sigd.rnf;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RNFReliabilityTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "ADMIN")
    public void rnf18_t1_bodyJsonMalformado_NaoExpõeStackTrace() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/admin/utilizadores")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{invalid json"))
                .andReturn();
        
        assertThat(result.getResponse().getStatus()).isEqualTo(400);
        assertThat(result.getResponse().getContentAsString()).doesNotContain("at com.sigd");
        assertThat(result.getResponse().getContentAsString()).doesNotContain("Exception"); // Stack trace indicativo
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void rnf18_t2_campoObrigatorioNulo_NaoExpõeStackTrace() throws Exception {
        // Exemplo: criar utilizador sem username
        String payload = "{\"password\":\"senha1234\", \"email\":\"novo@test.com\", \"role\":\"ROLE_EE\", \"nome\":\"Novo\"}";
        MvcResult result = mockMvc.perform(post("/api/v1/admin/utilizadores")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andReturn();
        
        // Verifica se é erro 400 ou 422
        assertThat(result.getResponse().getStatus()).isBetween(400, 422);
        assertThat(result.getResponse().getContentAsString()).doesNotContain("at com.sigd");
    }

    @Test
    @WithMockUser(roles = "SECRETARIA")
    public void rnf18_t3_idInexistente_Retorna404_NaoExpõeStackTrace() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/v1/tesouraria/atletas/99999"))
                .andReturn();
        
        // Verifica se é 404 (pode ser outro endpoint de detalhes, vamos assumir que existe esse get por id ou similar. O importante é o 404 sem stack trace).
        assertThat(result.getResponse().getStatus()).isEqualTo(404);
        assertThat(result.getResponse().getContentAsString()).doesNotContain("at com.sigd");
    }
}
