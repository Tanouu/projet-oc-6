package com.openclassrooms.mddapi.service.impl;

import com.openclassrooms.mddapi.dto.RegisterDto;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.AuthRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {

    @Mock
    private AuthRepository authRepository;

    @InjectMocks
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterNewUser_shouldSaveAndReturnUser() {
        RegisterDto dto = new RegisterDto("ethan@mail.com", "Ethan", "password123");

        User userToSave = new User();
        userToSave.setEmail(dto.getEmail());
        userToSave.setName(dto.getName());
        userToSave.setPassword(dto.getPassword());

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setEmail(dto.getEmail());
        savedUser.setName(dto.getName());
        savedUser.setPassword(dto.getPassword());

        when(authRepository.save(any(User.class))).thenReturn(savedUser);

        User result = authService.registerNewUser(dto);

        assertNotNull(result);
        assertEquals(dto.getEmail(), result.getEmail());
        assertEquals(dto.getName(), result.getName());
        assertEquals(dto.getPassword(), result.getPassword());

        verify(authRepository, times(1)).save(any(User.class));
    }

    @Test
    void testFindUserByEmail_shouldReturnUserIfFound() {
        User user = new User();
        user.setEmail("ethan@mail.com");
        user.setName("Ethan");

        when(authRepository.findByEmail("ethan@mail.com")).thenReturn(Optional.of(user));

        User result = authService.findUserByEmail("ethan@mail.com");

        assertNotNull(result);
        assertEquals("Ethan", result.getName());
        verify(authRepository, times(1)).findByEmail("ethan@mail.com");
    }

    @Test
    void testFindUserByEmail_shouldThrowIfNotFound() {
        when(authRepository.findByEmail("unknown@mail.com")).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                authService.findUserByEmail("unknown@mail.com")
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatus());
        assertEquals("User not found", exception.getReason());
    }

    @Test
    void testLoadUserByUsername_shouldReturnUserDetails() {
        User user = new User();
        user.setEmail("ethan@mail.com");
        user.setPassword("password123");

        when(authRepository.findByEmail("ethan@mail.com")).thenReturn(Optional.of(user));

        UserDetails userDetails = authService.loadUserByUsername("ethan@mail.com");

        assertNotNull(userDetails);
        assertEquals("ethan@mail.com", userDetails.getUsername());
        assertEquals("password123", userDetails.getPassword());
    }

    @Test
    void testLoadUserByUsername_shouldThrowIfNotFound() {
        when(authRepository.findByEmail("ghost@mail.com")).thenReturn(Optional.empty());

        UsernameNotFoundException exception = assertThrows(UsernameNotFoundException.class, () ->
                authService.loadUserByUsername("ghost@mail.com")
        );

        assertEquals("User not found with email: ghost@mail.com", exception.getMessage());
    }
}
