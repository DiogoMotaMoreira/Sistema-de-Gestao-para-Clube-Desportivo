package com.sigd;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class SmokeTest {

    @Test
    void contextLoads() {
        // Apenas verifica que o contexto Spring arranca sem erros
    }
}
