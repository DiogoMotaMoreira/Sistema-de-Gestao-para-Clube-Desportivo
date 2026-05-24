package com.sigd.core.repository;

import com.sigd.core.model.Utilizador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilizadorRepository extends JpaRepository<Utilizador, Long> {

    Optional<Utilizador> findByUsername(String username);

    Optional<Utilizador> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

}
