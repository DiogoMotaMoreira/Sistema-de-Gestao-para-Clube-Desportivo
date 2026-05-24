package com.sigd.core.repository;

import com.sigd.core.model.EstadoEMD;
import com.sigd.core.model.EstadoOcorrencia;
import com.sigd.core.model.Ocorrencia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {

    List<Ocorrencia> findByAtletaId(Long atletaId);

    List<Ocorrencia> findByEstadoEMD(EstadoEMD estado);

    List<Ocorrencia> findByEstadoEMDAndEstado(EstadoEMD estadoEMD, EstadoOcorrencia estado);

    Page<Ocorrencia> findByEstadoEMD(EstadoEMD estado, Pageable pageable);

}
