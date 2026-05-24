package com.sigd.core.repository;

import com.sigd.core.model.Atleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AtletaRepository extends JpaRepository<Atleta, Long> {

    Optional<Atleta> findByNif(String nif);

    List<Atleta> findByEquipaId(Long equipaId);

    List<Atleta> findByEstadoElegibilidade(String estadoElegibilidade);

}
