package com.openclassrooms.mddapi.dto;

public class CreateCommentDto {

//    @NotBlank(message = "Le contenu du commentaire ne peut pas être vide")
    private String content;

//    @NotNull(message = "L'ID de l'article est requis")
    private Long postId;

    public CreateCommentDto() {}

    public CreateCommentDto(String content, Long postId) {
        this.content = content;
        this.postId = postId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

}
