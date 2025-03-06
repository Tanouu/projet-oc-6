package com.openclassrooms.mddapi.dto;

import java.util.List;

public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private List<TopicDto> subscriptions;

    public UserProfileDto(Long id, String name, String email, List<TopicDto> subscriptions) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.subscriptions = subscriptions;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<TopicDto> getSubscriptions() {
        return subscriptions;
    }

    public void setSubscriptions(List<TopicDto> subscriptions) {
        this.subscriptions = subscriptions;
    }
}
