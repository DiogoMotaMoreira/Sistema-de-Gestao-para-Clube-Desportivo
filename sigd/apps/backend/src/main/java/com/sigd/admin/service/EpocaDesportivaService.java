package com.sigd.admin.service;

import com.sigd.admin.dto.EpocaDesportivaDTO;
import com.sigd.core.model.EpocaDesportiva;
import com.sigd.core.model.EstadoEpoca;
import com.sigd.core.repository.EpocaDesportivaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EpocaDesportivaService {

    private final EpocaDesportivaRepository repository;

    public EpocaDesportivaService(EpocaDesportivaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<EpocaDesportivaDTO.Response> listar() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "dataInicio"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public EpocaDesportivaDTO.Response criar(EpocaDesportivaDTO.Request request) {
        // Validação: dataInicio < dataFim
        if (request.dataInicio() == null || request.dataFim() == null || !request.dataInicio().isBefore(request.dataFim())) {
            throw new IllegalArgumentException("A data de início deve ser anterior à data de fim.");
        }

        // Validação: sem sobreposição com épocas existentes
        List<EpocaDesportiva> epocas = repository.findAll();
        for (EpocaDesportiva e : epocas) {
            // Duas datas se sobrepõem se: (StartA <= EndB) e (StartB <= EndA)
            if (!request.dataInicio().isAfter(e.getDataFim()) && !e.getDataInicio().isAfter(request.dataFim())) {
                throw new IllegalArgumentException("A época desportiva sobrepõe-se com uma época existente (" + e.getNome() + ").");
            }
        }

        EpocaDesportiva epoca = new EpocaDesportiva();
        epoca.setNome(request.nome());
        epoca.setDataInicio(request.dataInicio());
        epoca.setDataFim(request.dataFim());
        epoca.setEstado(EstadoEpoca.EM_PLANEAMENTO);

        epoca = repository.save(epoca);
        return toResponse(epoca);
    }

    @Transactional
    public EpocaDesportivaDTO.Response ativar(Long id) {
        EpocaDesportiva epoca = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Época desportiva não encontrada com id: " + id));

        if (epoca.getEstado() != EstadoEpoca.EM_PLANEAMENTO) {
            throw new IllegalArgumentException("Apenas épocas em planeamento podem ser ativadas.");
        }

        // Se existe outra ATIVA -> transita para ENCERRADA
        List<EpocaDesportiva> ativas = repository.findByEstado(EstadoEpoca.ATIVA);
        for (EpocaDesportiva ativa : ativas) {
            ativa.setEstado(EstadoEpoca.ENCERRADA);
            repository.save(ativa);
        }

        epoca.setEstado(EstadoEpoca.ATIVA);
        epoca = repository.save(epoca);

        return toResponse(epoca);
    }

    private EpocaDesportivaDTO.Response toResponse(EpocaDesportiva e) {
        return new EpocaDesportivaDTO.Response(
                e.getId(),
                e.getNome(),
                e.getDataInicio(),
                e.getDataFim(),
                e.getEstado() != null ? e.getEstado().name() : null,
                e.getCriadoEm()
        );
    }
}
