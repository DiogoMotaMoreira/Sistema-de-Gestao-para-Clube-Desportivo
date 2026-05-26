package com.sigd.treinador.service;

import com.sigd.core.model.*;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.OcorrenciaEvolucaoRepository;
import com.sigd.core.repository.OcorrenciaRepository;
import com.sigd.treinador.dto.SemaforoDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SemaforoServiceTest {

    @Mock private AtletaRepository atletaRepo;
    @Mock private OcorrenciaRepository ocorrenciaRepo;
    @Mock private OcorrenciaEvolucaoRepository evolucaoRepo;

    @InjectMocks private SemaforoService service;

    private Atleta atleta;

    @BeforeEach
    void setUp() {
        atleta = new Atleta();
        atleta.setId(1L);
        atleta.setNomeCompleto("João Mota");
        atleta.setEstadoElegibilidade(EstadoElegibilidade.APTO);
    }

    // ==========================================
    // GRUPO 1 — Cálculo do semáforo por grau (RF-11, UC-08)
    // ==========================================

    @Test
    @DisplayName("Deve retornar VERDE quando atleta não tem ocorrências ativas")
    void deve_retornar_VERDE_quando_atleta_sem_ocorrencias_ativas() {
        when(atletaRepo.findByEquipaId(100L)).thenReturn(List.of(atleta));
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(Collections.emptyList());

        List<SemaforoDTO> res = service.obterSemaforoPlantel(100L);

        assertThat(res).hasSize(1);
        assertThat(res.get(0).semaforo()).isEqualTo("VERDE");
    }

    @Test
    @DisplayName("Deve retornar AMARELO quando ocorrência ativa tem grau AMARELO sem evoluções")
    void deve_retornar_AMARELO_quando_ocorrencia_ativa_com_grau_AMARELO_sem_evolucoes() {
        Ocorrencia oc = new Ocorrencia();
        oc.setId(10L);
        oc.setEstado(EstadoOcorrencia.ATIVA);
        oc.setGrauRestricao(GrauRestricaoDesportiva.AMARELO);

        when(atletaRepo.findByEquipaId(100L)).thenReturn(List.of(atleta));
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(List.of(oc));
        when(evolucaoRepo.findByOcorrenciaIdOrderByRegistadoEmAsc(10L)).thenReturn(Collections.emptyList());

        List<SemaforoDTO> res = service.obterSemaforoPlantel(100L);

        assertThat(res.get(0).semaforo()).isEqualTo("AMARELO");
    }

    @Test
    @DisplayName("Deve retornar VERMELHO quando ocorrência ativa tem grau VERMELHO sem evoluções")
    void deve_retornar_VERMELHO_quando_ocorrencia_ativa_com_grau_VERMELHO_sem_evolucoes() {
        Ocorrencia oc = new Ocorrencia();
        oc.setId(10L);
        oc.setEstado(EstadoOcorrencia.ATIVA);
        oc.setGrauRestricao(GrauRestricaoDesportiva.VERMELHO);

        when(atletaRepo.findByEquipaId(100L)).thenReturn(List.of(atleta));
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(List.of(oc));
        when(evolucaoRepo.findByOcorrenciaIdOrderByRegistadoEmAsc(10L)).thenReturn(Collections.emptyList());

        List<SemaforoDTO> res = service.obterSemaforoPlantel(100L);

        assertThat(res.get(0).semaforo()).isEqualTo("BLOQUEADO");
    }

    // ==========================================
    // GRUPO 2 — Prioridade das evoluções sobre o grau base (RF-17)
    // ==========================================

    @Test
    @DisplayName("Deve retornar VERMELHO quando evolução mais recente é VERMELHO mesmo ocorrência inicial AMARELO")
    void deve_retornar_VERMELHO_quando_evolucao_mais_recente_e_VERMELHO_mesmo_ocorrencia_inicial_AMARELO() {
        Ocorrencia oc = new Ocorrencia();
        oc.setId(10L);
        oc.setEstado(EstadoOcorrencia.ATIVA);
        oc.setGrauRestricao(GrauRestricaoDesportiva.AMARELO);

        OcorrenciaEvolucao ev = new OcorrenciaEvolucao();
        ev.setGrauRestricao(GrauRestricaoDesportiva.VERMELHO);

        when(atletaRepo.findByEquipaId(100L)).thenReturn(List.of(atleta));
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(List.of(oc));
        when(evolucaoRepo.findByOcorrenciaIdOrderByRegistadoEmAsc(10L)).thenReturn(List.of(ev));

        List<SemaforoDTO> res = service.obterSemaforoPlantel(100L);

        assertThat(res.get(0).semaforo()).isEqualTo("BLOQUEADO");
    }

    @Test
    @DisplayName("Deve retornar AMARELO quando evolução mais recente é AMARELO mesmo ocorrência inicial VERMELHO")
    void deve_retornar_AMARELO_quando_evolucao_mais_recente_e_AMARELO_mesmo_ocorrencia_inicial_VERMELHO() {
        Ocorrencia oc = new Ocorrencia();
        oc.setId(10L);
        oc.setEstado(EstadoOcorrencia.ATIVA);
        oc.setGrauRestricao(GrauRestricaoDesportiva.VERMELHO);

        OcorrenciaEvolucao ev = new OcorrenciaEvolucao();
        ev.setGrauRestricao(GrauRestricaoDesportiva.AMARELO);

        when(atletaRepo.findByEquipaId(100L)).thenReturn(List.of(atleta));
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(List.of(oc));
        when(evolucaoRepo.findByOcorrenciaIdOrderByRegistadoEmAsc(10L)).thenReturn(List.of(ev));

        List<SemaforoDTO> res = service.obterSemaforoPlantel(100L);

        assertThat(res.get(0).semaforo()).isEqualTo("AMARELO");
    }

    @Test
    @DisplayName("Deve usar o grau da última evolução quando existem múltiplas evoluções")
    void deve_usar_grau_da_ultima_evolucao_quando_existem_multiplas_evolucoes() {
        Ocorrencia oc = new Ocorrencia();
        oc.setId(10L);
        oc.setEstado(EstadoOcorrencia.ATIVA);
        oc.setGrauRestricao(GrauRestricaoDesportiva.VERMELHO);

        OcorrenciaEvolucao ev1 = new OcorrenciaEvolucao();
        ev1.setGrauRestricao(GrauRestricaoDesportiva.AMARELO);
        
        OcorrenciaEvolucao ev2 = new OcorrenciaEvolucao();
        ev2.setGrauRestricao(GrauRestricaoDesportiva.VERDE);

        when(atletaRepo.findByEquipaId(100L)).thenReturn(List.of(atleta));
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(List.of(oc));
        when(evolucaoRepo.findByOcorrenciaIdOrderByRegistadoEmAsc(10L)).thenReturn(List.of(ev1, ev2));

        List<SemaforoDTO> res = service.obterSemaforoPlantel(100L);

        assertThat(res.get(0).semaforo()).isEqualTo("VERDE");
    }

    // ==========================================
    // GRUPO 3 — PENDENTE_EMD (RF-20)
    // ==========================================

    @Test
    @DisplayName("Deve sinalizar PENDENTE_EMD (VERMELHO) quando atleta tem estado PENDENTE_EMD")
    void deve_sinalizar_PENDENTE_EMD_quando_atleta_tem_estado_PENDENTE_EMD() {
        atleta.setEstadoElegibilidade(EstadoElegibilidade.PENDENTE_EMD);

        when(atletaRepo.findByEquipaId(100L)).thenReturn(List.of(atleta));
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(Collections.emptyList());

        List<SemaforoDTO> res = service.obterSemaforoPlantel(100L);

        assertThat(res.get(0).semaforo()).isEqualTo("VERMELHO");
        assertThat(res.get(0).motivo()).isEqualTo("Exame pendente");
    }

    @Test
    @DisplayName("Deve usar ocorrência ativa e ignorar PENDENTE_EMD quando há restrição clínica")
    void deve_usar_ocorrencia_ativa_e_ignorar_PENDENTE_EMD_quando_ha_restricao_clinica() {
        atleta.setEstadoElegibilidade(EstadoElegibilidade.PENDENTE_EMD);

        Ocorrencia oc = new Ocorrencia();
        oc.setId(10L);
        oc.setEstado(EstadoOcorrencia.ATIVA);
        oc.setGrauRestricao(GrauRestricaoDesportiva.AMARELO);

        when(atletaRepo.findByEquipaId(100L)).thenReturn(List.of(atleta));
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(List.of(oc));
        when(evolucaoRepo.findByOcorrenciaIdOrderByRegistadoEmAsc(10L)).thenReturn(Collections.emptyList());

        List<SemaforoDTO> res = service.obterSemaforoPlantel(100L);

        // O semáforo deve ser VERMELHO (pois PENDENTE_EMD bloqueia a atividade).
        assertThat(res.get(0).semaforo()).isEqualTo("VERMELHO");
    }

    // ==========================================
    // GRUPO 4 — Edge cases
    // ==========================================

    @Test
    @DisplayName("Deve retornar VERDE quando todas as ocorrências estão RESOLVIDAS")
    void deve_retornar_VERDE_quando_todas_as_ocorrencias_sao_RESOLVIDAS() {
        Ocorrencia oc = new Ocorrencia();
        oc.setId(10L);
        oc.setEstado(EstadoOcorrencia.RESOLVIDA);
        oc.setGrauRestricao(GrauRestricaoDesportiva.VERMELHO);

        when(atletaRepo.findByEquipaId(100L)).thenReturn(List.of(atleta));
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(List.of(oc));

        List<SemaforoDTO> res = service.obterSemaforoPlantel(100L);

        assertThat(res.get(0).semaforo()).isEqualTo("VERDE");
    }

    @Test
    @DisplayName("Deve prevalecer o pior grau quando atleta tem múltiplas ocorrências ativas")
    void deve_prevalecer_pior_grau_quando_atleta_tem_multiplas_ocorrencias_ativas() {
        Ocorrencia oc1 = new Ocorrencia();
        oc1.setId(10L);
        oc1.setEstado(EstadoOcorrencia.ATIVA);
        oc1.setGrauRestricao(GrauRestricaoDesportiva.AMARELO);

        Ocorrencia oc2 = new Ocorrencia();
        oc2.setId(20L);
        oc2.setEstado(EstadoOcorrencia.ATIVA);
        oc2.setGrauRestricao(GrauRestricaoDesportiva.VERMELHO);

        when(atletaRepo.findByEquipaId(100L)).thenReturn(List.of(atleta));
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(List.of(oc1, oc2));
        when(evolucaoRepo.findByOcorrenciaIdOrderByRegistadoEmAsc(10L)).thenReturn(Collections.emptyList());
        when(evolucaoRepo.findByOcorrenciaIdOrderByRegistadoEmAsc(20L)).thenReturn(Collections.emptyList());

        List<SemaforoDTO> res = service.obterSemaforoPlantel(100L);

        assertThat(res.get(0).semaforo()).isEqualTo("BLOQUEADO");
    }

    @Test
    @DisplayName("Deve retornar VERDE quando lista de ocorrências é vazia")
    void deve_retornar_VERDE_quando_lista_de_ocorrencias_e_vazia() {
        when(atletaRepo.findByEquipaId(100L)).thenReturn(List.of(atleta));
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(Collections.emptyList());

        List<SemaforoDTO> res = service.obterSemaforoPlantel(100L);

        assertThat(res.get(0).semaforo()).isEqualTo("VERDE");
    }

    @Test
    @DisplayName("Deve retornar VERMELHO quando ocorrência AMARELO tem evolução VERMELHO e existe outra ocorrência VERDE")
    void deve_retornar_VERMELHO_quando_ocorrencia_AMARELO_tem_evolucao_VERMELHO_e_outra_ocorrencia_VERDE() {
        Ocorrencia oc1 = new Ocorrencia();
        oc1.setId(10L);
        oc1.setEstado(EstadoOcorrencia.ATIVA);
        oc1.setGrauRestricao(GrauRestricaoDesportiva.AMARELO);

        OcorrenciaEvolucao ev = new OcorrenciaEvolucao();
        ev.setGrauRestricao(GrauRestricaoDesportiva.VERMELHO);

        Ocorrencia oc2 = new Ocorrencia();
        oc2.setId(20L);
        oc2.setEstado(EstadoOcorrencia.ATIVA);
        oc2.setGrauRestricao(GrauRestricaoDesportiva.VERDE);

        when(atletaRepo.findByEquipaId(100L)).thenReturn(List.of(atleta));
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(List.of(oc1, oc2));
        when(evolucaoRepo.findByOcorrenciaIdOrderByRegistadoEmAsc(10L)).thenReturn(List.of(ev));
        when(evolucaoRepo.findByOcorrenciaIdOrderByRegistadoEmAsc(20L)).thenReturn(Collections.emptyList());

        List<SemaforoDTO> res = service.obterSemaforoPlantel(100L);

        assertThat(res.get(0).semaforo()).isEqualTo("BLOQUEADO");
    }
}
