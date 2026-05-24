package com.sigd.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "sigd.jwt")
@Getter
@Setter
public class JwtConfig {

    private String secret;
    private long expiration = 3600000;        // 1 hora
    private long refreshExpiration = 604800000; // 7 dias

}
