package com.sigd.admin.service;

import com.sigd.admin.dto.UtilizadorAdminDTO;
import com.sigd.admin.exception.UtilizadorJaExisteException;
import com.sigd.core.model.Utilizador;
import com.sigd.core.repository.UtilizadorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UtilizadorAdminServiceTest {

    @Mock
    private UtilizadorRepository utilizadorRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UtilizadorAdminService service;

    private UtilizadorAdminDTO.Request request;
    private Utilizador utilizador;

    @BeforeEach
    void setUp() {
        request = new UtilizadorAdminDTO.Request("joao_admin", "joao@admin.pt", "ROLE_ADMIN", null);
        
        utilizador = new Utilizador();
        utilizador.setId(1L);
        utilizador.setUsername("joao_admin");
        utilizador.setEmail("joao@admin.pt");
        utilizador.setRole("ROLE_ADMIN");
        utilizador.setPasswordHash("encoded_password");
        utilizador.setAtivo(true);
        utilizador.setCriadoEm(LocalDateTime.now());
        utilizador.setAtualizadoEm(LocalDateTime.now());
    }

    @Test
    void testCriarUtilizadorComSucesso() {
        when(utilizadorRepository.existsByUsername("joao_admin")).thenReturn(false);
        when(utilizadorRepository.existsByEmail("joao@admin.pt")).thenReturn(false);
        when(passwordEncoder.encode("Sigd@2025")).thenReturn("encoded_password");
        when(utilizadorRepository.save(any(Utilizador.class))).thenReturn(utilizador);

        UtilizadorAdminDTO.Response response = service.criar(request);

        assertNotNull(response);
        assertEquals("joao_admin", response.username());
        assertEquals("ROLE_ADMIN", response.role());
        assertTrue(response.ativo());

        verify(utilizadorRepository, times(1)).save(any(Utilizador.class));
    }

    @Test
    void testCriarUtilizadorDuplicado_lancaExcecao() {
        when(utilizadorRepository.existsByUsername("joao_admin")).thenReturn(true);

        assertThrows(UtilizadorJaExisteException.class, () -> service.criar(request));

        verify(utilizadorRepository, never()).save(any(Utilizador.class));
    }

    @Test
    void testBloquearUtilizador() {
        when(utilizadorRepository.findById(1L)).thenReturn(Optional.of(utilizador));
        
        Utilizador bloqueado = new Utilizador();
        bloqueado.setId(1L);
        bloqueado.setAtivo(false);
        when(utilizadorRepository.save(any(Utilizador.class))).thenReturn(bloqueado);

        UtilizadorAdminDTO.Response response = service.bloquear(1L);

        assertFalse(response.ativo());
        verify(utilizadorRepository, times(1)).save(any(Utilizador.class));
    }
}
