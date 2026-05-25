package com.sigd.admin.controller;

import com.sigd.admin.dto.EpocaDesportivaDTO;
import com.sigd.admin.service.EpocaDesportivaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/epocas")
@PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_SECRETARIA')")
public class EpocaDesportivaController {

    private final EpocaDesportivaService service;

    public EpocaDesportivaController(EpocaDesportivaService service) {
        this.service = service;
    }

    @GetMapping
    public List<EpocaDesportivaDTO.Response> listar() {
        return service.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EpocaDesportivaDTO.Response criar(@RequestBody @Valid EpocaDesportivaDTO.Request request) {
        return service.criar(request);
    }

    @PutMapping("/{id}/ativar")
    public EpocaDesportivaDTO.Response ativar(@PathVariable Long id) {
        return service.ativar(id);
    }
}
