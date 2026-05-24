package com.sigd.core.repository;

import com.sigd.core.model.EntidadeJuridica;
import com.sigd.core.model.EstadoObrigacao;
import com.sigd.core.model.ObrigacaoFinanceira;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ObrigacaoFinanceiraRepository extends JpaRepository<ObrigacaoFinanceira, Long> {

    List<ObrigacaoFinanceira> findByEncarregadoId(Long encarregadoId);

    List<ObrigacaoFinanceira> findByEstado(EstadoObrigacao estado);

    List<ObrigacaoFinanceira> findByEntidadeJuridica(EntidadeJuridica entidadeJuridica);

    List<ObrigacaoFinanceira> findByAtletaId(Long atletaId);

}
