package com.openclassrooms.mddapi.security;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class JwtGeneratorTest {

    private JwtGenerator jwtGenerator;
    private String secretKey;

    @BeforeEach
    void setUp() {
        // ✅ Génère une clé suffisamment forte pour HS512
        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        String base64Key = Base64.getEncoder().encodeToString(key.getEncoded());

        jwtGenerator = new JwtGenerator(base64Key);
    }


    @Test
    void testGenerateAndValidateToken_shouldReturnValidToken() {
        Authentication auth = Mockito.mock(Authentication.class);
        Mockito.when(auth.getName()).thenReturn("ethan");

        String token = jwtGenerator.generateToken(auth);
        assertNotNull(token);

        assertTrue(jwtGenerator.validateToken(token));
    }

    @Test
    void testGetUsernameFromJWT_shouldReturnCorrectUsername() {
        Authentication auth = Mockito.mock(Authentication.class);
        Mockito.when(auth.getName()).thenReturn("ethan");

        String token = jwtGenerator.generateToken(auth);
        String username = jwtGenerator.getUsernameFromJWT(token);

        assertEquals("ethan", username);
    }

    @Test
    void testValidateToken_shouldThrowExceptionIfInvalid() {
        String invalidToken = "bad.token.value";

        Exception ex = assertThrows(Exception.class, () -> {
            jwtGenerator.validateToken(invalidToken);
        });

        assertTrue(ex.getMessage().contains("JWT was expired or incorrect"));
    }
}
