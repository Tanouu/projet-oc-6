package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.PostDto;
import com.openclassrooms.mddapi.dto.PostDtoDetails;

import java.util.List;

public interface PostService {
    List<PostDto> getAllPosts();
    PostDtoDetails getPostDetailsById(Long postId);
}
