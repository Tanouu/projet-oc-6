package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.TopicDto;
import java.util.List;

public interface TopicService {
    List<TopicDto> getAllTopics();
    TopicDto getTopicById(Long id);
}