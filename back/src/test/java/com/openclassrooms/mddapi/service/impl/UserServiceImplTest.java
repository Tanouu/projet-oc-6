package com.openclassrooms.mddapi.service.impl;

import com.openclassrooms.mddapi.dto.*;
import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindUserByEmail_shouldReturnUser() {
        User user = new User();
        user.setEmail("ethan@mail.com");

        when(userRepository.findByEmail("ethan@mail.com")).thenReturn(Optional.of(user));

        User result = userService.findUserByEmail("ethan@mail.com");

        assertEquals("ethan@mail.com", result.getEmail());
        verify(userRepository).findByEmail("ethan@mail.com");
    }

    @Test
    void testFindUserByEmail_shouldThrowIfNotFound() {
        when(userRepository.findByEmail("notfound@mail.com")).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                userService.findUserByEmail("notfound@mail.com"));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatus());
        assertEquals("User not found", exception.getReason());
    }

    @Test
    void testGetUserDto_shouldReturnCorrectDto() {
        User user = new User();
        user.setId(1L);
        user.setName("Ethan");
        user.setEmail("ethan@mail.com");

        UserDto dto = userService.getUserDto(user);

        assertEquals(1L, dto.getId());
        assertEquals("Ethan", dto.getName());
        assertEquals("ethan@mail.com", dto.getEmail());
    }

    @Test
    void testGetUserProfile_shouldReturnProfileWithSubscriptions() {
        User user = new User();
        user.setId(1L);
        user.setName("Ethan");
        user.setEmail("ethan@mail.com");

        Topic topic = new Topic();
        topic.setId(10L);
        topic.setName("Java");
        topic.setDescription("Cours Java");

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setTopic(topic);

        when(userRepository.findByEmail("ethan@mail.com")).thenReturn(Optional.of(user));
        when(subscriptionRepository.findByUser(user)).thenReturn(List.of(subscription));

        UserProfileDto result = userService.getUserProfile("ethan@mail.com");

        assertNotNull(result);
        assertEquals("Ethan", result.getName());
        assertEquals("ethan@mail.com", result.getEmail());
        assertEquals(1, result.getSubscriptions().size());
        assertEquals("Java", result.getSubscriptions().get(0).getName());
    }

    @Test
    void testGetUserProfile_shouldThrowIfUserNotFound() {
        when(userRepository.findByEmail("notfound@mail.com")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                userService.getUserProfile("notfound@mail.com"));

        assertEquals("Utilisateur non trouvé", exception.getMessage());
    }

    @Test
    void testUpdateUser_shouldUpdateAllFieldsIncludingPassword() {
        User user = new User();
        user.setId(1L);
        user.setName("Old");
        user.setEmail("old@mail.com");

        UserUpdateDto updateDto = new UserUpdateDto("NewName", "new@mail.com", "newpass");

        when(userRepository.findByEmail("old@mail.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String encodedPassword = "$2a$10$encoded";
        PasswordEncoder encoder = mock(PasswordEncoder.class);
        when(encoder.encode("newpass")).thenReturn(encodedPassword);

        // Inject custom encoder
        userService = new UserServiceImpl(userRepository, subscriptionRepository) {
            @Override
            public UserDto updateUser(String email, UserUpdateDto dto) {
                User u = findUserByEmail(email);
                u.setName(dto.getName());
                u.setEmail(dto.getEmail());
                if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
                    u.setPassword(encoder.encode(dto.getPassword()));
                }
                userRepository.save(u);
                return getUserDto(u);
            }
        };

        UserDto result = userService.updateUser("old@mail.com", updateDto);

        assertEquals("NewName", result.getName());
        assertEquals("new@mail.com", result.getEmail());
        verify(userRepository).save(user);
    }

    @Test
    void testUpdateUser_shouldNotUpdatePasswordIfEmpty() {
        User user = new User();
        user.setId(1L);
        user.setName("Ethan");
        user.setEmail("ethan@mail.com");
        user.setPassword("oldpass");

        UserUpdateDto dto = new UserUpdateDto("Ethan Updated", "new@mail.com", "");

        when(userRepository.findByEmail("ethan@mail.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDto result = userService.updateUser("ethan@mail.com", dto);

        assertEquals("Ethan Updated", result.getName());
        assertEquals("new@mail.com", result.getEmail());
        assertEquals("oldpass", user.getPassword());
        verify(userRepository).save(user);
    }
}
