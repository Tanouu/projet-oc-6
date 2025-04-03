package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.JwtResponseDto;
import com.openclassrooms.mddapi.dto.LoginDto;
import com.openclassrooms.mddapi.dto.RegisterDto;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.security.JwtGenerator;
import com.openclassrooms.mddapi.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtGenerator jwtGenerator;

    @MockBean
    private PasswordEncoder passwordEncoder;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        objectMapper = new ObjectMapper();
    }

    @Test
    void testRegisterNewUser_shouldReturnJwtToken() throws Exception {
        RegisterDto dto = new RegisterDto("ethan@mail.com", "Ethan", "Password@123");
        User mockUser = new User();
        mockUser.setEmail("ethan@mail.com");

        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(authService.registerNewUser(any())).thenReturn(mockUser);
        when(jwtGenerator.generateToken(any())).thenReturn("mocked.jwt.token");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mocked.jwt.token"));
    }

    @Test
    void testLoginUser_shouldReturnJwtToken() throws Exception {
        LoginDto loginDto = new LoginDto("ethan@mail.com", "Password@123");
        User mockUser = new User();
        mockUser.setEmail("ethan@mail.com");

        when(authService.findUserByEmail("ethan@mail.com")).thenReturn(mockUser);
        when(jwtGenerator.generateToken(any())).thenReturn("mocked.jwt.token");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mocked.jwt.token"));
    }
}
