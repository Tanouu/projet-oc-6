package com.openclassrooms.mddapi.service.impl;

import com.openclassrooms.mddapi.dto.CreatePostDto;
import com.openclassrooms.mddapi.dto.PostDto;
import com.openclassrooms.mddapi.dto.PostDtoDetails;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PostServiceImplTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TopicRepository topicRepository;

    @InjectMocks
    private PostServiceImpl postService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllPosts() {
        User user = new User();
        user.setName("Ethan");

        Topic topic = new Topic();
        topic.setName("Java");

        Post post = new Post();
        post.setId(1L);
        post.setTitle("Titre");
        post.setContent("Contenu");
        post.setCreatedAt(LocalDateTime.now());
        post.setUser(user);
        post.setTopic(topic);

        when(postRepository.findAllWithDetails()).thenReturn(List.of(post));

        List<PostDto> result = postService.getAllPosts();

        assertEquals(1, result.size());
        assertEquals("Titre", result.get(0).getTitle());
        verify(postRepository, times(1)).findAllWithDetails();
    }

    @Test
    void testGetPostDetailsById_found() {
        User user = new User();
        user.setName("Ethan");

        Topic topic = new Topic();
        topic.setName("Angular");

        Comment comment = new Comment();
        comment.setId(1L);
        comment.setContent("Super post !");
        comment.setUser(user);

        Post post = new Post();
        post.setId(1L);
        post.setTitle("Test");
        post.setContent("Contenu test");
        post.setCreatedAt(LocalDateTime.now());
        post.setUser(user);
        post.setTopic(topic);
        post.setComments(List.of(comment));

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));

        PostDtoDetails result = postService.getPostDetailsById(1L);

        assertNotNull(result);
        assertEquals("Test", result.getTitle());
        assertEquals("Ethan", result.getUserName());
        assertEquals("Angular", result.getTopicName());
        assertEquals(1, result.getComments().size());

        verify(postRepository, times(1)).findById(1L);
    }

    @Test
    void testGetPostDetailsById_notFound() {
        when(postRepository.findById(999L)).thenReturn(Optional.empty());

        PostDtoDetails result = postService.getPostDetailsById(999L);

        assertNull(result);
        verify(postRepository, times(1)).findById(999L);
    }

    @Test
    void testAddPost_success() {
        String email = "ethan@mail.com";

        User user = new User();
        user.setId(1L);
        user.setName("Ethan");
        user.setEmail(email);

        Topic topic = new Topic();
        topic.setId(1L);
        topic.setName("Java");

        CreatePostDto createPostDto = new CreatePostDto();
        createPostDto.setTitle("Nouveau post");
        createPostDto.setContent("Contenu du post");
        createPostDto.setTopicId(1L);

        Post postToSave = new Post();
        postToSave.setTitle(createPostDto.getTitle());
        postToSave.setContent(createPostDto.getContent());
        postToSave.setUser(user);
        postToSave.setTopic(topic);

        Post savedPost = new Post();
        savedPost.setId(1L);
        savedPost.setTitle("Nouveau post");
        savedPost.setContent("Contenu du post");
        savedPost.setCreatedAt(LocalDateTime.now());
        savedPost.setUser(user);
        savedPost.setTopic(topic);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(topicRepository.findById(1L)).thenReturn(Optional.of(topic));
        when(postRepository.save(any(Post.class))).thenReturn(savedPost);

        PostDto result = postService.addPost(createPostDto, email);

        assertNotNull(result);
        assertEquals("Nouveau post", result.getTitle());
        assertEquals("Ethan", result.getUserName());

        verify(userRepository, times(1)).findByEmail(email);
        verify(topicRepository, times(1)).findById(1L);
        verify(postRepository, times(1)).save(any(Post.class));
    }

    @Test
    void testAddPost_userNotFound() {
        when(userRepository.findByEmail("notfound@mail.com")).thenReturn(Optional.empty());

        CreatePostDto dto = new CreatePostDto();
        dto.setTopicId(1L);
        dto.setTitle("Titre");
        dto.setContent("Contenu");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postService.addPost(dto, "notfound@mail.com");
        });

        assertEquals("Utilisateur non trouvé", exception.getMessage());
    }

    @Test
    void testAddPost_topicNotFound() {
        User user = new User();
        user.setEmail("ethan@mail.com");

        CreatePostDto dto = new CreatePostDto();
        dto.setTopicId(999L);
        dto.setTitle("Titre");
        dto.setContent("Contenu");

        when(userRepository.findByEmail("ethan@mail.com")).thenReturn(Optional.of(user));
        when(topicRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            postService.addPost(dto, "ethan@mail.com");
        });

        assertEquals("Thème non trouvé", exception.getMessage());
    }
}
