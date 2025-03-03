package com.openclassrooms.mddapi.service.impl;
import com.openclassrooms.mddapi.dto.*;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.service.PostService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;

    public PostServiceImpl(PostRepository postRepository, UserRepository userRepository, TopicRepository topicRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
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

    @Override
    public PostDto addPost(CreatePostDto createPostDto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Topic topic = topicRepository.findById(createPostDto.getTopicId())
                .orElseThrow(() -> new RuntimeException("Thème non trouvé"));

        Post post = new Post();
        post.setTitle(createPostDto.getTitle());
        post.setContent(createPostDto.getContent());
        post.setUser(user);
        post.setTopic(topic);

        Post savedPost = postRepository.save(post);
        return convertToDTO(savedPost);
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
