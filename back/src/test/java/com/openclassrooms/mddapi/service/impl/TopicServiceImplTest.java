package com.openclassrooms.mddapi.service.impl;

import com.openclassrooms.mddapi.dto.TopicDto;
import com.openclassrooms.mddapi.model.Topic;
import com.openclassrooms.mddapi.repository.TopicRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TopicServiceImplTest {

    @Mock
    private TopicRepository topicRepository;

    @InjectMocks
    private TopicServiceImpl topicService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllTopics_shouldReturnTopicDtos() {
        Topic topic1 = new Topic();
        topic1.setId(1L);
        topic1.setName("Java");
        topic1.setDescription("Tout sur Java");

        Topic topic2 = new Topic();
        topic2.setId(2L);
        topic2.setName("Spring");
        topic2.setDescription("Framework Spring");

        when(topicRepository.findAll()).thenReturn(Arrays.asList(topic1, topic2));

        List<TopicDto> result = topicService.getAllTopics();

        assertEquals(2, result.size());
        assertEquals("Java", result.get(0).getName());
        assertEquals("Spring", result.get(1).getName());

        verify(topicRepository).findAll();
    }

    @Test
    void testGetTopicById_shouldReturnTopicDtoIfExists() {
        Topic topic = new Topic();
        topic.setId(1L);
        topic.setName("Angular");
        topic.setDescription("Framework Front-end");

        when(topicRepository.findById(1L)).thenReturn(Optional.of(topic));

        TopicDto result = topicService.getTopicById(1L);

        assertNotNull(result);
        assertEquals("Angular", result.getName());
        assertEquals("Framework Front-end", result.getDescription());

        verify(topicRepository).findById(1L);
    }

    @Test
    void testGetTopicById_shouldReturnNullIfNotFound() {
        when(topicRepository.findById(999L)).thenReturn(Optional.empty());

        TopicDto result = topicService.getTopicById(999L);

        assertNull(result);
        verify(topicRepository).findById(999L);
    }
}
