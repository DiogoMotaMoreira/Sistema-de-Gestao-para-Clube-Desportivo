package com.sigd.treinador.controller;

import com.sigd.treinador.dto.ConvocatoriaDTO;
import com.sigd.treinador.dto.EventoDesportivoDTO;
import com.sigd.treinador.service.EventoDesportivoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/treinador")
@PreAuthorize("hasRole('ROLE_TREINADOR')")
public class EventoDesportivoController {

    private final EventoDesportivoService eventoService;

    public EventoDesportivoController(EventoDesportivoService eventoService) {
        this.eventoService = eventoService;
    }

    @PostMapping("/eventos")
    public ResponseEntity<EventoDesportivoDTO.Response> criarEvento(@RequestBody @Valid EventoDesportivoDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventoService.criarEvento(request));
    }

    @GetMapping("/eventos")
    public ResponseEntity<List<EventoDesportivoDTO.Response>> listarEventosPorEquipa(@RequestParam Long equipaId) {
        return ResponseEntity.ok(eventoService.listarPorEquipa(equipaId));
    }

    @PostMapping("/convocatorias")
    public ResponseEntity<ConvocatoriaDTO.Response> publicarConvocatoria(@RequestBody @Valid ConvocatoriaDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventoService.publicarConvocatoria(request));
    }

    @GetMapping("/convocatorias/{id}")
    public ResponseEntity<ConvocatoriaDTO.Response> obterConvocatoria(@PathVariable Long id) {
        return ResponseEntity.ok(eventoService.obterConvocatoria(id));
    }
}
