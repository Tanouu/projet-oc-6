package com.openclassrooms.mddapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.mddapi.dto.TopicDto;
import com.openclassrooms.mddapi.service.TopicService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TopicController.class)
@AutoConfigureMockMvc(addFilters = false)
class TopicControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TopicService topicService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllTopics_shouldReturnList() throws Exception {
        List<TopicDto> topics = List.of(
                new TopicDto(1L, "Java", "Tout sur Java"),
                new TopicDto(2L, "Angular", "Frontend moderne")
        );

        when(topicService.getAllTopics()).thenReturn(topics);

        mockMvc.perform(get("/api/topics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].name").value("Java"))
                .andExpect(jsonPath("$[0].description").value("Tout sur Java"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].name").value("Angular"))
                .andExpect(jsonPath("$[1].description").value("Frontend moderne"));
    }

    @Test
    void testGetTopicById_shouldReturnTopic() throws Exception {
        TopicDto topic = new TopicDto(1L, "Java", "Langage de programmation back-end");

        when(topicService.getTopicById(1L)).thenReturn(topic);

        mockMvc.perform(get("/api/topics/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Java"))
                .andExpect(jsonPath("$.description").value("Langage de programmation back-end"));
    }

    @Test
    void testGetTopicById_shouldReturnNotFound() throws Exception {
        when(topicService.getTopicById(999L)).thenReturn(null);

        mockMvc.perform(get("/api/topics/999"))
                .andExpect(status().isNotFound());
    }
}
