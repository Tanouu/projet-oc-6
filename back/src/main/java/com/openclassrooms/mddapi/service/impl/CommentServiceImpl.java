package com.openclassrooms.mddapi.service.impl;

import com.openclassrooms.mddapi.dto.CommentDto;
import com.openclassrooms.mddapi.dto.CreateCommentDto;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.service.CommentService;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public CommentServiceImpl(CommentRepository commentRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    @Override
    @Transactional
    public CommentDto addComment(CreateCommentDto createCommentDto, User user) {
        // Récupération du post
        Post post = postRepository.findById(createCommentDto.getPostId())
                .orElseThrow(() -> new EntityNotFoundException("Post non trouvé avec l'ID: " + createCommentDto.getPostId()));

        // Création du commentaire
        Comment comment = new Comment();
        comment.setContent(createCommentDto.getContent());
        comment.setUser(user);
        comment.setPost(post);

        // Sauvegarde en base
        comment = commentRepository.save(comment);

        // Convertir en DTO avant de retourner
        return convertToDto(comment);
    }

    private CommentDto convertToDto(Comment comment) {
        return new CommentDto(
                comment.getId(),
                comment.getContent(),
                comment.getUser().getName() // ✅ Retourne uniquement le nom de l’utilisateur pour éviter la récursion
        );
    }
}
