package com.sigd.scheduler;

import com.sigd.core.model.Atleta;
import com.sigd.core.model.EstadoElegibilidade;
import com.sigd.core.repository.AtletaRepository;
import com.sigd.audit.model.AuditLog;
import com.sigd.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmdSchedulerService {

    private final AtletaRepository atletaRepo;
    private final AuditLogRepository auditLogRepo;

    // Corre todos os dias às 02:00
    @Scheduled(cron = "0 0 2 * * ?")
    public void verificarEmdExpirados() {
        LocalDate limiteAviso = LocalDate.now().plusDays(30);

        List<Atleta> atletasEmRisco = atletaRepo
            .findByEstadoElegibilidadeNot(EstadoElegibilidade.PENDENTE_EMD)
            .stream()
            .filter(a -> a.getDataValidadeEmd() != null && a.getDataValidadeEmd().isBefore(limiteAviso))
            .collect(Collectors.toList());

        for (Atleta atleta : atletasEmRisco) {
            atleta.setEstadoElegibilidade(EstadoElegibilidade.PENDENTE_EMD);
            atletaRepo.save(atleta);

            // Registar no audit log
            AuditLog log = new AuditLog();
            log.setAtor("SYSTEM");
            log.setAcao("EXPIRAR_EMD");
            log.setEntidade("Atleta");
            log.setEntidadeId(atleta.getId());
            log.setDetalhes("EMD expirado ou a expirar em " + atleta.getDataValidadeEmd() + ". Elegibilidade alterada para PENDENTE_EMD.");
            log.setTimestamp(LocalDateTime.now());
            log.setIpAddress("127.0.0.1");
            auditLogRepo.save(log);
        }
    }
}
