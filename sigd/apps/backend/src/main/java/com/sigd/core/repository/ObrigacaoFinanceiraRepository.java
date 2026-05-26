package com.sigd.core.repository;

import com.sigd.core.model.EntidadeJuridica;
import com.sigd.core.model.EstadoObrigacao;
import com.sigd.core.model.ObrigacaoFinanceira;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ObrigacaoFinanceiraRepository extends JpaRepository<ObrigacaoFinanceira, Long> {

    List<ObrigacaoFinanceira> findByEncarregadoId(Long encarregadoId);

    List<ObrigacaoFinanceira> findByEstado(EstadoObrigacao estado);

    List<ObrigacaoFinanceira> findByEntidadeJuridica(EntidadeJuridica entidadeJuridica);

    List<ObrigacaoFinanceira> findByAtletaId(Long atletaId);

    @Query("SELECT o FROM ObrigacaoFinanceira o WHERE " +
           "(:estado IS NULL OR o.estado = :estado) AND " +
           "(:entidade IS NULL OR o.entidadeJuridica = :entidade)")
    Page<ObrigacaoFinanceira> findByFiltros(
            @Param("estado") EstadoObrigacao estado,
            @Param("entidade") EntidadeJuridica entidade,
            Pageable pageable);

}
