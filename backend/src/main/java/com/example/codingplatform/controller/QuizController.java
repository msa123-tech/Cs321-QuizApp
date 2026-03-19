package com.example.codingplatform.controller;

import com.example.codingplatform.dto.QuestionDTO;
import com.example.codingplatform.dto.QuizSubmitRequest;
import com.example.codingplatform.dto.QuizResultResponse;
import com.example.codingplatform.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class QuizController {
    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/questions")
    public ResponseEntity<List<QuestionDTO>> getQuestions() {
        List<QuestionDTO> questions = quizService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/quiz/submit")
    public ResponseEntity<QuizResultResponse> submitQuiz(
            @RequestParam(value = "userId", required = false, defaultValue = "1") Long userId,
            @RequestBody QuizSubmitRequest request) {
        QuizResultResponse response = quizService.submitQuiz(userId, request);
        return ResponseEntity.ok(response);
    }
}
