package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.SubscriptionDto;
import com.openclassrooms.mddapi.dto.SubscriptionResponseDto;
import com.openclassrooms.mddapi.service.SubscriptionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SubscriptionController.class)
class SubscriptionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SubscriptionService subscriptionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testSubscribe_shouldReturnSuccess() throws Exception {
        SubscriptionDto dto = new SubscriptionDto(1L);

        doNothing().when(subscriptionService).subscribeToTopic("ethan@mail.com", dto);

        mockMvc.perform(post("/api/subscriptions/subscribe")
                        .with(user("ethan@mail.com").roles("USER"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Abonnement réussi !"));
    }

    @Test
    void testSubscribe_shouldReturnBadRequest_onException() throws Exception {
        SubscriptionDto dto = new SubscriptionDto(1L);

        doThrow(new RuntimeException("Erreur d'abonnement"))
                .when(subscriptionService).subscribeToTopic(eq("ethan@mail.com"), any(SubscriptionDto.class));


        mockMvc.perform(post("/api/subscriptions/subscribe")
                        .with(user("ethan@mail.com").roles("USER"))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Erreur d'abonnement"));
    }

    @Test
    void testUnsubscribe_shouldReturnSuccess() throws Exception {
        doNothing().when(subscriptionService).unsubscribeFromTopic("ethan@mail.com", 1L);

        mockMvc.perform(delete("/api/subscriptions/unsubscribe/1")
                        .with(user("ethan@mail.com").roles("USER"))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("Désabonnement réussi !"));
    }

    @Test
    void testUnsubscribe_shouldReturnBadRequest_onException() throws Exception {
        doThrow(new RuntimeException("Erreur de désabonnement"))
                .when(subscriptionService).unsubscribeFromTopic("ethan@mail.com", 1L);

        mockMvc.perform(delete("/api/subscriptions/unsubscribe/1")
                        .with(user("ethan@mail.com").roles("USER"))
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Erreur de désabonnement"));
    }
}
