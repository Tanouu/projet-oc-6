package com.openclassrooms.mddapi.security;

import com.openclassrooms.mddapi.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Collections;

import static org.mockito.Mockito.*;

class JwtAuthFilterTest {

    @InjectMocks
    private JwtAuthFilter jwtAuthFilter;

    @Mock
    private JwtGenerator jwtGenerator;

    @Mock
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testDoFilterInternal_withValidToken_shouldSetAuthentication() throws ServletException, IOException {
        // Arrange
        String token = "valid.jwt.token";
        String username = "ethan";

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + token);
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        UserDetails userDetails = new User(username, "password", Collections.emptyList());

        when(jwtGenerator.validateToken(token)).thenReturn(true);
        when(jwtGenerator.getUsernameFromJWT(token)).thenReturn(username);
        when(authService.loadUserByUsername(username)).thenReturn(userDetails);

        // Act
        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        // Assert → on ne vérifie pas le contexte ici, mais que les méthodes ont été bien appelées
        verify(jwtGenerator).validateToken(token);
        verify(jwtGenerator).getUsernameFromJWT(token);
        verify(authService).loadUserByUsername(username);
    }

    @Test
    void testDoFilterInternal_withNoToken_shouldContinueFilterChain() throws ServletException, IOException {
        // Arrange
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = spy(new MockFilterChain());

        // Act
        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verifyNoInteractions(jwtGenerator, authService);
    }

    @Test
    void testDoFilterInternal_withInvalidToken_shouldNotSetAuth() throws ServletException, IOException {
        // Arrange
        String token = "invalid.token";
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + token);
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = spy(new MockFilterChain());

        when(jwtGenerator.validateToken(token)).thenReturn(false);

        // Act
        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(jwtGenerator).validateToken(token);
        verify(jwtGenerator, never()).getUsernameFromJWT(any());
        verify(authService, never()).loadUserByUsername(any());
    }
}
