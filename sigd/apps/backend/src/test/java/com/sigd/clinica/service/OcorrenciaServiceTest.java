package com.sigd.clinica.service;

import com.sigd.clinica.dto.DeliberacaoDTO;
import com.sigd.clinica.dto.OcorrenciaDTO;
import com.sigd.core.exception.AtletaNotFoundException;
import com.sigd.core.exception.DeliberacaoNaoAutorizadaException;
import com.sigd.core.model.*;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.OcorrenciaRepository;
import com.sigd.core.repository.UtilizadorRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OcorrenciaServiceTest {

    @Mock
    private OcorrenciaRepository ocorrenciaRepo;

    @Mock
    private AtletaRepository atletaRepo;

    @Mock
    private UtilizadorRepository utilizadorRepo;

    @InjectMocks
    private OcorrenciaService ocorrenciaService;

    private Atleta atleta;
    private Utilizador medico;
    private Utilizador admin;
    private Ocorrencia ocorrencia;

    @BeforeEach
    void setUp() {
        atleta = new Atleta();
        atleta.setId(1L);
        atleta.setNomeCompleto("João Silva");
        atleta.setDataNascimento(LocalDate.of(2005, 3, 15));

        medico = new Utilizador();
        medico.setId(4L);
        medico.setUsername("medico");
        medico.setEmail("medico@boavista.pt");
        medico.setPasswordHash("$2a$10$hash");
        medico.setRole("ROLE_MEDICO");

        admin = new Utilizador();
        admin.setId(1L);
        admin.setUsername("admin");
        admin.setEmail("admin@sigd.local");
        admin.setPasswordHash("$2a$10$hash");
        admin.setRole("ROLE_ADMIN");

        ocorrencia = new Ocorrencia();
        ocorrencia.setId(10L);
        ocorrencia.setAtleta(atleta);
        ocorrencia.setDataOcorrencia(LocalDate.now());
        ocorrencia.setTipo(TipoOcorrencia.LESAO);
        ocorrencia.setDiagnostico("Entorse no tornozelo direito");
        ocorrencia.setGrauRestricao(GrauRestricaoDesportiva.AMARELO);
        ocorrencia.setEstadoEMD(EstadoEMD.EM_AVALIACAO);
        ocorrencia.setEstado(EstadoOcorrencia.ATIVA);
        ocorrencia.setMedicoCriador(medico);
        ocorrencia.setCriadoEm(LocalDateTime.now());
        ocorrencia.setAtualizadoEm(LocalDateTime.now());
    }

    @Test
    @DisplayName("Registar ocorrência com sucesso")
    void testRegistarOcorrenciaComSucesso() {
        OcorrenciaDTO.Request request = new OcorrenciaDTO.Request(
                1L,
                LocalDate.now(),
                TipoOcorrencia.LESAO,
                "Entorse no tornozelo direito",
                GrauRestricaoDesportiva.AMARELO,
                LocalDate.now().plusDays(7)
        );

        when(atletaRepo.findById(1L)).thenReturn(Optional.of(atleta));
        when(ocorrenciaRepo.findByEstadoEMDAndEstado(
                eq(EstadoEMD.EM_AVALIACAO), eq(EstadoOcorrencia.ATIVA)))
                .thenReturn(Collections.emptyList());
        when(utilizadorRepo.findById(4L)).thenReturn(Optional.of(medico));
        when(ocorrenciaRepo.save(any(Ocorrencia.class))).thenAnswer(invocation -> {
            Ocorrencia saved = invocation.getArgument(0);
            saved.setId(10L);
            saved.setCriadoEm(LocalDateTime.now());
            return saved;
        });

        OcorrenciaDTO.Response response = ocorrenciaService.registarOcorrencia(request, 4L);

        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(10L);
        assertThat(response.atletaId()).isEqualTo(1L);
        assertThat(response.atletaNome()).isEqualTo("João Silva");
        assertThat(response.tipo()).isEqualTo(TipoOcorrencia.LESAO);
        assertThat(response.grauRestricao()).isEqualTo(GrauRestricaoDesportiva.AMARELO);
        assertThat(response.estadoEMD()).isEqualTo(EstadoEMD.EM_AVALIACAO);
        assertThat(response.estado()).isEqualTo(EstadoOcorrencia.ATIVA);
        assertThat(response.medicoCriadorNome()).isEqualTo("medico");
    }

    @Test
    @DisplayName("Registar ocorrência com atleta inexistente lança AtletaNotFoundException")
    void testRegistarOcorrenciaComAtletaInexistente_lancaExcecao() {
        OcorrenciaDTO.Request request = new OcorrenciaDTO.Request(
                999L,
                LocalDate.now(),
                TipoOcorrencia.DOENCA,
                "Gripe forte",
                GrauRestricaoDesportiva.VERDE,
                null
        );

        when(atletaRepo.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ocorrenciaService.registarOcorrencia(request, 4L))
                .isInstanceOf(AtletaNotFoundException.class)
                .hasMessageContaining("999");
    }

    @Test
    @DisplayName("Deliberar ocorrência com sucesso")
    void testDeliberarComSucesso() {
        DeliberacaoDTO deliberacao = new DeliberacaoDTO(
                GrauRestricaoDesportiva.VERDE,
                "Atleta recuperado. Alta médica concedida."
        );

        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));
        when(utilizadorRepo.findById(4L)).thenReturn(Optional.of(medico));
        when(ocorrenciaRepo.save(any(Ocorrencia.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OcorrenciaDTO.Response response = ocorrenciaService.deliberar(10L, deliberacao, 4L);

        assertThat(response).isNotNull();
        assertThat(response.grauRestricao()).isEqualTo(GrauRestricaoDesportiva.VERDE);
        assertThat(response.estadoEMD()).isEqualTo(EstadoEMD.DELIBERADO);
        assertThat(response.estado()).isEqualTo(EstadoOcorrencia.RESOLVIDA);
        assertThat(response.obsDeliberacao()).isEqualTo("Atleta recuperado. Alta médica concedida.");
        assertThat(response.medicoDeliberacaoNome()).isEqualTo("medico");
    }

    @Test
    @DisplayName("Deliberar sem autorização lança DeliberacaoNaoAutorizadaException")
    void testDeliberarSemAutorizacao_lancaExcecao() {
        DeliberacaoDTO deliberacao = new DeliberacaoDTO(
                GrauRestricaoDesportiva.VERDE,
                "Tentativa não autorizada"
        );

        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));
        when(utilizadorRepo.findById(1L)).thenReturn(Optional.of(admin));

        assertThatThrownBy(() -> ocorrenciaService.deliberar(10L, deliberacao, 1L))
                .isInstanceOf(DeliberacaoNaoAutorizadaException.class)
                .hasMessageContaining("medico");
    }

}
