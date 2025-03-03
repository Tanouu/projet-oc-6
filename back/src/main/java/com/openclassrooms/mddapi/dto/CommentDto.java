package com.openclassrooms.mddapi.dto;

public class CommentDto {
    private Long id;
    private String content;
    private String userName;

    public CommentDto() {
    }

    public CommentDto(Long id, String content, String userName) {
        this.id = id;
        this.content = content;
        this.userName = userName;
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
