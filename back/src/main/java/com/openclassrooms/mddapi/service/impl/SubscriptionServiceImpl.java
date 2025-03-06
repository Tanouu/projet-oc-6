package com.openclassrooms.mddapi.service.impl;

import com.openclassrooms.mddapi.dto.SubscriptionDto;
import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.service.SubscriptionService;
import org.springframework.stereotype.Service;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;

    public SubscriptionServiceImpl(SubscriptionRepository subscriptionRepository, UserRepository userRepository, TopicRepository topicRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
    }

    @Override
    public void subscribeToTopic(String userEmail, SubscriptionDto subscriptionDto) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Topic topic = topicRepository.findById(subscriptionDto.getTopicId())
                .orElseThrow(() -> new RuntimeException("Thème non trouvé"));

        // Vérifier si l'utilisateur est déjà abonné à ce topic
        boolean alreadySubscribed = subscriptionRepository.existsByUserAndTopic(user, topic);
        if (alreadySubscribed) {
            throw new RuntimeException("L'utilisateur est déjà abonné à ce sujet");
        }

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setTopic(topic);

        subscriptionRepository.save(subscription);
    }

    @Override
    public void unsubscribeFromTopic(String userEmail, Long topicId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Thème non trouvé"));

        Subscription subscription = subscriptionRepository.findByUserAndTopic(user, topic)
                .orElseThrow(() -> new RuntimeException("Abonnement non trouvé"));

        subscriptionRepository.delete(subscription);
    }
}
