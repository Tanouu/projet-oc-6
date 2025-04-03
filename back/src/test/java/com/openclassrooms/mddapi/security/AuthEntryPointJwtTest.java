package com.openclassrooms.mddapi.security;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.AuthenticationException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

import static org.mockito.Mockito.*;

class AuthEntryPointJwtTest {

    @Test
    void testCommence_shouldSendUnauthorizedError() throws IOException, ServletException {
        {
            // Arrange
            AuthEntryPointJwt authEntryPointJwt = new AuthEntryPointJwt();

            HttpServletRequest request = mock(HttpServletRequest.class);
            HttpServletResponse response = mock(HttpServletResponse.class);
            AuthenticationException authException = mock(AuthenticationException.class);

            when(request.getRequestURI()).thenReturn("/api/test");
            when(authException.getMessage()).thenReturn("Access denied");

            // Act
            authEntryPointJwt.commence(request, response, authException);

            // Assert
            verify(response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: Unauthorized");
        }
    }
}
