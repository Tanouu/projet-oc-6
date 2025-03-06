package com.openclassrooms.mddapi.dto;

public class SubscriptionDto {
    private Long topicId;

    public SubscriptionDto() {}

    public SubscriptionDto(Long topicId) {
        this.topicId = topicId;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }
}
