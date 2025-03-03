package com.openclassrooms.mddapi.service.impl;
import com.openclassrooms.mddapi.dto.*;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.service.PostService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    public PostServiceImpl(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public List<PostDto> getAllPosts() {
        List<Post> posts = postRepository.findAllWithDetails();
        return posts.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public PostDtoDetails getPostDetailsById(Long postId) {
        return postRepository.findById(postId)
                .map(this::convertToDetailsDTO)
                .orElse(null);
    }

    private PostDto convertToDTO(Post post) {
        return new PostDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCreatedAt().toString(),
                post.getUser().getName()
        );
    }

    private PostDtoDetails convertToDetailsDTO(Post post) {
        List<CommentDto> commentDtos = post.getComments().stream()
                .map(c -> new CommentDto(c.getId(), c.getContent(), c.getUser().getName()))
                .collect(Collectors.toList());

        return new PostDtoDetails(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCreatedAt().toString(),
                post.getUser().getName(),
                post.getTopic().getName(),
                commentDtos
        );
    }

}
