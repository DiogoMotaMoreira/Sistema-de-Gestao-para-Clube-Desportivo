package com.sigd.tesouraria.service;

import com.sigd.core.exception.AtletaNotFoundException;
import com.sigd.core.exception.EncarregadoNotFoundException;
import com.sigd.core.exception.NifDuplicadoException;
import com.sigd.core.model.*;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.EncarregadoEducacaoRepository;
import com.sigd.core.repository.EquipaRepository;
import com.sigd.core.repository.OcorrenciaRepository;
import com.sigd.tesouraria.dto.AtletaDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AtletaServiceTest {

    @Mock
    private AtletaRepository atletaRepo;
    @Mock
    private EncarregadoEducacaoRepository encarregadoRepo;
    @Mock
    private EquipaRepository equipaRepo;
    @Mock
    private OcorrenciaRepository ocorrenciaRepo;

    @InjectMocks
    private AtletaService atletaService;

    private Atleta atleta;
    private EncarregadoEducacao ee;
    private Equipa equipa;

    @BeforeEach
    void setUp() {
        ee = new EncarregadoEducacao();
        ee.setId(10L);
        ee.setNome("João EE");

        equipa = new Equipa();
        equipa.setId(20L);
        equipa.setNome("Sub-15");

        atleta = new Atleta();
        atleta.setId(100L);
        atleta.setNomeCompleto("João Atleta");
        atleta.setEncarregado(ee);
        atleta.setEquipa(equipa);
        atleta.setEstadoElegibilidade(EstadoElegibilidade.APTO);
    }

    @Test
    void deve_listar_atletas() {
        when(atletaRepo.pesquisar(eq("João"), eq(20L), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(atleta)));
        Page<AtletaDTO.Response> res = atletaService.listar("João", 20L, Pageable.unpaged());
        assertThat(res).hasSize(1);
    }

    @Test
    void deve_obter_atleta() {
        when(atletaRepo.findById(100L)).thenReturn(Optional.of(atleta));
        AtletaDTO.Response res = atletaService.obter(100L);
        assertThat(res.id()).isEqualTo(100L);
    }

    @Test
    void deve_lancara_excecao_se_obter_atleta_nao_encontrado() {
        when(atletaRepo.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> atletaService.obter(99L)).isInstanceOf(AtletaNotFoundException.class);
    }

    @Test
    void deve_criar_atleta() {
        AtletaDTO.Request req = new AtletaDTO.Request("Novo Atleta", LocalDate.now(), "123456789", "1234", "Avançado", 10L, 20L);
        when(atletaRepo.findByNif("123456789")).thenReturn(Optional.empty());
        when(encarregadoRepo.findById(10L)).thenReturn(Optional.of(ee));
        when(equipaRepo.findById(20L)).thenReturn(Optional.of(equipa));
        when(atletaRepo.save(any(Atleta.class))).thenAnswer(i -> {
            Atleta a = i.getArgument(0);
            a.setId(101L);
            return a;
        });

        AtletaDTO.Response res = atletaService.criar(req);
        assertThat(res.id()).isEqualTo(101L);
    }

    @Test
    void deve_lancara_excecao_se_nif_duplicado_ao_criar() {
        AtletaDTO.Request req = new AtletaDTO.Request("Novo Atleta", LocalDate.now(), "123456789", "1234", "Avançado", 10L, 20L);
        Atleta outro = new Atleta();
        outro.setId(99L);
        when(atletaRepo.findByNif("123456789")).thenReturn(Optional.of(outro));

        assertThatThrownBy(() -> atletaService.criar(req)).isInstanceOf(NifDuplicadoException.class);
    }

    @Test
    void deve_lancara_excecao_se_encarregado_nao_encontrado_ao_criar() {
        AtletaDTO.Request req = new AtletaDTO.Request("Novo Atleta", LocalDate.now(), "123456789", "1234", "Avançado", 99L, 20L);
        when(atletaRepo.findByNif("123456789")).thenReturn(Optional.empty());
        when(encarregadoRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> atletaService.criar(req)).isInstanceOf(EncarregadoNotFoundException.class);
    }

    @Test
    void deve_lancara_excecao_se_equipa_nao_encontrada_ao_criar() {
        AtletaDTO.Request req = new AtletaDTO.Request("Novo Atleta", LocalDate.now(), "123456789", "1234", "Avançado", 10L, 99L);
        when(atletaRepo.findByNif("123456789")).thenReturn(Optional.empty());
        when(encarregadoRepo.findById(10L)).thenReturn(Optional.of(ee));
        when(equipaRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> atletaService.criar(req)).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void deve_atualizar_atleta() {
        AtletaDTO.Request req = new AtletaDTO.Request("Atleta Atualizado", LocalDate.now(), "123456789", "1234", "Avançado", 10L, 20L);
        when(atletaRepo.findById(100L)).thenReturn(Optional.of(atleta));
        when(atletaRepo.findByNif("123456789")).thenReturn(Optional.of(atleta)); // Mesmo ID
        when(encarregadoRepo.findById(10L)).thenReturn(Optional.of(ee));
        when(equipaRepo.findById(20L)).thenReturn(Optional.of(equipa));
        when(atletaRepo.save(any(Atleta.class))).thenAnswer(i -> i.getArgument(0));

        AtletaDTO.Response res = atletaService.atualizar(100L, req);
        assertThat(res.nomeCompleto()).isEqualTo("Atleta Atualizado");
    }

    @Test
    void deve_lancara_excecao_ao_atualizar_se_nao_encontrado() {
        AtletaDTO.Request req = new AtletaDTO.Request("Atleta Atualizado", LocalDate.now(), "123456789", "1234", "Avançado", 10L, 20L);
        when(atletaRepo.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> atletaService.atualizar(99L, req)).isInstanceOf(AtletaNotFoundException.class);
    }

    @Test
    void deve_transferir_atleta() {
        Equipa novaEquipa = new Equipa();
        novaEquipa.setId(30L);
        when(atletaRepo.findById(100L)).thenReturn(Optional.of(atleta));
        when(equipaRepo.findById(30L)).thenReturn(Optional.of(novaEquipa));
        when(atletaRepo.save(any(Atleta.class))).thenAnswer(i -> i.getArgument(0));

        AtletaDTO.Response res = atletaService.transferir(100L, 30L);
        assertThat(res.equipaId()).isEqualTo(30L);
    }

    @Test
    void deve_lancara_excecao_ao_transferir_equipa_nao_encontrada() {
        when(atletaRepo.findById(100L)).thenReturn(Optional.of(atleta));
        when(equipaRepo.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> atletaService.transferir(100L, 99L)).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void deve_obter_elegibilidade() {
        when(atletaRepo.findById(100L)).thenReturn(Optional.of(atleta));
        when(ocorrenciaRepo.findByAtletaId(100L)).thenReturn(List.of());

        AtletaDTO.Elegibilidade el = atletaService.obterElegibilidade(100L);
        assertThat(el.apto()).isTrue();
    }
}
