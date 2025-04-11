package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.*;
import com.openclassrooms.mddapi.service.PostService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PostController.class)
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PostService postService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllPosts_shouldReturnList() throws Exception {
        List<PostDto> postList = List.of(
                new PostDto(1L, "Post 1", "Contenu 1", "2024-01-01T10:00", "Ethan"),
                new PostDto(2L, "Post 2", "Contenu 2", "2024-01-02T11:00", "Kat")
        );

        when(postService.getAllPosts()).thenReturn(postList);

        mockMvc.perform(get("/api/posts")
                        .with(user("ethan@mail.com").roles("USER"))) // 🔐 ajoute utilisateur
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Post 1"))
                .andExpect(jsonPath("$[1].userName").value("Kat"));
    }

    @Test
    void testGetPostDetails_shouldReturnPostDetails() throws Exception {
        PostDtoDetails postDetails = new PostDtoDetails(
                1L,
                "Post Titre",
                "Contenu du post",
                "2024-04-03T14:00",
                "Ethan",
                "Développement",
                List.of()
        );

        when(postService.getPostDetailsById(1L)).thenReturn(postDetails);

        mockMvc.perform(get("/api/posts/details/1")
                        .with(user("ethan@mail.com").roles("USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Post Titre"))
                .andExpect(jsonPath("$.topicName").value("Développement"));
    }

    @Test
    void testCreatePost_shouldReturnPostDto() throws Exception {
        String email = "ethan@mail.com";

        CreatePostDto createPostDto = new CreatePostDto("Titre", "Contenu", 1L);
        PostDto expectedPostDto = new PostDto(1L, "Titre", "Contenu", "2025-04-03T12:00:00", "Ethan");

        when(postService.addPost(any(CreatePostDto.class), eq(email)))
                .thenReturn(expectedPostDto);

        mockMvc.perform(post("/api/posts")
                        .with(user(email).roles("USER")) // 🔐 utilisateur simulé
                        .with(csrf()) // ✅ token CSRF obligatoire
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createPostDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(expectedPostDto.getId()))
                .andExpect(jsonPath("$.title").value(expectedPostDto.getTitle()))
                .andExpect(jsonPath("$.content").value(expectedPostDto.getContent()))
                .andExpect(jsonPath("$.userName").value(expectedPostDto.getUserName()));
    }
}
