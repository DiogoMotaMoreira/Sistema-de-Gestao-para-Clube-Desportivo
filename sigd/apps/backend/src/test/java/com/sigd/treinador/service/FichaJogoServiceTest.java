package com.sigd.treinador.service;

import com.sigd.core.model.*;
import com.sigd.core.repository.EventoDesportivoRepository;
import com.sigd.core.repository.FichaJogoRepository;
import com.sigd.treinador.dto.FichaJogoDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FichaJogoServiceTest {

    @Mock
    private FichaJogoRepository fichaJogoRepo;

    @Mock
    private EventoDesportivoRepository eventoRepo;

    @InjectMocks
    private FichaJogoService fichaJogoService;

    private EventoDesportivo evento;

    @BeforeEach
    void setUp() {
        evento = new EventoDesportivo();
        evento.setId(10L);
        evento.setEstado(EstadoEvento.AGENDADO);
    }

    // ==========================================
    // GRUPO 1 — Submissão de ficha (RF-09, UC-07)
    // ==========================================

    @Test
    @DisplayName("Deve submeter ficha com sucesso quando evento existe e sem ficha prévia")
    void deve_submeter_ficha_com_sucesso_quando_evento_existe_e_sem_ficha_previa() {
        FichaJogoDTO.Request req = new FichaJogoDTO.Request(10L, 2, 1, "Bom jogo");
        when(eventoRepo.findById(10L)).thenReturn(Optional.of(evento));
        when(fichaJogoRepo.findByEventoId(10L)).thenReturn(Optional.empty());
        
        when(fichaJogoRepo.save(any(FichaJogo.class))).thenAnswer(i -> {
            FichaJogo f = i.getArgument(0);
            f.setId(100L);
            f.setEstadoSubmissao(EstadoSubmissaoFicha.SUBMETIDA);
            return f;
        });

        FichaJogoDTO.Response res = fichaJogoService.submeter(req, 1L);

        assertThat(res.id()).isEqualTo(100L);
        assertThat(res.resultado()).isEqualTo("VITORIA");
    }

    @Test
    @DisplayName("Deve lançar exceção quando o evento não existe")
    void deve_lancara_excecao_quando_evento_nao_existe() {
        FichaJogoDTO.Request req = new FichaJogoDTO.Request(99L, 2, 1, "Bom jogo");
        when(eventoRepo.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> fichaJogoService.submeter(req, 1L))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Deve lançar exceção quando já existe ficha para o evento")
    void deve_lancara_excecao_quando_ja_existe_ficha_para_evento() {
        FichaJogoDTO.Request req = new FichaJogoDTO.Request(10L, 2, 1, "Bom jogo");
        when(eventoRepo.findById(10L)).thenReturn(Optional.of(evento));
        when(fichaJogoRepo.findByEventoId(10L)).thenReturn(Optional.of(new FichaJogo()));

        assertThatThrownBy(() -> fichaJogoService.submeter(req, 1L))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    @DisplayName("Deve marcar o evento como CONCLUIDO após a submissão")
    void deve_marcar_evento_como_CONCLUIDO_apos_submissao() {
        FichaJogoDTO.Request req = new FichaJogoDTO.Request(10L, 2, 1, "Bom jogo");
        when(eventoRepo.findById(10L)).thenReturn(Optional.of(evento));
        when(fichaJogoRepo.findByEventoId(10L)).thenReturn(Optional.empty());
        when(fichaJogoRepo.save(any(FichaJogo.class))).thenAnswer(i -> {
            FichaJogo f = i.getArgument(0);
            f.setEstadoSubmissao(EstadoSubmissaoFicha.SUBMETIDA);
            return f;
        });

        fichaJogoService.submeter(req, 1L);

        assertThat(evento.getEstado()).isEqualTo(EstadoEvento.CONCLUIDO);
        verify(eventoRepo).save(evento);
    }

    // ==========================================
    // GRUPO 2 — Cálculo do resultado (RF-09)
    // ==========================================

    @Test
    @DisplayName("Deve calcular VITORIA quando golos marcados forem maiores que sofridos")
    void deve_calcular_VITORIA_quando_golos_marcados_maior_que_sofridos() {
        FichaJogoDTO.Request req = new FichaJogoDTO.Request(10L, 2, 1, "");
        when(eventoRepo.findById(10L)).thenReturn(Optional.of(evento));
        when(fichaJogoRepo.save(any(FichaJogo.class))).thenAnswer(i -> {
            FichaJogo f = i.getArgument(0);
            f.setEstadoSubmissao(EstadoSubmissaoFicha.SUBMETIDA);
            return f;
        });

        FichaJogoDTO.Response res = fichaJogoService.submeter(req, 1L);
        assertThat(res.resultado()).isEqualTo("VITORIA");
    }

    @Test
    @DisplayName("Deve calcular DERROTA quando golos marcados forem menores que sofridos")
    void deve_calcular_DERROTA_quando_golos_marcados_menor_que_sofridos() {
        FichaJogoDTO.Request req = new FichaJogoDTO.Request(10L, 1, 2, "");
        when(eventoRepo.findById(10L)).thenReturn(Optional.of(evento));
        when(fichaJogoRepo.save(any(FichaJogo.class))).thenAnswer(i -> {
            FichaJogo f = i.getArgument(0);
            f.setEstadoSubmissao(EstadoSubmissaoFicha.SUBMETIDA);
            return f;
        });

        FichaJogoDTO.Response res = fichaJogoService.submeter(req, 1L);
        assertThat(res.resultado()).isEqualTo("DERROTA");
    }

    @Test
    @DisplayName("Deve calcular EMPATE quando golos marcados e sofridos forem iguais")
    void deve_calcular_EMPATE_quando_golos_iguais() {
        FichaJogoDTO.Request req = new FichaJogoDTO.Request(10L, 1, 1, "");
        when(eventoRepo.findById(10L)).thenReturn(Optional.of(evento));
        when(fichaJogoRepo.save(any(FichaJogo.class))).thenAnswer(i -> {
            FichaJogo f = i.getArgument(0);
            f.setEstadoSubmissao(EstadoSubmissaoFicha.SUBMETIDA);
            return f;
        });

        FichaJogoDTO.Response res = fichaJogoService.submeter(req, 1L);
        assertThat(res.resultado()).isEqualTo("EMPATE");
    }

    @Test
    @DisplayName("Deve calcular VITORIA com resultado expressivo (ex: 5-0)")
    void deve_calcular_VITORIA_com_resultado_expressivo() {
        FichaJogoDTO.Request req = new FichaJogoDTO.Request(10L, 5, 0, "");
        when(eventoRepo.findById(10L)).thenReturn(Optional.of(evento));
        when(fichaJogoRepo.save(any(FichaJogo.class))).thenAnswer(i -> {
            FichaJogo f = i.getArgument(0);
            f.setEstadoSubmissao(EstadoSubmissaoFicha.SUBMETIDA);
            return f;
        });

        FichaJogoDTO.Response res = fichaJogoService.submeter(req, 1L);
        assertThat(res.resultado()).isEqualTo("VITORIA");
    }

    @Test
    @DisplayName("Deve calcular DERROTA com resultado mínimo (ex: 0-1)")
    void deve_calcular_DERROTA_com_resultado_minimo() {
        FichaJogoDTO.Request req = new FichaJogoDTO.Request(10L, 0, 1, "");
        when(eventoRepo.findById(10L)).thenReturn(Optional.of(evento));
        when(fichaJogoRepo.save(any(FichaJogo.class))).thenAnswer(i -> {
            FichaJogo f = i.getArgument(0);
            f.setEstadoSubmissao(EstadoSubmissaoFicha.SUBMETIDA);
            return f;
        });

        FichaJogoDTO.Response res = fichaJogoService.submeter(req, 1L);
        assertThat(res.resultado()).isEqualTo("DERROTA");
    }

    // ==========================================
    // GRUPO 3 — Edge cases
    // ==========================================

    @Test
    @DisplayName("Deve lançar exceção quando golos marcados são negativos")
    void deve_lancara_excecao_quando_golos_marcados_negativos() {
        FichaJogoDTO.Request req = new FichaJogoDTO.Request(10L, -1, 0, "");
        when(eventoRepo.findById(10L)).thenReturn(Optional.of(evento));

        assertThatThrownBy(() -> fichaJogoService.submeter(req, 1L))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Deve lançar exceção quando golos sofridos são negativos")
    void deve_lancara_excecao_quando_golos_sofridos_negativos() {
        FichaJogoDTO.Request req = new FichaJogoDTO.Request(10L, 0, -1, "");
        when(eventoRepo.findById(10L)).thenReturn(Optional.of(evento));

        assertThatThrownBy(() -> fichaJogoService.submeter(req, 1L))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Deve permitir ficha com zero golos em ambos os lados e classificar como EMPATE")
    void deve_permitir_ficha_com_zero_golos_em_ambos() {
        FichaJogoDTO.Request req = new FichaJogoDTO.Request(10L, 0, 0, "");
        when(eventoRepo.findById(10L)).thenReturn(Optional.of(evento));
        when(fichaJogoRepo.save(any(FichaJogo.class))).thenAnswer(i -> {
            FichaJogo f = i.getArgument(0);
            f.setEstadoSubmissao(EstadoSubmissaoFicha.SUBMETIDA);
            return f;
        });

        FichaJogoDTO.Response res = fichaJogoService.submeter(req, 1L);
        assertThat(res.resultado()).isEqualTo("EMPATE");
    }

    @Test
    @DisplayName("Deve associar o submetida_por ao id do treinador (userId passado)")
    void deve_associar_submetida_por_ao_id_do_treinador() {
        FichaJogoDTO.Request req = new FichaJogoDTO.Request(10L, 1, 0, "");
        when(eventoRepo.findById(10L)).thenReturn(Optional.of(evento));
        when(fichaJogoRepo.save(any(FichaJogo.class))).thenAnswer(i -> {
            FichaJogo f = i.getArgument(0);
            f.setEstadoSubmissao(EstadoSubmissaoFicha.SUBMETIDA);
            return f;
        });

        fichaJogoService.submeter(req, 55L); // userId 55L

        verify(fichaJogoRepo).save(argThat(f -> f.getSubmetidaPor().equals(55L)));
    }

    @Test
    @DisplayName("Deve obter ficha de jogo por evento com sucesso")
    void deve_obter_ficha_de_jogo_por_evento_com_sucesso() {
        FichaJogo ficha = new FichaJogo();
        ficha.setId(100L);
        ficha.setEventoId(10L);
        ficha.setGolosMarcados(2);
        ficha.setGolosSofridos(1);
        ficha.setResultado(ResultadoJogo.VITORIA);
        ficha.setEstadoSubmissao(EstadoSubmissaoFicha.SUBMETIDA);

        when(fichaJogoRepo.findByEventoId(10L)).thenReturn(Optional.of(ficha));

        FichaJogoDTO.Response res = fichaJogoService.obterPorEvento(10L);
        assertThat(res.id()).isEqualTo(100L);
    }

    @Test
    @DisplayName("Deve lançar exceção quando ficha não é encontrada por evento")
    void deve_lancara_excecao_quando_ficha_nao_encontrada() {
        when(fichaJogoRepo.findByEventoId(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> fichaJogoService.obterPorEvento(99L))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
