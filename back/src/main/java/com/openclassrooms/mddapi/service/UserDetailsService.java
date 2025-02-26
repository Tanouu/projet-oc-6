package com.openclassrooms.mddapi.service;


import com.openclassrooms.mddapi.dto.UserDto;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserDetailsService {
    UserDetails loadUserByUsername(String email);
}
