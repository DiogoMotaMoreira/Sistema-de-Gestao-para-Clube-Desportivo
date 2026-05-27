package com.sigd.tesouraria.service;

import com.sigd.core.exception.EncarregadoNotFoundException;
import com.sigd.core.exception.NifDuplicadoException;
import com.sigd.core.model.EncarregadoEducacao;
import com.sigd.core.repository.EncarregadoEducacaoRepository;
import com.sigd.core.repository.ObrigacaoFinanceiraRepository;
import com.sigd.tesouraria.dto.EncarregadoEducacaoDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EncarregadoServiceTest {

    @Mock
    private EncarregadoEducacaoRepository encarregadoRepo;

    @Mock
    private ObrigacaoFinanceiraRepository obrigacaoRepo;

    @InjectMocks
    private EncarregadoService encarregadoService;

    private EncarregadoEducacao ee;

    @BeforeEach
    void setUp() {
        ee = new EncarregadoEducacao();
        ee.setId(1L);
        ee.setNome("João Silva");
        ee.setNif("123456789");
        ee.setEmail("joao@silva.com");
    }

    // ==========================================
    // GRUPO 1 — CRUD (RF-36, UC-02)
    // ==========================================

    @Test
    @DisplayName("Deve criar encarregado com sucesso")
    void deve_criar_encarregado_com_sucesso() {
        EncarregadoEducacaoDTO.Request req = new EncarregadoEducacaoDTO.Request("João Silva", "123456789", "joao@silva.com", "912345678", "Rua A");

        when(encarregadoRepo.findByNif("123456789")).thenReturn(Optional.empty());
        when(encarregadoRepo.save(any(EncarregadoEducacao.class))).thenAnswer(i -> {
            EncarregadoEducacao saved = i.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        EncarregadoEducacaoDTO.Response res = encarregadoService.criar(req);

        assertThat(res.id()).isEqualTo(10L);
        assertThat(res.nome()).isEqualTo("João Silva");
    }

    @Test
    @DisplayName("Deve lançar exceção quando nif já existe (duplicado)")
    void deve_lancara_excecao_quando_nif_duplicado() {
        EncarregadoEducacaoDTO.Request req = new EncarregadoEducacaoDTO.Request("João Silva", "123456789", "joao@silva.com", "912345678", "Rua A");

        EncarregadoEducacao existente = new EncarregadoEducacao();
        existente.setId(2L);
        existente.setNif("123456789");

        when(encarregadoRepo.findByNif("123456789")).thenReturn(Optional.of(existente));

        assertThatThrownBy(() -> encarregadoService.criar(req))
                .isInstanceOf(NifDuplicadoException.class);
    }

    @Test
    @DisplayName("Deve lançar exceção quando email duplicado")
    void deve_lancara_excecao_quando_email_duplicado() {
        EncarregadoEducacaoDTO.Request req = new EncarregadoEducacaoDTO.Request("Maria", "987654321", "joao@silva.com", "912345678", "Rua A");

        when(encarregadoRepo.findByNif("987654321")).thenReturn(Optional.empty());
        
        // Simular que o email já existe, logo deveria ser lançado erro de email duplicado.
        // O serviço não valida email, logo vai tentar criar na BD e a BD vai lançar exceção.
        // O teste espera uma exceção de validação que o próprio serviço lance (ex: IllegalArgumentException ou similar).
        // Se o teste falhar com null pointer ou apenas passar e devolver sucesso, significa que apanhámos o BUG.
        
        // Simulo a BD a retornar sucesso (pois o mock do save devolveria a entidade). 
        // O teste deve afirmar que uma exceção é lançada.
        assertThatThrownBy(() -> encarregadoService.criar(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("email");
    }

    @Test
    @DisplayName("Deve pesquisar por nome parcial")
    void deve_pesquisar_por_nome_parcial() {
        when(encarregadoRepo.pesquisar("João", PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(ee)));

        Page<EncarregadoEducacaoDTO.Response> res = encarregadoService.listar("João", PageRequest.of(0, 10));

        assertThat(res.getTotalElements()).isEqualTo(1);
        assertThat(res.getContent().get(0).nome()).isEqualTo("João Silva");
    }

    @Test
    @DisplayName("Deve pesquisar por NIF")
    void deve_pesquisar_por_nif() {
        when(encarregadoRepo.pesquisar("123456789", PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(ee)));

        Page<EncarregadoEducacaoDTO.Response> res = encarregadoService.listar("123456789", PageRequest.of(0, 10));

        assertThat(res.getTotalElements()).isEqualTo(1);
        assertThat(res.getContent().get(0).nif()).isEqualTo("123456789");
    }

    @Test
    @DisplayName("Deve pesquisar por email")
    void deve_pesquisar_por_email() {
        when(encarregadoRepo.pesquisar("joao@silva.com", PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(ee)));

        Page<EncarregadoEducacaoDTO.Response> res = encarregadoService.listar("joao@silva.com", PageRequest.of(0, 10));

        assertThat(res.getTotalElements()).isEqualTo(1);
    }

    @Test
    @DisplayName("Deve listar todos sem pesquisa")
    void deve_listar_todos_sem_pesquisa() {
        when(encarregadoRepo.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(ee)));

        Page<EncarregadoEducacaoDTO.Response> res = encarregadoService.listar(null, PageRequest.of(0, 10));

        assertThat(res.getTotalElements()).isEqualTo(1);
    }

    @Test
    @DisplayName("Deve obter encarregado por ID")
    void deve_obter_encarregado_por_id() {
        when(encarregadoRepo.findById(1L)).thenReturn(Optional.of(ee));
        EncarregadoEducacaoDTO.Response res = encarregadoService.obter(1L);
        assertThat(res.id()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Deve lançar exceção ao obter encarregado inexistente")
    void deve_lancara_excecao_ao_obter_encarregado_inexistente() {
        when(encarregadoRepo.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> encarregadoService.obter(99L))
                .isInstanceOf(EncarregadoNotFoundException.class);
    }

    @Test
    @DisplayName("Deve atualizar encarregado com sucesso")
    void deve_atualizar_encarregado_com_sucesso() {
        EncarregadoEducacaoDTO.Request req = new EncarregadoEducacaoDTO.Request("João Silva", "123456789", "novo@silva.com", "912345678", "Rua B");
        when(encarregadoRepo.findById(1L)).thenReturn(Optional.of(ee));
        when(encarregadoRepo.findByNif("123456789")).thenReturn(Optional.of(ee)); // is the same ID
        when(encarregadoRepo.save(any(EncarregadoEducacao.class))).thenAnswer(i -> i.getArgument(0));

        EncarregadoEducacaoDTO.Response res = encarregadoService.atualizar(1L, req);
        assertThat(res.email()).isEqualTo("novo@silva.com");
    }

    @Test
    @DisplayName("Deve lançar exceção ao atualizar encarregado inexistente")
    void deve_lancara_excecao_ao_atualizar_inexistente() {
        EncarregadoEducacaoDTO.Request req = new EncarregadoEducacaoDTO.Request("João Silva", "123456789", "novo@silva.com", "912345678", "Rua B");
        when(encarregadoRepo.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> encarregadoService.atualizar(99L, req))
                .isInstanceOf(EncarregadoNotFoundException.class);
    }

    // ==========================================
    // GRUPO 2 — Edge cases
    // ==========================================

    @Test
    @DisplayName("Deve lançar exceção quando nome é vazio")
    void deve_lancara_excecao_quando_nome_vazio() {
        EncarregadoEducacaoDTO.Request req = new EncarregadoEducacaoDTO.Request("", "123456789", "joao@silva.com", "912345678", "Rua A");

        assertThatThrownBy(() -> encarregadoService.criar(req))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Deve lançar exceção quando NIF é inválido (menos de 9 dígitos)")
    void deve_lancara_excecao_quando_nif_invalido() {
        EncarregadoEducacaoDTO.Request req = new EncarregadoEducacaoDTO.Request("João", "1234", "joao@silva.com", "912345678", "Rua A");

        assertThatThrownBy(() -> encarregadoService.criar(req))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando sem resultados")
    void deve_retornar_lista_vazia_quando_sem_resultados() {
        when(encarregadoRepo.pesquisar("NaoExiste", PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(Collections.emptyList()));

        Page<EncarregadoEducacaoDTO.Response> res = encarregadoService.listar("NaoExiste", PageRequest.of(0, 10));

        assertThat(res.getTotalElements()).isZero();
    }

    @Test
    @DisplayName("Deve obter situação financeira com sucesso")
    void deve_obter_situacao_financeira() {
        when(encarregadoRepo.existsById(1L)).thenReturn(true);
        com.sigd.core.model.ObrigacaoFinanceira obr = new com.sigd.core.model.ObrigacaoFinanceira();
        obr.setValor(new java.math.BigDecimal("50.00"));
        obr.setEstado(com.sigd.core.model.EstadoObrigacao.PENDENTE);
        obr.setEncarregado(ee);
        when(obrigacaoRepo.findByEncarregadoId(1L)).thenReturn(List.of(obr));

        com.sigd.tesouraria.dto.SituacaoFinanceiraDTO res = encarregadoService.obterSituacaoFinanceira(1L);
        assertThat(res.totalDivida()).isEqualTo(new java.math.BigDecimal("50.00"));
        assertThat(res.totalPago()).isEqualTo(java.math.BigDecimal.ZERO);
    }

    @Test
    @DisplayName("Deve lançar exceção ao obter situação financeira de encarregado inexistente")
    void deve_lancara_excecao_situacao_financeira_inexistente() {
        when(encarregadoRepo.existsById(99L)).thenReturn(false);
        assertThatThrownBy(() -> encarregadoService.obterSituacaoFinanceira(99L))
                .isInstanceOf(EncarregadoNotFoundException.class);
    }
}
