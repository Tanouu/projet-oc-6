package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.SubscriptionDto;

public interface SubscriptionService {
    void subscribeToTopic(String userEmail, SubscriptionDto subscriptionDto);
}
