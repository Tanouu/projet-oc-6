package com.openclassrooms.mddapi.service;


import com.openclassrooms.mddapi.dto.RegisterDto;
import com.openclassrooms.mddapi.model.User;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthService {
    UserDetails loadUserByUsername(String email);
    User registerNewUser(RegisterDto registerDto);
    User findUserByEmail(String email);
}
