package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.UserDto;
import com.openclassrooms.mddapi.dto.UserProfileDto;
import com.openclassrooms.mddapi.dto.UserUpdateDto;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetUserProfile_shouldReturnUserDto() throws Exception {
        String email = "ethan@mail.com";
        User user = new User(); // Supposons que tu as une entité User
        user.setEmail(email);

        UserDto userDto = new UserDto(1L, "Ethan", email);

        when(userService.findUserByEmail(email)).thenReturn(user);
        when(userService.getUserDto(user)).thenReturn(userDto);

        mockMvc.perform(get("/api/user/me")
                        .with(user(email).roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Ethan"))
                .andExpect(jsonPath("$.email").value(email));
    }

    @Test
    void testGetUserFullProfile_shouldReturnUserProfileDto() throws Exception {
        String email = "ethan@mail.com";
        UserProfileDto profileDto = new UserProfileDto(1L, "Ethan", email, List.of());

        when(userService.getUserProfile(email)).thenReturn(profileDto);

        mockMvc.perform(get("/api/user/profile")
                        .with(user(email).roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Ethan"))
                .andExpect(jsonPath("$.email").value(email));
    }

    @Test
    void testUpdateProfile_shouldReturnUpdatedUserDto() throws Exception {
        String email = "ethan@mail.com";
        UserUpdateDto updateDto = new UserUpdateDto("Ethan Modifié", email, "newpass");
        UserDto updatedDto = new UserDto(1L, "Ethan Modifié", email);

        when(userService.updateUser(eq(email), any(UserUpdateDto.class))).thenReturn(updatedDto);

        mockMvc.perform(put("/api/user/me")
                        .with(user(email).roles("USER"))
                        .with(csrf()) // ✅ Ajouté ici
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Ethan Modifié"))
                .andExpect(jsonPath("$.email").value(email));
    }

}
