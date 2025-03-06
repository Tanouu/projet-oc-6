package com.openclassrooms.mddapi.dto;

public class SubscriptionResponseDto {
    private String message;

    public SubscriptionResponseDto(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
