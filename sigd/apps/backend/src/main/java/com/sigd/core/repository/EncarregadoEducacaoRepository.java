package com.sigd.core.repository;

import com.sigd.core.model.EncarregadoEducacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EncarregadoEducacaoRepository extends JpaRepository<EncarregadoEducacao, Long> {

    Optional<EncarregadoEducacao> findByNif(String nif);

}
