package com.sigd.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.sigd.config.JwtConfig;
import com.sigd.core.model.Utilizador;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JwtService — Geração e validação de JWT tokens.
 *
 * Usa jjwt 0.12.x API.
 * Claims: sub=username, role=user.role, iat, exp.
 * Signing key configurada via sigd.jwt.secret no application.yml.
 */
@Service
public class JwtService {

    private final JwtConfig jwtConfig;

    public JwtService(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    // ── Extraction ──────────────────────────────────────

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // ── Generation ──────────────────────────────────────

    /**
     * Gera access token com role claim para o Utilizador.
     * Duração: sigd.jwt.expiration (default: 1 hora).
     */
    public String generateAccessToken(Utilizador user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        return buildToken(claims, user, jwtConfig.getExpiration());
    }

    /**
     * Gera refresh token para o Utilizador.
     * Duração: sigd.jwt.refresh-expiration (default: 7 dias).
     */
    public String generateRefreshToken(Utilizador user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        return buildToken(claims, user, jwtConfig.getRefreshExpiration());
    }

    /**
     * Gera token genérico (mantido para compatibilidade).
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtConfig.getExpiration());
    }

    // ── Validation ──────────────────────────────────────

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    /**
     * Retorna o tempo de expiração do access token em ms.
     */
    public long getAccessTokenExpiration() {
        return jwtConfig.getExpiration();
    }

    // ── Private helpers ─────────────────────────────────

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        // If the secret is base64 encoded, decode it; otherwise use raw bytes
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(jwtConfig.getSecret());
        } catch (Exception e) {
            keyBytes = jwtConfig.getSecret().getBytes();
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
