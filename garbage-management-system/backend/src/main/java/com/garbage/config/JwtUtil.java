package com.garbage.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

/**
 * JwtUtil: Handles JWT token creation, validation, and parsing.
 * JWT = JSON Web Token — a compact, self-contained token for authentication.
 *
 * How it works:
 * 1. User logs in → server creates a signed JWT with user info
 * 2. Client stores the token and sends it in every API request header
 * 3. Server validates the token on each request
 */
@Component
public class JwtUtil {

    // Read secret and expiration from application.properties
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpirationMs;

    // Build the signing key from our secret string
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Generate a JWT token for a user.
     * @param email - The user's email (used as subject)
     * @param role  - The user's role (USER/ADMIN) stored in token claims
     * @param userId - The user's database ID stored in claims
     * @return Signed JWT token string
     */
    public String generateToken(String email, String role, Long userId) {
        return Jwts.builder()
                .setSubject(email)                      // Who this token is for
                .claim("role", role)                    // Custom claim: user role
                .claim("userId", userId)                // Custom claim: user ID
                .setIssuedAt(new Date())                // When token was issued
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs)) // Expiry
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Sign with our secret
                .compact();
    }

    /**
     * Extract the email (subject) from a token.
     */
    public String getEmailFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Extract the role from the token.
     */
    public String getRoleFromToken(String token) {
        return (String) parseClaims(token).get("role");
    }

    /**
     * Extract the userId from the token.
     */
    public Long getUserIdFromToken(String token) {
        return ((Number) parseClaims(token).get("userId")).longValue();
    }

    /**
     * Validate the token - checks signature and expiration.
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token); // If parsing succeeds, token is valid
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false; // Token invalid or expired
        }
    }

    // Helper: parse and return all claims from token
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
