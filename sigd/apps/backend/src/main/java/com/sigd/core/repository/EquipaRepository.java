package com.sigd.core.repository;

import com.sigd.core.model.Equipa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipaRepository extends JpaRepository<Equipa, Long> {

    List<Equipa> findByEscalaoId(Long escalaoId);

    List<Equipa> findByModalidadeId(Long modalidadeId);

    List<Equipa> findByAtiva(Boolean ativa);

}
