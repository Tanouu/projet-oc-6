package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.CommentDto;
import com.openclassrooms.mddapi.dto.CreateCommentDto;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.User;

public interface CommentService {
    CommentDto addComment(CreateCommentDto createCommentDto, User user);
}
