package com.sigd.core.repository;

import com.sigd.core.model.Utilizador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Repository
public interface UtilizadorRepository extends JpaRepository<Utilizador, Long> {

    @Query("SELECT u FROM Utilizador u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :pesquisa, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :pesquisa, '%'))")
    Page<Utilizador> findByPesquisa(@Param("pesquisa") String pesquisa, Pageable pageable);

    Optional<Utilizador> findByUsername(String username);

    Optional<Utilizador> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<Utilizador> findByUsernameAndRole(String username, String role);

}
