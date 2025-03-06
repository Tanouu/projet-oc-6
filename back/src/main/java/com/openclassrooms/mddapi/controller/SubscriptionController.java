package com.openclassrooms.mddapi.controller;

import com.openclassrooms.mddapi.dto.SubscriptionDto;
import com.openclassrooms.mddapi.dto.SubscriptionResponseDto;
import com.openclassrooms.mddapi.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<SubscriptionResponseDto> subscribe(@RequestBody SubscriptionDto subscriptionDto, Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).body(new SubscriptionResponseDto("Non autorisé"));
        }

        try {
            subscriptionService.subscribeToTopic(authentication.getName(), subscriptionDto);
            return ResponseEntity.ok(new SubscriptionResponseDto("Abonnement réussi !"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new SubscriptionResponseDto(e.getMessage()));
        }
    }
}
