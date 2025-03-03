package com.openclassrooms.mddapi.service;

import com.openclassrooms.mddapi.dto.UserDto;
import com.openclassrooms.mddapi.model.User;

public interface UserService {
    User findUserByEmail(String email);
    UserDto getUserDto(User user);

}
