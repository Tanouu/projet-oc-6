package com.openclassrooms.mddapi.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;


@Component
public class JwtGenerator {

  private final Key key;

  public JwtGenerator(@Value("${jwt.secret-key}") String secretKey) {
    this.key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretKey));
  }

  public String generateToken(Authentication authentication) {
    String username = authentication.getName();
    Date currentDate = new Date();
    Date expireDate = new Date(currentDate.getTime() + SecurityConstants.JWT_EXPIRATION);

    return Jwts.builder()
      .setSubject(username)
      .setIssuedAt(new Date())
      .setExpiration(expireDate)
      .signWith(key, SignatureAlgorithm.HS512)
      .compact();
  }

  public String getUsernameFromJWT(String token) {
    Claims claims = Jwts.parserBuilder()
      .setSigningKey(key)
      .build()
      .parseClaimsJws(token)
      .getBody();
    return claims.getSubject();
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token);
      return true;
    } catch (Exception ex) {
      throw new AuthenticationCredentialsNotFoundException("JWT was expired or incorrect", ex);
    }
  }
}
