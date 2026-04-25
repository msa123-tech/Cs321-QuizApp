package com.example.codingplatform.controller;

import com.example.codingplatform.dto.UserProgressDTO;
import com.example.codingplatform.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
public class UserProgressController {
    private final QuizService quizService;

    public UserProgressController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProgressDTO> getUserProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(quizService.getUserProgress(userId));
    }
}
