package com.sigd.treinador.controller;

import com.sigd.core.model.Utilizador;
import com.sigd.treinador.dto.ConvocatoriaDTO;
import com.sigd.treinador.dto.EventoDesportivoDTO;
import com.sigd.treinador.dto.FichaJogoDTO;
import com.sigd.treinador.service.EventoDesportivoService;
import com.sigd.treinador.service.FichaJogoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/treinador")
@PreAuthorize("hasAnyRole('ROLE_TREINADOR', 'ROLE_DIRETOR_TECNICO')")
public class EventoDesportivoController {

    private final EventoDesportivoService eventoService;
    private final com.sigd.treinador.service.PdfConvocatoriaService pdfConvocatoriaService;
    private final FichaJogoService fichaJogoService;

    public EventoDesportivoController(EventoDesportivoService eventoService,
                                      com.sigd.treinador.service.PdfConvocatoriaService pdfConvocatoriaService,
                                      FichaJogoService fichaJogoService) {
        this.eventoService = eventoService;
        this.pdfConvocatoriaService = pdfConvocatoriaService;
        this.fichaJogoService = fichaJogoService;
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

    @PostMapping("/eventos/{eventoId}/ficha-jogo")
    @PreAuthorize("hasRole('ROLE_TREINADOR')")
    public ResponseEntity<FichaJogoDTO.Response> submeterFichaJogo(
            @PathVariable Long eventoId,
            @RequestBody @Valid FichaJogoDTO.Request request,
            @AuthenticationPrincipal Utilizador treinador) {
        if (!eventoId.equals(request.eventoId())) {
            throw new IllegalArgumentException("O ID do evento no path e no body devem coincidir");
        }
        Long submetidaPor = null;
        if (treinador != null) {
            submetidaPor = treinador.getId();
        }
        FichaJogoDTO.Response response = fichaJogoService.submeter(request, submetidaPor);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/eventos/{eventoId}/ficha-jogo")
    @PreAuthorize("hasAnyRole('ROLE_TREINADOR', 'ROLE_DIRETOR_TECNICO')")
    public ResponseEntity<FichaJogoDTO.Response> obterFichaJogo(@PathVariable Long eventoId) {
        try {
            FichaJogoDTO.Response response = fichaJogoService.obterPorEvento(eventoId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

