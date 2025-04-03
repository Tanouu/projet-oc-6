package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.CommentDto;
import com.openclassrooms.mddapi.dto.CreateCommentDto;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.service.CommentService;
import com.openclassrooms.mddapi.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CommentController.class)
@AutoConfigureMockMvc(addFilters = false)
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CommentService commentService;

    @MockBean
    private UserService userService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        objectMapper = new ObjectMapper();
    }

    @Test
    void testAddComment_shouldReturnCommentDto() throws Exception {
        // Arrange
        CreateCommentDto createCommentDto = new CreateCommentDto("Super article !", 1L);
        CommentDto expectedCommentDto = new CommentDto(1L, "Super article !", "Ethan");

        User mockUser = new User();
        mockUser.setEmail("ethan@mail.com");

        when(userService.findUserByEmail("ethan@mail.com")).thenReturn(mockUser);
        when(commentService.addComment(any(CreateCommentDto.class), eq(mockUser))).thenReturn(expectedCommentDto);

        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("ethan@mail.com");

        // Act & Assert
        mockMvc.perform(post("/api/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createCommentDto))
                        .principal(authentication)) // 👈 ici on passe un mock Authentication
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.content").value("Super article !"))
                .andExpect(jsonPath("$.userName").value("Ethan"));
    }


    @Test
    void testAddComment_withoutAuth_shouldReturn401() throws Exception {
        CreateCommentDto requestDto = new CreateCommentDto("Test", 1L);

        mockMvc.perform(post("/api/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isUnauthorized());
    }
}
