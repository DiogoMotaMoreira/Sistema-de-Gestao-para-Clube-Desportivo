package com.sigd.core.repository;

import com.sigd.core.model.AvaliacaoRendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRendimentoRepository extends JpaRepository<AvaliacaoRendimento, Long> {
    List<AvaliacaoRendimento> findBySessaoId(Long sessaoId);
}
