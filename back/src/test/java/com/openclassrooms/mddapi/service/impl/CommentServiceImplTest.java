package com.openclassrooms.mddapi.service.impl;

import com.openclassrooms.mddapi.dto.CommentDto;
import com.openclassrooms.mddapi.dto.CreateCommentDto;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.repository.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import javax.persistence.EntityNotFoundException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CommentServiceImplTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private CommentServiceImpl commentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddComment_shouldSaveAndReturnCommentDto() {
        // Arrange
        CreateCommentDto dto = new CreateCommentDto("Ceci est un commentaire", 1L);

        User user = new User();
        user.setId(1L);
        user.setName("Ethan");

        Post post = new Post();
        post.setId(1L);
        post.setTitle("Titre du post");

        Comment commentToSave = new Comment();
        commentToSave.setContent(dto.getContent());
        commentToSave.setPost(post);
        commentToSave.setUser(user);

        Comment savedComment = new Comment();
        savedComment.setId(10L);
        savedComment.setContent(dto.getContent());
        savedComment.setUser(user);
        savedComment.setPost(post);

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(commentRepository.save(any(Comment.class))).thenReturn(savedComment);

        // Act
        CommentDto result = commentService.addComment(dto, user);

        // Assert
        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("Ceci est un commentaire", result.getContent());
        assertEquals("Ethan", result.getUserName());

        verify(postRepository).findById(1L);
        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void testAddComment_shouldThrowIfPostNotFound() {
        CreateCommentDto dto = new CreateCommentDto("Commentaire test", 999L);
        User user = new User();
        user.setName("Ethan");

        when(postRepository.findById(999L)).thenReturn(Optional.empty());

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () ->
                commentService.addComment(dto, user)
        );

        assertEquals("Post non trouvé avec l'ID: 999", exception.getMessage());
        verify(postRepository).findById(999L);
        verify(commentRepository, never()).save(any(Comment.class));
    }
}
