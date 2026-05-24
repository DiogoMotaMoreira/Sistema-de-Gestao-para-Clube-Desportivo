package com.sigd;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class SigdApplicationTests {

    @Test
    void contextLoads() {
        // Verifica que o contexto Spring arranca sem erros
    }

}
