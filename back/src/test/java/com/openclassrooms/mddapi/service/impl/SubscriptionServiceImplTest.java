package com.openclassrooms.mddapi.service.impl;

import com.openclassrooms.mddapi.dto.SubscriptionDto;
import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SubscriptionServiceImplTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TopicRepository topicRepository;

    @InjectMocks
    private SubscriptionServiceImpl subscriptionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ========== subscribeToTopic ==========

    @Test
    void testSubscribeToTopic_shouldSucceed() {
        String email = "ethan@mail.com";
        SubscriptionDto dto = new SubscriptionDto(1L);

        User user = new User();
        user.setEmail(email);

        Topic topic = new Topic();
        topic.setId(1L);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(topicRepository.findById(1L)).thenReturn(Optional.of(topic));
        when(subscriptionRepository.existsByUserAndTopic(user, topic)).thenReturn(false);

        subscriptionService.subscribeToTopic(email, dto);

        verify(subscriptionRepository).save(any(Subscription.class));
    }

    @Test
    void testSubscribeToTopic_shouldFailIfUserAlreadySubscribed() {
        String email = "ethan@mail.com";
        SubscriptionDto dto = new SubscriptionDto(1L);

        User user = new User();
        user.setEmail(email);

        Topic topic = new Topic();
        topic.setId(1L);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(topicRepository.findById(1L)).thenReturn(Optional.of(topic));
        when(subscriptionRepository.existsByUserAndTopic(user, topic)).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                subscriptionService.subscribeToTopic(email, dto)
        );

        assertEquals("L'utilisateur est déjà abonné à ce sujet", exception.getMessage());
        verify(subscriptionRepository, never()).save(any(Subscription.class));
    }

    @Test
    void testSubscribeToTopic_shouldFailIfUserNotFound() {
        when(userRepository.findByEmail("notfound@mail.com")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                subscriptionService.subscribeToTopic("notfound@mail.com", new SubscriptionDto(1L))
        );

        assertEquals("Utilisateur non trouvé", exception.getMessage());
    }

    @Test
    void testSubscribeToTopic_shouldFailIfTopicNotFound() {
        User user = new User();
        user.setEmail("ethan@mail.com");

        when(userRepository.findByEmail("ethan@mail.com")).thenReturn(Optional.of(user));
        when(topicRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                subscriptionService.subscribeToTopic("ethan@mail.com", new SubscriptionDto(999L))
        );

        assertEquals("Thème non trouvé", exception.getMessage());
    }

    // ========== unsubscribeFromTopic ==========

    @Test
    void testUnsubscribeFromTopic_shouldSucceed() {
        String email = "ethan@mail.com";
        Long topicId = 1L;

        User user = new User();
        user.setEmail(email);

        Topic topic = new Topic();
        topic.setId(topicId);

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setTopic(topic);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(topicRepository.findById(topicId)).thenReturn(Optional.of(topic));
        when(subscriptionRepository.findByUserAndTopic(user, topic)).thenReturn(Optional.of(subscription));

        subscriptionService.unsubscribeFromTopic(email, topicId);

        verify(subscriptionRepository).delete(subscription);
    }

    @Test
    void testUnsubscribeFromTopic_shouldFailIfUserNotFound() {
        when(userRepository.findByEmail("unknown@mail.com")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                subscriptionService.unsubscribeFromTopic("unknown@mail.com", 1L)
        );

        assertEquals("Utilisateur non trouvé", exception.getMessage());
    }

    @Test
    void testUnsubscribeFromTopic_shouldFailIfTopicNotFound() {
        User user = new User();
        user.setEmail("ethan@mail.com");

        when(userRepository.findByEmail("ethan@mail.com")).thenReturn(Optional.of(user));
        when(topicRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                subscriptionService.unsubscribeFromTopic("ethan@mail.com", 999L)
        );

        assertEquals("Thème non trouvé", exception.getMessage());
    }

    @Test
    void testUnsubscribeFromTopic_shouldFailIfSubscriptionNotFound() {
        User user = new User();
        user.setEmail("ethan@mail.com");

        Topic topic = new Topic();
        topic.setId(1L);

        when(userRepository.findByEmail("ethan@mail.com")).thenReturn(Optional.of(user));
        when(topicRepository.findById(1L)).thenReturn(Optional.of(topic));
        when(subscriptionRepository.findByUserAndTopic(user, topic)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                subscriptionService.unsubscribeFromTopic("ethan@mail.com", 1L)
        );

        assertEquals("Abonnement non trouvé", exception.getMessage());
    }
}
