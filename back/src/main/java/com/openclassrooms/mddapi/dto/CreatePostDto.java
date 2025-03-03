package com.openclassrooms.mddapi.dto;

public class CreatePostDto {
    private String title;
    private String content;
    private Long topicId;

    public CreatePostDto() {}

    public CreatePostDto(String title, String content, Long topicId) {
        this.title = title;
        this.content = content;
        this.topicId = topicId;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getTopicId() { return topicId; }
    public void setTopicId(Long topicId) { this.topicId = topicId; }
}
