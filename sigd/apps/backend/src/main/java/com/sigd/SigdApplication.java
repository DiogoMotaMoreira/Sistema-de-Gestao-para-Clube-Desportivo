package com.sigd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // Para cron jobs (alertas EMD, fecho fichas)
public class SigdApplication {

    public static void main(String[] args) {
        SpringApplication.run(SigdApplication.class, args);
    }

}
