package com.openclassrooms.mddapi.controller;
import com.openclassrooms.mddapi.dto.JwtResponseDto;
import com.openclassrooms.mddapi.dto.LoginDto;
import com.openclassrooms.mddapi.dto.RegisterDto;
import com.openclassrooms.mddapi.model.User;
import com.openclassrooms.mddapi.security.JwtGenerator;
import com.openclassrooms.mddapi.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService userService;
  private final PasswordEncoder passwordEncoder;
  private final JwtGenerator jwtGenerator;

  @Autowired
  public AuthController(AuthService userService, PasswordEncoder passwordEncoder, JwtGenerator jwtUtil) {
    this.userService = userService;
    this.passwordEncoder = passwordEncoder;
    this.jwtGenerator = jwtUtil;
  }

  @PostMapping("/register")
  public ResponseEntity<JwtResponseDto> registerNewUser(@Valid @RequestBody RegisterDto registerDto) {
    registerDto.setPassword(passwordEncoder.encode(registerDto.getPassword()));

    User newUser = userService.registerNewUser(registerDto);

    UsernamePasswordAuthenticationToken authentication =
      new UsernamePasswordAuthenticationToken(newUser.getEmail(), null, new ArrayList<>());

    final String jwt = jwtGenerator.generateToken(authentication);

    return ResponseEntity.ok(new JwtResponseDto(jwt));
  }

  @PostMapping("/login")
  public ResponseEntity<JwtResponseDto> loginUser(@RequestBody LoginDto loginData) {
    User user = userService.findUserByEmail(loginData.getEmail());

    UsernamePasswordAuthenticationToken authentication =
      new UsernamePasswordAuthenticationToken(user.getEmail(), null, new ArrayList<>());

    final String jwt = jwtGenerator.generateToken(authentication);

    return ResponseEntity.ok(new JwtResponseDto(jwt));
  }

}

