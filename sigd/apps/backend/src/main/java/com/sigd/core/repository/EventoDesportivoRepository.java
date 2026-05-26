package com.sigd.core.repository;

import com.sigd.core.model.EventoDesportivo;
import com.sigd.core.model.TipoEvento;
import com.sigd.core.model.EstadoEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventoDesportivoRepository extends JpaRepository<EventoDesportivo, Long> {
    List<EventoDesportivo> findByEquipaIdOrderByDataAsc(Long equipaId);
    List<EventoDesportivo> findByEquipaIdAndDataBetween(Long equipaId, LocalDate startDate, LocalDate endDate);

    long countByTipo(TipoEvento tipo);
    long countByTipoAndEstado(TipoEvento tipo, EstadoEvento estado);
}
