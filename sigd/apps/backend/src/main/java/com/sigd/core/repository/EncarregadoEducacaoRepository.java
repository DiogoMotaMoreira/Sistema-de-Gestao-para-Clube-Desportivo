package com.sigd.core.repository;

import com.sigd.core.model.EncarregadoEducacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EncarregadoEducacaoRepository extends JpaRepository<EncarregadoEducacao, Long> {

    Optional<EncarregadoEducacao> findByNif(String nif);

    Page<EncarregadoEducacao> findByNomeContainingIgnoreCase(String nome, Pageable pageable);

    /**
     * Pesquisa por nome OU NIF (case-insensitive para nome).
     * Usado pelo EncarregadoService.listar().
     */
    @Query("SELECT e FROM EncarregadoEducacao e WHERE " +
           "LOWER(e.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "e.nif LIKE CONCAT('%', :termo, '%')")
    Page<EncarregadoEducacao> pesquisar(@Param("termo") String termo, Pageable pageable);

}
