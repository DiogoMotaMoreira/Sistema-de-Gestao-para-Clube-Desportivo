package com.sigd.clinica.service;

import com.sigd.clinica.dto.AltaMedicaDTO;
import com.sigd.clinica.dto.DeliberacaoDTO;
import com.sigd.clinica.dto.EvolucaoDTO;
import com.sigd.clinica.dto.OcorrenciaDTO;
import com.sigd.core.exception.AtletaComRestricaoException;
import com.sigd.core.exception.AtletaNotFoundException;
import com.sigd.core.exception.DeliberacaoNaoAutorizadaException;
import com.sigd.core.model.*;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.OcorrenciaEvolucaoRepository;
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
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OcorrenciaServiceTest {

    @Mock
    private OcorrenciaRepository ocorrenciaRepo;

    @Mock
    private OcorrenciaEvolucaoRepository evolucaoRepo;

    @Mock
    private AtletaRepository atletaRepo;

    @Mock
    private UtilizadorRepository utilizadorRepo;

    @InjectMocks
    private OcorrenciaService ocorrenciaService;

    private Atleta atleta;
    private Utilizador medico;
    private Ocorrencia ocorrencia;

    @BeforeEach
    void setUp() {
        atleta = new Atleta();
        atleta.setId(1L);
        atleta.setNomeCompleto("João Silva");
        atleta.setEstadoElegibilidade(EstadoElegibilidade.APTO);

        medico = new Utilizador();
        medico.setId(2L);
        medico.setRole("ROLE_MEDICO");

        ocorrencia = new Ocorrencia();
        ocorrencia.setId(10L);
        ocorrencia.setAtleta(atleta);
        ocorrencia.setEstado(EstadoOcorrencia.ATIVA);
        ocorrencia.setGrauRestricao(GrauRestricaoDesportiva.AMARELO);
        ocorrencia.setEstadoEMD(EstadoEMD.EM_AVALIACAO);
        ocorrencia.setCriadoEm(LocalDateTime.now());
    }

    // =========================================================================
    // GRUPO 1 — Criação de ocorrência (RF-16, UC-09.1)
    // =========================================================================

    // 1
    @Test
    @DisplayName("Deve criar ocorrência com sucesso quando atleta não tem ocorrência ativa")
    void deve_criar_ocorrencia_com_sucesso_quando_atleta_sem_ocorrencia_ativa() {
        OcorrenciaDTO.Request req = new OcorrenciaDTO.Request(1L, LocalDate.now(), TipoOcorrencia.LESAO, "Dor no joelho", GrauRestricaoDesportiva.AMARELO, null);
        when(atletaRepo.findById(1L)).thenReturn(Optional.of(atleta));
        when(ocorrenciaRepo.findByEstadoEMDAndEstado(EstadoEMD.EM_AVALIACAO, EstadoOcorrencia.ATIVA)).thenReturn(Collections.emptyList());
        when(ocorrenciaRepo.save(any(Ocorrencia.class))).thenAnswer(i -> {
            Ocorrencia o = i.getArgument(0);
            o.setId(10L);
            o.setCriadoEm(LocalDateTime.now());
            return o;
        });

        OcorrenciaDTO.Response resp = ocorrenciaService.registarOcorrencia(req, 2L);

        assertThat(resp.id()).isEqualTo(10L);
        assertThat(resp.estado()).isEqualTo(EstadoOcorrencia.ATIVA);
    }

    // 2
    @Test
    @DisplayName("Deve lançar exceção quando o atleta já tem uma ocorrência ativa que restringe")
    void deve_lancara_excecao_quando_atleta_ja_tem_ocorrencia_ativa() {
        OcorrenciaDTO.Request req = new OcorrenciaDTO.Request(1L, LocalDate.now(), TipoOcorrencia.LESAO, "Dor no joelho", GrauRestricaoDesportiva.AMARELO, null);
        when(atletaRepo.findById(1L)).thenReturn(Optional.of(atleta));
        when(ocorrenciaRepo.findByEstadoEMDAndEstado(EstadoEMD.EM_AVALIACAO, EstadoOcorrencia.ATIVA)).thenReturn(List.of(ocorrencia)); 

        assertThatThrownBy(() -> ocorrenciaService.registarOcorrencia(req, 2L))
            .isInstanceOf(AtletaComRestricaoException.class);
    }

    // 3
    @Test
    @DisplayName("Deve lançar exceção quando o atleta não for encontrado")
    void deve_lancara_excecao_quando_atleta_nao_existe() {
        OcorrenciaDTO.Request req = new OcorrenciaDTO.Request(99L, LocalDate.now(), TipoOcorrencia.LESAO, "Dor no joelho", GrauRestricaoDesportiva.AMARELO, null);
        when(atletaRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ocorrenciaService.registarOcorrencia(req, 2L))
            .isInstanceOf(AtletaNotFoundException.class);
    }

    // 4
    @Test
    @DisplayName("Deve definir o estado de elegibilidade como CONDICIONADO ao criar ocorrência AMARELO")
    void deve_definir_estado_elegibilidade_CONDICIONADO_quando_grau_AMARELO() {
        OcorrenciaDTO.Request req = new OcorrenciaDTO.Request(1L, LocalDate.now(), TipoOcorrencia.LESAO, "Dor no joelho", GrauRestricaoDesportiva.AMARELO, null);
        when(atletaRepo.findById(1L)).thenReturn(Optional.of(atleta));
        when(ocorrenciaRepo.save(any(Ocorrencia.class))).thenAnswer(i -> {
            Ocorrencia o = i.getArgument(0);
            o.setCriadoEm(LocalDateTime.now());
            return o;
        });

        ocorrenciaService.registarOcorrencia(req, 2L);

        assertThat(atleta.getEstadoElegibilidade()).isEqualTo(EstadoElegibilidade.CONDICIONADO);
    }

    // 5
    @Test
    @DisplayName("Deve definir o estado de elegibilidade como INAPTO ao criar ocorrência VERMELHO")
    void deve_definir_estado_elegibilidade_INAPTO_quando_grau_VERMELHO() {
        OcorrenciaDTO.Request req = new OcorrenciaDTO.Request(1L, LocalDate.now(), TipoOcorrencia.LESAO, "Dor no joelho", GrauRestricaoDesportiva.VERMELHO, null);
        when(atletaRepo.findById(1L)).thenReturn(Optional.of(atleta));
        when(ocorrenciaRepo.save(any(Ocorrencia.class))).thenAnswer(i -> {
            Ocorrencia o = i.getArgument(0);
            o.setCriadoEm(LocalDateTime.now());
            return o;
        });

        ocorrenciaService.registarOcorrencia(req, 2L);

        assertThat(atleta.getEstadoElegibilidade()).isEqualTo(EstadoElegibilidade.INAPTO);
    }

    // =========================================================================
    // GRUPO 2 — Evolução de ocorrência (RF-17, UC-09.3)
    // =========================================================================

    // 6
    @Test
    @DisplayName("Deve registar a evolução de uma ocorrência com sucesso")
    void deve_registar_evolucao_com_sucesso() {
        EvolucaoDTO.Request req = new EvolucaoDTO.Request(10L, GrauRestricaoDesportiva.VERDE, "Melhorou");
        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));
        when(evolucaoRepo.save(any(OcorrenciaEvolucao.class))).thenAnswer(i -> {
            OcorrenciaEvolucao e = i.getArgument(0);
            e.setId(100L);
            return e;
        });

        EvolucaoDTO.Response resp = ocorrenciaService.registarEvolucao(req, 2L);

        assertThat(resp.id()).isEqualTo(100L);
        assertThat(resp.grauRestricao()).isEqualTo(GrauRestricaoDesportiva.VERDE);
    }

    // 7
    @Test
    @DisplayName("Deve lançar exceção ao tentar registar evolução em ocorrência resolvida")
    void deve_lancara_excecao_quando_ocorrencia_nao_esta_ATIVA() {
        EvolucaoDTO.Request req = new EvolucaoDTO.Request(10L, GrauRestricaoDesportiva.VERDE, "Melhorou");
        ocorrencia.setEstado(EstadoOcorrencia.RESOLVIDA);
        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));

        assertThatThrownBy(() -> ocorrenciaService.registarEvolucao(req, 2L))
            .isInstanceOf(IllegalStateException.class);
    }

    // 8
    @Test
    @DisplayName("Deve atualizar elegibilidade para INAPTO quando evolução for VERMELHO")
    void deve_actualizar_elegibilidade_atleta_para_INAPTO_quando_evolucao_VERMELHO() {
        EvolucaoDTO.Request req = new EvolucaoDTO.Request(10L, GrauRestricaoDesportiva.VERMELHO, "Piorou");
        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));
        when(evolucaoRepo.save(any(OcorrenciaEvolucao.class))).thenAnswer(i -> i.getArgument(0));

        ocorrenciaService.registarEvolucao(req, 2L);

        assertThat(atleta.getEstadoElegibilidade()).isEqualTo(EstadoElegibilidade.INAPTO);
    }

    // 9
    @Test
    @DisplayName("Deve atualizar elegibilidade para CONDICIONADO quando evolução for AMARELO")
    void deve_actualizar_elegibilidade_atleta_para_CONDICIONADO_quando_evolucao_AMARELO() {
        atleta.setEstadoElegibilidade(EstadoElegibilidade.APTO);
        EvolucaoDTO.Request req = new EvolucaoDTO.Request(10L, GrauRestricaoDesportiva.AMARELO, "Estável");
        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));
        when(evolucaoRepo.save(any(OcorrenciaEvolucao.class))).thenAnswer(i -> i.getArgument(0));

        ocorrenciaService.registarEvolucao(req, 2L);

        assertThat(atleta.getEstadoElegibilidade()).isEqualTo(EstadoElegibilidade.CONDICIONADO);
    }

    // 10
    @Test
    @DisplayName("Deve preservar o grau inicial da ocorrência após o registo de uma evolução")
    void deve_preservar_grau_inicial_ocorrencia_apos_evolucao() {
        EvolucaoDTO.Request req = new EvolucaoDTO.Request(10L, GrauRestricaoDesportiva.VERMELHO, "Piorou");
        ocorrencia.setGrauRestricao(GrauRestricaoDesportiva.AMARELO);
        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));
        when(evolucaoRepo.save(any(OcorrenciaEvolucao.class))).thenAnswer(i -> i.getArgument(0));

        ocorrenciaService.registarEvolucao(req, 2L);

        assertThat(ocorrencia.getGrauRestricao()).isEqualTo(GrauRestricaoDesportiva.AMARELO); 
    }

    // =========================================================================
    // GRUPO 3 — Alta médica (RF-18, UC-09.4)
    // =========================================================================

    // 11
    @Test
    @DisplayName("Deve emitir alta com sucesso quando ocorrência estiver ativa")
    void deve_emitir_alta_com_sucesso_quando_ocorrencia_ativa() {
        AltaMedicaDTO alta = new AltaMedicaDTO("Recuperado", LocalDate.now());
        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));
        when(ocorrenciaRepo.save(any(Ocorrencia.class))).thenAnswer(i -> i.getArgument(0));
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(List.of(ocorrencia));

        OcorrenciaDTO.Response resp = ocorrenciaService.emitirAlta(10L, alta, 2L);

        assertThat(resp.estado()).isEqualTo(EstadoOcorrencia.RESOLVIDA);
    }

    // 12
    @Test
    @DisplayName("Deve lançar exceção se tentar emitir alta para ocorrência já resolvida")
    void deve_lancara_excecao_quando_ocorrencia_ja_resolvida() {
        AltaMedicaDTO alta = new AltaMedicaDTO("Recuperado", LocalDate.now());
        ocorrencia.setEstado(EstadoOcorrencia.RESOLVIDA);
        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));

        assertThatThrownBy(() -> ocorrenciaService.emitirAlta(10L, alta, 2L))
            .isInstanceOf(IllegalStateException.class);
    }

    // 13
    @Test
    @DisplayName("Deve mudar o estado da ocorrência para RESOLVIDA após a alta")
    void deve_definir_estado_RESOLVIDA_apos_alta() {
        AltaMedicaDTO alta = new AltaMedicaDTO("Recuperado", LocalDate.now());
        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));
        when(ocorrenciaRepo.save(any(Ocorrencia.class))).thenAnswer(i -> i.getArgument(0));
        
        ocorrenciaService.emitirAlta(10L, alta, 2L);

        assertThat(ocorrencia.getEstado()).isEqualTo(EstadoOcorrencia.RESOLVIDA);
    }

    // 14
    @Test
    @DisplayName("Deve repor a elegibilidade para APTO se não houver outras ocorrências ativas")
    void deve_definir_estado_elegibilidade_APTO_apos_alta() {
        atleta.setEstadoElegibilidade(EstadoElegibilidade.INAPTO);
        AltaMedicaDTO alta = new AltaMedicaDTO("Recuperado", LocalDate.now());
        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));
        when(ocorrenciaRepo.save(any(Ocorrencia.class))).thenAnswer(i -> i.getArgument(0));
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(List.of(ocorrencia)); 

        ocorrenciaService.emitirAlta(10L, alta, 2L);

        assertThat(atleta.getEstadoElegibilidade()).isEqualTo(EstadoElegibilidade.APTO);
    }

    // 15
    @Test
    @DisplayName("Deve registar a data e obs de deliberação após emissão de alta")
    void deve_registar_data_deliberacao_na_alta() {
        AltaMedicaDTO alta = new AltaMedicaDTO("Recuperado", LocalDate.now());
        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));
        when(ocorrenciaRepo.save(any(Ocorrencia.class))).thenAnswer(i -> i.getArgument(0));
        
        ocorrenciaService.emitirAlta(10L, alta, 2L);

        assertThat(ocorrencia.getDataDeliberacao()).isNotNull();
        assertThat(ocorrencia.getObsDeliberacao()).isEqualTo("Recuperado");
    }

    // =========================================================================
    // GRUPO 4 — Edge cases
    // =========================================================================

    // 16
    @Test
    @DisplayName("Deve lançar exceção quando diagnóstico estiver vazio na criação")
    void deve_lancara_excecao_quando_diagnostico_vazio() {
        OcorrenciaDTO.Request req = new OcorrenciaDTO.Request(1L, LocalDate.now(), TipoOcorrencia.LESAO, "", GrauRestricaoDesportiva.AMARELO, null);
        when(atletaRepo.findById(1L)).thenReturn(Optional.of(atleta));

        assertThatThrownBy(() -> ocorrenciaService.registarOcorrencia(req, 2L))
            .isInstanceOf(IllegalArgumentException.class);
    }

    // 17
    @Test
    @DisplayName("Deve lançar exceção quando grau for VERDE na criação da ocorrência")
    void deve_lancara_excecao_quando_grau_VERDE_na_criacao() {
        OcorrenciaDTO.Request req = new OcorrenciaDTO.Request(1L, LocalDate.now(), TipoOcorrencia.LESAO, "Dor", GrauRestricaoDesportiva.VERDE, null);
        when(atletaRepo.findById(1L)).thenReturn(Optional.of(atleta));

        assertThatThrownBy(() -> ocorrenciaService.registarOcorrencia(req, 2L))
            .isInstanceOf(IllegalArgumentException.class);
    }

    // 18
    @Test
    @DisplayName("Deve calcular o grau atual de outras ocorrências ativas pela evolução mais recente")
    void deve_calcular_grau_actual_a_partir_da_evolucao_mais_recente() {
        AltaMedicaDTO alta = new AltaMedicaDTO("Recuperado", LocalDate.now());
        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));
        when(ocorrenciaRepo.save(any(Ocorrencia.class))).thenAnswer(i -> i.getArgument(0));

        Ocorrencia outraOc = new Ocorrencia();
        outraOc.setId(20L);
        outraOc.setEstado(EstadoOcorrencia.ATIVA);
        outraOc.setGrauRestricao(GrauRestricaoDesportiva.AMARELO); 

        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(List.of(ocorrencia, outraOc));

        OcorrenciaEvolucao ev = new OcorrenciaEvolucao();
        ev.setGrauRestricao(GrauRestricaoDesportiva.VERMELHO);
        when(evolucaoRepo.findByOcorrenciaIdOrderByRegistadoEmAsc(20L)).thenReturn(List.of(ev));

        ocorrenciaService.emitirAlta(10L, alta, 2L);

        // A alta da ocorrência 10 vai desencadear o recálculo do estado do atleta
        // A ocorrência 20 foi criada AMARELO mas tem uma evolução VERMELHO
        // A elegibilidade final do atleta tem de ser INAPTO
        assertThat(atleta.getEstadoElegibilidade()).isEqualTo(EstadoElegibilidade.INAPTO);
    }

    @Test
    @DisplayName("Deve listar fila EMD")
    void deve_listar_fila_emd() {
        when(ocorrenciaRepo.findByEstadoEMD(eq(EstadoEMD.EM_AVALIACAO), any())).thenReturn(org.springframework.data.domain.Page.empty());
        org.springframework.data.domain.Page<com.sigd.clinica.dto.FilaEMDDTO> res = ocorrenciaService.listarFilaEMD(org.springframework.data.domain.Pageable.unpaged());
        assertThat(res).isEmpty();
    }

    @Test
    @DisplayName("Deve obter stats fila EMD")
    void deve_obter_stats_fila_emd() {
        when(ocorrenciaRepo.findAll()).thenReturn(List.of(ocorrencia));
        com.sigd.clinica.dto.FilaEMDStatsDTO res = ocorrenciaService.obterFilaEMDStats();
        assertThat(res.pendentes()).isEqualTo(1);
    }

    @Test
    @DisplayName("Deve listar ocorrencias por atleta")
    void deve_listar_por_atleta() {
        when(atletaRepo.existsById(1L)).thenReturn(true);
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(List.of(ocorrencia));
        List<OcorrenciaDTO.Response> res = ocorrenciaService.listarPorAtleta(1L);
        assertThat(res).hasSize(1);
    }

    @Test
    @DisplayName("Deve listar ocorrencias ativas")
    void deve_listar_ocorrencias_ativas() {
        when(ocorrenciaRepo.findByEstado(EstadoOcorrencia.ATIVA)).thenReturn(List.of(ocorrencia));
        List<OcorrenciaDTO.Response> res = ocorrenciaService.listarOcorrenciasAtivas();
        assertThat(res).hasSize(1);
    }

    @Test
    @DisplayName("Deve obter ocorrencia por ID")
    void deve_obter_ocorrencia() {
        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));
        OcorrenciaDTO.Response res = ocorrenciaService.obter(10L);
        assertThat(res.id()).isEqualTo(10L);
    }

    @Test
    @DisplayName("Deve listar evolucoes")
    void deve_listar_evolucoes() {
        OcorrenciaEvolucao ev = new OcorrenciaEvolucao();
        ev.setOcorrencia(ocorrencia);
        when(evolucaoRepo.findByOcorrenciaIdOrderByRegistadoEmAsc(10L)).thenReturn(List.of(ev));
        List<EvolucaoDTO.Response> res = ocorrenciaService.getEvolucoes(10L);
        assertThat(res).hasSize(1);
    }

    @Test
    @DisplayName("Deve deliberar com sucesso para VERDE e resolver ocorrência")
    void deve_deliberar_para_VERDE_e_resolver() {
        DeliberacaoDTO del = new DeliberacaoDTO(GrauRestricaoDesportiva.VERDE, "Apto para jogar");
        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));
        when(utilizadorRepo.findById(2L)).thenReturn(Optional.of(medico));
        when(ocorrenciaRepo.save(any(Ocorrencia.class))).thenAnswer(i -> i.getArgument(0));
        when(ocorrenciaRepo.findByAtletaId(1L)).thenReturn(List.of(ocorrencia));

        OcorrenciaDTO.Response res = ocorrenciaService.deliberar(10L, del, 2L);
        assertThat(res.estado()).isEqualTo(EstadoOcorrencia.RESOLVIDA);
        assertThat(atleta.getEstadoElegibilidade()).isEqualTo(EstadoElegibilidade.APTO);
    }

    @Test
    @DisplayName("Deve deliberar com sucesso para VERMELHO e manter ATIVA")
    void deve_deliberar_para_VERMELHO_e_manter_ATIVA() {
        DeliberacaoDTO del = new DeliberacaoDTO(GrauRestricaoDesportiva.VERMELHO, "Inapto");
        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));
        when(utilizadorRepo.findById(2L)).thenReturn(Optional.of(medico));
        when(ocorrenciaRepo.save(any(Ocorrencia.class))).thenAnswer(i -> i.getArgument(0));

        OcorrenciaDTO.Response res = ocorrenciaService.deliberar(10L, del, 2L);
        assertThat(res.estado()).isEqualTo(EstadoOcorrencia.ATIVA);
        assertThat(atleta.getEstadoElegibilidade()).isEqualTo(EstadoElegibilidade.INAPTO);
    }

    @Test
    @DisplayName("Deve lançar exceção ao deliberar com utilizador sem role MEDICO")
    void deve_lancara_excecao_deliberar_sem_permissao() {
        DeliberacaoDTO del = new DeliberacaoDTO(GrauRestricaoDesportiva.VERMELHO, "Inapto");
        Utilizador admin = new Utilizador();
        admin.setRole("ROLE_ADMIN");
        
        when(ocorrenciaRepo.findById(10L)).thenReturn(Optional.of(ocorrencia));
        when(utilizadorRepo.findById(3L)).thenReturn(Optional.of(admin));

        assertThatThrownBy(() -> ocorrenciaService.deliberar(10L, del, 3L))
                .isInstanceOf(DeliberacaoNaoAutorizadaException.class);
    }

    @Test
    @DisplayName("Deve lançar exceção ao deliberar ocorrência inexistente")
    void deve_lancara_excecao_deliberar_ocorrencia_inexistente() {
        DeliberacaoDTO del = new DeliberacaoDTO(GrauRestricaoDesportiva.VERMELHO, "Inapto");
        when(ocorrenciaRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ocorrenciaService.deliberar(99L, del, 2L))
                .isInstanceOf(com.sigd.core.exception.OcorrenciaNotFoundException.class);
    }

}
