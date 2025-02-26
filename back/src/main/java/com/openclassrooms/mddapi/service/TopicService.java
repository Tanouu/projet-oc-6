package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.TopicDTO;
import java.util.List;

public interface TopicService {
    List<TopicDTO> getAllTopics();
    TopicDTO getTopicById(Long id);
}