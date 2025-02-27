package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.PostDto;

import java.util.List;

public interface PostService {
    List<PostDto> getAllPosts();
}
