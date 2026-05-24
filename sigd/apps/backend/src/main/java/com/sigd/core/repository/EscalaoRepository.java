package com.sigd.core.repository;

import com.sigd.core.model.Escalao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EscalaoRepository extends JpaRepository<Escalao, Long> {

    Optional<Escalao> findByDesignacao(String designacao);

}
