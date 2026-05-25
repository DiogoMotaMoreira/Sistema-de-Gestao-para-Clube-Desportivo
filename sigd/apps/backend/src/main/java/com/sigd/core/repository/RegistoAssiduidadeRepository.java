package com.sigd.core.repository;

import com.sigd.core.model.RegistoAssiduidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistoAssiduidadeRepository extends JpaRepository<RegistoAssiduidade, Long> {
    List<RegistoAssiduidade> findBySessaoId(Long sessaoId);
    Optional<RegistoAssiduidade> findBySessaoIdAndAtletaId(Long sessaoId, Long atletaId);
}
