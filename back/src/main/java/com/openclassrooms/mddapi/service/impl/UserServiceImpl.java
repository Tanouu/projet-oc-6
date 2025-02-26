package com.openclassrooms.mddapi.service.impl;



import com.openclassrooms.mddapi.dto.RegisterDto;
import com.openclassrooms.mddapi.dto.UserDto;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public User registerNewUser(RegisterDto registerDto) {
      User user = new User();
      user.setEmail(registerDto.getEmail());
      user.setName(registerDto.getName());
      user.setPassword(registerDto.getPassword());
      return userRepository.save(user);
    }

  @Override
    public User findUserByEmail(String email) {
      return userRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

  @Override
  public UserDto getUserDto(User user) {
    return new UserDto(user.getId(), user.getName(), user.getEmail());
  }

}
