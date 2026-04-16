package com.example.codingplatform.controller;

import com.example.codingplatform.dto.LoginRequest;
import com.example.codingplatform.dto.LoginResponse;
import com.example.codingplatform.dto.RegisterRequest;
import com.example.codingplatform.entity.User;
import com.example.codingplatform.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}