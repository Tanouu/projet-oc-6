package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.CreatePostDto;
import com.openclassrooms.mddapi.dto.PostDto;
import com.openclassrooms.mddapi.dto.PostDtoDetails;
import com.openclassrooms.mddapi.dto.PostIdRequest;
import com.openclassrooms.mddapi.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public List<PostDto> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<PostDtoDetails> getPostDetails(@PathVariable Long id) {
        PostDtoDetails postDetails = postService.getPostDetailsById(id);
        return postDetails != null ? ResponseEntity.ok(postDetails) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestBody CreatePostDto createPostDto, Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        PostDto newPost = postService.addPost(createPostDto, authentication.getName());
        return ResponseEntity.ok(newPost);
    }
}
