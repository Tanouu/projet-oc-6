package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.PostDto;
import com.openclassrooms.mddapi.dto.PostDtoDetails;
import com.openclassrooms.mddapi.dto.PostIdRequest;
import com.openclassrooms.mddapi.service.PostService;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/details")
    public ResponseEntity<PostDtoDetails> getPostDetails(@RequestBody PostIdRequest request) {
        PostDtoDetails postDetails = postService.getPostDetailsById(request.getPostId());
        return postDetails != null ? ResponseEntity.ok(postDetails) : ResponseEntity.notFound().build();
    }
}
