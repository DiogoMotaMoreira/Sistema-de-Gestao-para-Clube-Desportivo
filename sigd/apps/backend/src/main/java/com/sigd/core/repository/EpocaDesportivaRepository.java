package com.sigd.core.repository;

import com.sigd.core.model.EpocaDesportiva;
import com.sigd.core.model.EstadoEpoca;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpocaDesportivaRepository extends JpaRepository<EpocaDesportiva, Long> {

    List<EpocaDesportiva> findByEstado(EstadoEpoca estado);

    List<EpocaDesportiva> findAll(Sort sort);
}
