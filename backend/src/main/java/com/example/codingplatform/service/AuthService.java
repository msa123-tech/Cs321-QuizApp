package com.example.codingplatform.service;

import com.example.codingplatform.dto.LoginRequest;
import com.example.codingplatform.dto.LoginResponse;
import com.example.codingplatform.dto.RegisterRequest;
import com.example.codingplatform.entity.User;
import com.example.codingplatform.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (!isValidPassword(request.getPassword())) {
            throw new RuntimeException(
                "Password must be at least 8 characters long and contain at least one special character"
            );
        }

        User user = new User(
            request.getUsername().trim(),
            request.getEmail().trim(),
            request.getPassword()
        );

        return userRepository.save(user);
    }

    private boolean isValidPassword(String password) {
        if (password.length() < 8) {
            return false;
        }

        return password.matches(".*[^a-zA-Z0-9].*");
    }

    public LoginResponse login(LoginRequest request) {
        if (request.getIdentifier() == null || request.getIdentifier().trim().isEmpty()) {
            throw new RuntimeException("Username or email is required");
        }

        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        String identifier = request.getIdentifier().trim();

        User user = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );

        return new LoginResponse("dummy-session-token", userInfo);
    }
}