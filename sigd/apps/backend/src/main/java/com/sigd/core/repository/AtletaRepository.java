package com.sigd.core.repository;

import com.sigd.core.model.Atleta;
import com.sigd.core.model.EstadoElegibilidade;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AtletaRepository extends JpaRepository<Atleta, Long> {

    Optional<Atleta> findByNif(String nif);

    List<Atleta> findByEquipaId(Long equipaId);

    List<Atleta> findByEncarregadoId(Long encarregadoId);

    List<Atleta> findByEstadoElegibilidade(EstadoElegibilidade estadoElegibilidade);

    List<Atleta> findByEstadoElegibilidadeNot(EstadoElegibilidade estadoElegibilidade);

    List<Atleta> findByNomeCompletoContainingIgnoreCase(String nomeCompleto);

    /**
     * Pesquisa paginada com filtro opcional por equipa.
     * Se equipaId for null, retorna todos que correspondem à pesquisa.
     */
    @Query("SELECT a FROM Atleta a WHERE " +
           "(:pesquisa IS NULL OR LOWER(a.nomeCompleto) LIKE LOWER(CONCAT('%', :pesquisa, '%'))) AND " +
           "(:equipaId IS NULL OR a.equipa.id = :equipaId)")
    Page<Atleta> pesquisar(
            @Param("pesquisa") String pesquisa,
            @Param("equipaId") Long equipaId,
            Pageable pageable);

    long countByFederado(boolean federado);
}
