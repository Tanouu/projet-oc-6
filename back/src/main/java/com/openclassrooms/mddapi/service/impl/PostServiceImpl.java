package com.openclassrooms.mddapi.service.impl;
import com.openclassrooms.mddapi.dto.CommentDto;
import com.openclassrooms.mddapi.dto.PostDto;
import com.openclassrooms.mddapi.dto.TopicDto;
import com.openclassrooms.mddapi.dto.UserDto;
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

    public List<PostDto> getAllPosts() {
        List<Post> posts = postRepository.findAllWithDetails();
        return posts.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private PostDto convertToDTO(Post post) {
        return new PostDto(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCreatedAt().toString(),
                new UserDto(post.getUser().getId(), post.getUser().getName(), post.getUser().getEmail()),
                new TopicDto(post.getTopic().getId(), post.getTopic().getName(), post.getTopic().getDescription()),
                post.getComments().stream().map(c -> new CommentDto(c.getId(), c.getContent(),
                        new UserDto(c.getUser().getId(), c.getUser().getName(), c.getUser().getEmail()))).collect(Collectors.toList())
        );
    }

}
