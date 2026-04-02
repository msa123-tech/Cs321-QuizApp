package com.example.codingplatform.service;

import com.example.codingplatform.dto.RegisterRequest;
import com.example.codingplatform.dto.LoginRequest;
import com.example.codingplatform.dto.AuthResponse;
import com.example.codingplatform.dto.UserDTO;
import com.example.codingplatform.entity.User;
import com.example.codingplatform.entity.UserProgress;
import com.example.codingplatform.repository.UserRepository;
import com.example.codingplatform.repository.UserProgressRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, UserProgressRepository userProgressRepository) {
        this.userRepository = userRepository;
        this.userProgressRepository = userProgressRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public AuthResponse register(RegisterRequest request) {
        // Validation
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse("Email already exists");
        }

        // Create user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        // Create user progress
        UserProgress progress = new UserProgress();
        progress.setUserId(savedUser.getId());
        progress.setXp(0);
        progress.setCompletedQuizzes(0);
        userProgressRepository.save(progress);

        String token = "token_" + savedUser.getId() + "_" + System.currentTimeMillis();

        return new AuthResponse("Registration successful", token,
            UserDTO.fromUser(savedUser, 0));
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by username or email
        Optional<User> userOpt = userRepository.findByUsername(request.getIdentifier());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(request.getIdentifier());
        }

        if (userOpt.isEmpty()) {
            return new AuthResponse("Invalid credentials");
        }

        User user = userOpt.get();

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse("Invalid credentials");
        }

        // Get user progress
        Optional<UserProgress> progressOpt = userProgressRepository.findByUserId(user.getId());
        Integer xp = progressOpt.map(UserProgress::getXp).orElse(0);

        // Create response with token (simple demo token)
        String token = "token_" + user.getId() + "_" + System.currentTimeMillis();
        
        return new AuthResponse("Login successful", token, 
            UserDTO.fromUser(user, xp));
    }
}
