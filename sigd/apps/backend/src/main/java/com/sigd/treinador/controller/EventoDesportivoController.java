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
    private final com.sigd.treinador.service.PdfConvocatoriaService pdfConvocatoriaService;

    public EventoDesportivoController(EventoDesportivoService eventoService,
                                      com.sigd.treinador.service.PdfConvocatoriaService pdfConvocatoriaService) {
        this.eventoService = eventoService;
        this.pdfConvocatoriaService = pdfConvocatoriaService;
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

    @GetMapping(value = "/convocatorias/{id}/pdf", produces = org.springframework.http.MediaType.APPLICATION_PDF_VALUE)
    @PreAuthorize("hasAnyRole('ROLE_TREINADOR', 'ROLE_DIRETOR_TECNICO')")
    public ResponseEntity<byte[]> baixarPdfConvocatoria(@PathVariable Long id) {
        byte[] pdf = pdfConvocatoriaService.gerarPdfConvocatoria(id);
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "convocatoria_" + id + ".pdf");
        return new ResponseEntity<>(pdf, headers, org.springframework.http.HttpStatus.OK);
    }
}
