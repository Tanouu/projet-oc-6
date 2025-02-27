package com.openclassrooms.mddapi.dto;

public class CommentDto {
    private Long id;
    private String content;
    private UserDto user;

    public CommentDto() {
    }

    public CommentDto(Long id, String content, UserDto user) {
        this.id = id;
        this.content = content;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }
}
