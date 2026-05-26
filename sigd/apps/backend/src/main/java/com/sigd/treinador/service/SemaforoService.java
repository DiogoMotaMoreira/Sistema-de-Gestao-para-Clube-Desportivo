package com.sigd.treinador.service;

import com.sigd.core.model.Atleta;
import com.sigd.core.model.EstadoElegibilidade;
import com.sigd.core.model.EstadoOcorrencia;
import com.sigd.core.model.GrauRestricaoDesportiva;
import com.sigd.core.model.Ocorrencia;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.core.repository.OcorrenciaEvolucaoRepository;
import com.sigd.core.repository.OcorrenciaRepository;
import com.sigd.core.model.OcorrenciaEvolucao;
import com.sigd.treinador.dto.SemaforoDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class SemaforoService {

    private final AtletaRepository atletaRepository;
    private final OcorrenciaRepository ocorrenciaRepository;
    private final OcorrenciaEvolucaoRepository evolucaoRepository;

    public SemaforoService(AtletaRepository atletaRepository, OcorrenciaRepository ocorrenciaRepository, OcorrenciaEvolucaoRepository evolucaoRepository) {
        this.atletaRepository = atletaRepository;
        this.ocorrenciaRepository = ocorrenciaRepository;
        this.evolucaoRepository = evolucaoRepository;
    }

    /**
     * Calcula o semáforo clínico de prontidão para todos os atletas de uma equipa.
     */
    public List<SemaforoDTO> obterSemaforoPlantel(Long equipaId) {
        List<Atleta> atletas = atletaRepository.findByEquipaId(equipaId);
        List<SemaforoDTO> result = new ArrayList<>();

        for (Atleta atleta : atletas) {
            // Buscar todas as ocorrências clínicas do atleta
            List<Ocorrencia> ocorrencias = ocorrenciaRepository.findByAtletaId(atleta.getId());

            // Filtrar apenas as ocorrências que estão com estado ATIVA
            List<Ocorrencia> ocorrenciasAtivas = ocorrencias.stream()
                    .filter(o -> o.getEstado() == EstadoOcorrencia.ATIVA)
                    .toList();

            boolean temVermelho = false;
            boolean temAmarelo = false;

            for (Ocorrencia oc : ocorrenciasAtivas) {
                List<OcorrenciaEvolucao> evolucoes = evolucaoRepository.findByOcorrenciaIdOrderByRegistadoEmAsc(oc.getId());
                GrauRestricaoDesportiva grau = evolucoes.isEmpty() ? oc.getGrauRestricao() : evolucoes.get(evolucoes.size() - 1).getGrauRestricao();

                if (grau == GrauRestricaoDesportiva.VERMELHO) {
                    temVermelho = true;
                } else if (grau == GrauRestricaoDesportiva.AMARELO) {
                    temAmarelo = true;
                }
            }

            String semaforo;
            String motivo;

            if (temVermelho) {
                semaforo = "BLOQUEADO";
                motivo = "Lesão activa";
            } else if (temAmarelo) {
                semaforo = "AMARELO";
                motivo = "Condicionado";
            } else if (atleta.getEstadoElegibilidade() == EstadoElegibilidade.PENDENTE_EMD) {
                semaforo = "VERMELHO";
                motivo = "Exame pendente";
            } else {
                semaforo = "VERDE";
                motivo = "Apto";
            }

            result.add(new SemaforoDTO(atleta.getId(), atleta.getNomeCompleto(), semaforo, motivo));
        }

        return result;
    }
}
