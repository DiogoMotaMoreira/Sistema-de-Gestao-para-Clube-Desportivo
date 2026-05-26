package com.sigd.core.repository;

import com.sigd.core.model.FichaJogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FichaJogoRepository extends JpaRepository<FichaJogo, Long> {
    Optional<FichaJogo> findByEventoId(Long eventoId);
}
