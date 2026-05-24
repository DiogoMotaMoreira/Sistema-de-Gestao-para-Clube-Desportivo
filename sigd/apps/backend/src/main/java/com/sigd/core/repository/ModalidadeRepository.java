package com.sigd.core.repository;

import com.sigd.core.model.Modalidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModalidadeRepository extends JpaRepository<Modalidade, Long> {

    Optional<Modalidade> findByNome(String nome);

}
