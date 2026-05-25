package com.sigd.admin.controller;

import com.sigd.admin.dto.UtilizadorAdminDTO;
import com.sigd.admin.service.UtilizadorAdminService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class UtilizadorAdminController {

    private final UtilizadorAdminService service;

    public UtilizadorAdminController(UtilizadorAdminService service) {
        this.service = service;
    }

    @GetMapping("/utilizadores")
    public Page<UtilizadorAdminDTO.Response> listar(
            @RequestParam(required = false) String pesquisa,
            @PageableDefault(size = 10) Pageable pageable) {
        return service.listar(pesquisa, pageable);
    }

    @PostMapping("/utilizadores")
    @ResponseStatus(HttpStatus.CREATED)
    public UtilizadorAdminDTO.Response criar(@RequestBody @Valid UtilizadorAdminDTO.Request request) {
        return service.criar(request);
    }

    @PutMapping("/utilizadores/{id}/bloquear")
    public UtilizadorAdminDTO.Response bloquear(@PathVariable Long id) {
        return service.bloquear(id);
    }

    @PutMapping("/utilizadores/{id}/reativar")
    public UtilizadorAdminDTO.Response reativar(@PathVariable Long id) {
        return service.reativar(id);
    }

    @GetMapping("/audit-log")
    public Page<Map<String, Object>> auditLog(@PageableDefault(size = 20) Pageable pageable) {
        // Mock audit log for now as requested
        return Page.empty(pageable);
    }
}
