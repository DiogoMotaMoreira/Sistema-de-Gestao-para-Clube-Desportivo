package com.sigd.core.repository;

import com.sigd.core.model.OcorrenciaEvolucao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OcorrenciaEvolucaoRepository extends JpaRepository<OcorrenciaEvolucao, Long> {
    List<OcorrenciaEvolucao> findByOcorrenciaIdOrderByRegistadoEmAsc(Long ocorrenciaId);
}
