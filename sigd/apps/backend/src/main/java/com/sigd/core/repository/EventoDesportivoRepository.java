package com.sigd.core.repository;

import com.sigd.core.model.EventoDesportivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventoDesportivoRepository extends JpaRepository<EventoDesportivo, Long> {
    List<EventoDesportivo> findByEquipaIdOrderByDataAsc(Long equipaId);
    List<EventoDesportivo> findByEquipaIdAndDataBetween(Long equipaId, LocalDate startDate, LocalDate endDate);
}
