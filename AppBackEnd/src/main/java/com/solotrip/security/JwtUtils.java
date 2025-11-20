package com.solotrip.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@Slf4j
public class JwtUtils {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private int jwtExpirationMs;
    
    // Cambio 1: Retornar SecretKey explícitamente
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        
        return Jwts.builder()
            // Cambio 2: 'setSubject' ahora es 'subject'
            .subject(userPrincipal.getUsername())
            // Cambio 3: 'setIssuedAt' ahora es 'issuedAt'
            .issuedAt(new Date())
            // Cambio 4: 'setExpiration' ahora es 'expiration'
            .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
            // Cambio 5: Sintaxis de firma actualizada
            .signWith(getSigningKey(), Jwts.SIG.HS512)
            .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        // Cambio 6: 'parserBuilder' eliminado. Usar 'parser().verifyWith(...)'
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token) // Cambio 7: 'parseClaimsJws' ahora es 'parseSignedClaims'
            .getPayload()             // Cambio 8: 'getBody' ahora es 'getPayload'
            .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(authToken);
            return true;
        } catch (MalformedJwtException e) {
            log.error("Token JWT inválido: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("Token JWT expirado: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("Token JWT no soportado: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string está vacío: {}", e.getMessage());
        } catch (Exception e) {
            log.error("Error al validar token: {}", e.getMessage());
        }
        return false;
    }
}