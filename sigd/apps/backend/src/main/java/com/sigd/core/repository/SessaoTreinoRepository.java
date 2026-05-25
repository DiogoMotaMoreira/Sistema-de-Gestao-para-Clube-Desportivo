package com.sigd.core.repository;

import com.sigd.core.model.SessaoTreino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SessaoTreinoRepository extends JpaRepository<SessaoTreino, Long> {
    List<SessaoTreino> findByEquipaId(Long equipaId);
    List<SessaoTreino> findByEquipaIdAndData(Long equipaId, LocalDate data);
}
