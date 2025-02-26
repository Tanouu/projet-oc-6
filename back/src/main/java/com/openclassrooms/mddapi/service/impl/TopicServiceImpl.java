package com.openclassrooms.mddapi.service.impl;

import com.openclassrooms.mddapi.dto.TopicDTO;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.service.TopicService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TopicServiceImpl implements TopicService {
    private final TopicRepository topicRepository;

    /**
     * Constructor
     * @param topicRepository
     */

    public TopicServiceImpl(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    /**
     * Get all topics
     * @return List<TopicDTO>
     */

    @Override
    public List<TopicDTO> getAllTopics() {
        return topicRepository.findAll()
                .stream()
                .map(topic -> new TopicDTO(topic.getId(), topic.getName(), topic.getDescription()))
                .collect(Collectors.toList());
    }

    /**
     * Get a topic by its id
     * @param id
     * @return TopicDTO
     */

    @Override
    public TopicDTO getTopicById(Long id) {
        return topicRepository.findById(id)
                .map(topic -> new TopicDTO(topic.getId(), topic.getName(), topic.getDescription()))
                .orElse(null);
    }
}
