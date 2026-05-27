package com.sigd.cfo.service;

import com.sigd.cfo.controller.CfoController;
import com.sigd.cfo.dto.CfoResumoDTO;
import com.sigd.core.model.EntidadeJuridica;
import com.sigd.core.model.EstadoObrigacao;
import com.sigd.core.model.ObrigacaoFinanceira;
import com.sigd.core.repository.ObrigacaoFinanceiraRepository;
import com.sigd.core.repository.UtilizadorRepository;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.model.TipoObrigacao;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CfoServiceTest {

    @Mock
    private ObrigacaoFinanceiraRepository obrigacaoRepo;
    @Mock
    private UtilizadorRepository utilizadorRepo;
    @Mock
    private AtletaRepository atletaRepo;

    @InjectMocks
    private CfoController cfoController;

    // GRUPO 1 — Segregação CLUBE/SAD
    @Test
    void deve_separar_obrigacoes_clube_de_sad() {
        ObrigacaoFinanceira ob1 = new ObrigacaoFinanceira();
        ob1.setEntidadeJuridica(EntidadeJuridica.CLUBE);
        ob1.setEstado(EstadoObrigacao.PAGO);
        ob1.setValor(new BigDecimal("100.00"));

        ObrigacaoFinanceira ob2 = new ObrigacaoFinanceira();
        ob2.setEntidadeJuridica(EntidadeJuridica.SAD);
        ob2.setEstado(EstadoObrigacao.PAGO);
        ob2.setValor(new BigDecimal("200.00"));

        when(obrigacaoRepo.findAll()).thenReturn(List.of(ob1, ob2));

        ResponseEntity<CfoResumoDTO> response = cfoController.getResumoFinanceiro();
        assertEquals(new BigDecimal("100.00"), response.getBody().clube().receita());
        assertEquals(new BigDecimal("200.00"), response.getBody().sad().receita());
    }

    @Test
    void deve_calcular_receita_clube_correctamente() {
        ObrigacaoFinanceira ob = new ObrigacaoFinanceira();
        ob.setEntidadeJuridica(EntidadeJuridica.CLUBE);
        ob.setEstado(EstadoObrigacao.PAGO);
        ob.setValor(new BigDecimal("150.00"));

        when(obrigacaoRepo.findAll()).thenReturn(List.of(ob));

        ResponseEntity<CfoResumoDTO> response = cfoController.getResumoFinanceiro();
        assertEquals(new BigDecimal("150.00"), response.getBody().clube().receita());
    }

    @Test
    void deve_calcular_receita_sad_correctamente() {
        ObrigacaoFinanceira ob = new ObrigacaoFinanceira();
        ob.setEntidadeJuridica(EntidadeJuridica.SAD);
        ob.setEstado(EstadoObrigacao.PAGO);
        ob.setValor(new BigDecimal("300.00"));

        when(obrigacaoRepo.findAll()).thenReturn(List.of(ob));

        ResponseEntity<CfoResumoDTO> response = cfoController.getResumoFinanceiro();
        assertEquals(new BigDecimal("300.00"), response.getBody().sad().receita());
    }

    @Test
    void deve_calcular_divida_clube_correctamente() {
        ObrigacaoFinanceira ob1 = new ObrigacaoFinanceira();
        ob1.setEntidadeJuridica(EntidadeJuridica.CLUBE);
        ob1.setEstado(EstadoObrigacao.EM_ATRASO);
        ob1.setValor(new BigDecimal("50.00"));

        ObrigacaoFinanceira ob2 = new ObrigacaoFinanceira();
        ob2.setEntidadeJuridica(EntidadeJuridica.CLUBE);
        ob2.setEstado(EstadoObrigacao.PENDENTE);
        ob2.setValor(new BigDecimal("20.00"));

        when(obrigacaoRepo.findAll()).thenReturn(List.of(ob1, ob2));

        ResponseEntity<CfoResumoDTO> response = cfoController.getResumoFinanceiro();
        assertEquals(new BigDecimal("70.00"), response.getBody().clube().divida());
    }

    @Test
    void deve_retornar_zero_sad_quando_sem_obrigacoes_sad() {
        when(obrigacaoRepo.findAll()).thenReturn(List.of());
        
        ResponseEntity<CfoResumoDTO> response = cfoController.getResumoFinanceiro();
        assertEquals(BigDecimal.ZERO, response.getBody().sad().receita());
        assertEquals(BigDecimal.ZERO, response.getBody().sad().divida());
    }

    // GRUPO 2 — Relatórios financeiros
    @Test
    void deve_agrupar_obrigacoes_por_rubrica() {
        ObrigacaoFinanceira ob = new ObrigacaoFinanceira();
        ob.setEntidadeJuridica(EntidadeJuridica.CLUBE);
        ob.setTipo(TipoObrigacao.MENSALIDADE);
        ob.setEstado(EstadoObrigacao.PAGO);
        ob.setValor(new BigDecimal("100.00"));

        when(obrigacaoRepo.findAll()).thenReturn(List.of(ob));

        ResponseEntity<CfoResumoDTO> response = cfoController.getResumoFinanceiro();
        assertEquals(1, response.getBody().detalhesPorRubrica().size());
        assertEquals("MENSALIDADE", response.getBody().detalhesPorRubrica().get(0).rubrica());
        assertEquals("CLUBE", response.getBody().detalhesPorRubrica().get(0).entidade());
        assertEquals(new BigDecimal("100.00"), response.getBody().detalhesPorRubrica().get(0).totalGerado());
    }

    @Test
    void deve_calcular_taxa_liquidacao_por_rubrica() {
        ObrigacaoFinanceira ob1 = new ObrigacaoFinanceira();
        ob1.setEntidadeJuridica(EntidadeJuridica.CLUBE);
        ob1.setTipo(TipoObrigacao.MENSALIDADE);
        ob1.setEstado(EstadoObrigacao.PAGO);
        ob1.setValor(new BigDecimal("100.00"));

        ObrigacaoFinanceira ob2 = new ObrigacaoFinanceira();
        ob2.setEntidadeJuridica(EntidadeJuridica.CLUBE);
        ob2.setTipo(TipoObrigacao.MENSALIDADE);
        ob2.setEstado(EstadoObrigacao.EM_ATRASO);
        ob2.setValor(new BigDecimal("100.00"));

        when(obrigacaoRepo.findAll()).thenReturn(List.of(ob1, ob2));

        ResponseEntity<CfoResumoDTO> response = cfoController.getResumoFinanceiro();
        assertEquals(50.0, response.getBody().detalhesPorRubrica().get(0).taxaLiquidacao());
    }

    @Test
    void deve_listar_atletas_federados() {
        when(atletaRepo.countByFederado(true)).thenReturn(42L);
        ResponseEntity<CfoResumoDTO> response = cfoController.getResumoFinanceiro();
        assertEquals(42L, response.getBody().atletasFederados());
    }

    @Test
    void deve_contar_socios_activos() {
        when(utilizadorRepo.countByRoleAndAtivo("ROLE_EE", true)).thenReturn(100L);
        ResponseEntity<CfoResumoDTO> response = cfoController.getResumoFinanceiro();
        assertEquals(100L, response.getBody().sociosAtivos());
    }

    // GRUPO 3 — Edge cases
    @Test
    void deve_retornar_relatorio_vazio_quando_sem_dados() {
        when(obrigacaoRepo.findAll()).thenReturn(List.of());
        
        ResponseEntity<CfoResumoDTO> response = cfoController.getResumoFinanceiro();
        Assertions.assertNotNull(response.getBody());
        assertEquals(BigDecimal.ZERO, response.getBody().global().receita());
        assertEquals(BigDecimal.ZERO, response.getBody().global().divida());
        assertEquals(0.0, response.getBody().global().taxaLiquidacao());
    }

    @Test
    void deve_ignorar_obrigacoes_pendentes_no_calculo_de_receita() {
        ObrigacaoFinanceira ob = new ObrigacaoFinanceira();
        ob.setEntidadeJuridica(EntidadeJuridica.CLUBE);
        ob.setEstado(EstadoObrigacao.PENDENTE);
        ob.setValor(new BigDecimal("150.00"));

        when(obrigacaoRepo.findAll()).thenReturn(List.of(ob));

        ResponseEntity<CfoResumoDTO> response = cfoController.getResumoFinanceiro();
        assertEquals(BigDecimal.ZERO, response.getBody().clube().receita());
        assertEquals(new BigDecimal("150.00"), response.getBody().clube().divida());
    }
}
