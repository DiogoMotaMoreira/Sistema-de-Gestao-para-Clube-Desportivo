package com.sigd.tesouraria.service;

import com.sigd.core.exception.EncarregadoNotFoundException;
import com.sigd.core.exception.NifDuplicadoException;
import com.sigd.core.model.Atleta;
import com.sigd.core.model.EncarregadoEducacao;
import com.sigd.core.model.Equipa;
import com.sigd.core.model.EstadoElegibilidade;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.EncarregadoEducacaoRepository;
import com.sigd.core.repository.EquipaRepository;
import com.sigd.tesouraria.dto.AtletaDTO;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * AtletaServiceTest — Testes unitários para AtletaService.
 *
 * Usa JUnit 5 + Mockito (sem TestContainers, conforme convenção AGENTS.md).
 */
@ExtendWith(MockitoExtension.class)
class AtletaServiceTest {

    @Mock
    private AtletaRepository atletaRepo;

    @Mock
    private EncarregadoEducacaoRepository encarregadoRepo;

    @Mock
    private EquipaRepository equipaRepo;

    @InjectMocks
    private AtletaService atletaService;

    private EncarregadoEducacao encarregado;
    private AtletaDTO.Request request;

    @BeforeEach
    void setUp() {
        encarregado = new EncarregadoEducacao();
        encarregado.setId(1L);
        encarregado.setNome("João Silva");
        encarregado.setNif("123456789");
        encarregado.setCriadoEm(LocalDateTime.now());

        request = new AtletaDTO.Request(
                "Pedro Silva",
                LocalDate.of(2010, 5, 15),
                "987654321",
                null,
                "Avançado",
                1L,  // encarregadoId
                null // equipaId
        );
    }

    @Test
    @DisplayName("Criar atleta com sucesso retorna DTO com dados correctos")
    void criarAtleta_comSucesso() {
        // Arrange
        when(atletaRepo.findByNif(anyString())).thenReturn(Optional.empty());
        when(encarregadoRepo.findById(1L)).thenReturn(Optional.of(encarregado));
        when(atletaRepo.save(any(Atleta.class))).thenAnswer(invocation -> {
            Atleta saved = invocation.getArgument(0);
            saved.setId(10L);
            saved.setCriadoEm(LocalDateTime.now());
            saved.setAtualizadoEm(LocalDateTime.now());
            return saved;
        });

        // Act
        AtletaDTO.Response response = atletaService.criar(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(10L);
        assertThat(response.nomeCompleto()).isEqualTo("Pedro Silva");
        assertThat(response.nif()).isEqualTo("987654321");
        assertThat(response.estadoElegibilidade()).isEqualTo("APTO");
        assertThat(response.encarregadoId()).isEqualTo(1L);
        assertThat(response.encarregadoNome()).isEqualTo("João Silva");

        verify(atletaRepo).save(any(Atleta.class));
        verify(atletaRepo).findByNif("987654321");
    }

    @Test
    @DisplayName("Criar atleta com NIF duplicado lança NifDuplicadoException")
    void criarAtleta_nifDuplicado_lancaExcecao() {
        // Arrange
        Atleta existente = new Atleta();
        existente.setId(99L);
        existente.setNif("987654321");

        when(atletaRepo.findByNif("987654321")).thenReturn(Optional.of(existente));

        // Act & Assert
        assertThatThrownBy(() -> atletaService.criar(request))
                .isInstanceOf(NifDuplicadoException.class)
                .hasMessageContaining("987654321");

        verify(atletaRepo, never()).save(any());
    }

    @Test
    @DisplayName("Criar atleta com encarregado inexistente lança EncarregadoNotFoundException")
    void criarAtleta_encarregadoInexistente_lancaExcecao() {
        // Arrange
        when(atletaRepo.findByNif(anyString())).thenReturn(Optional.empty());
        when(encarregadoRepo.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> atletaService.criar(request))
                .isInstanceOf(EncarregadoNotFoundException.class);

        verify(atletaRepo, never()).save(any());
    }

}
