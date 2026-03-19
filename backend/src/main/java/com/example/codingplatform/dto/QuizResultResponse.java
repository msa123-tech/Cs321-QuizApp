package com.example.codingplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultResponse {
    private Integer score;
    private Integer totalScore;
    private Integer correctAnswers;
    private Integer totalQuestions;
    private Integer xpGained;
    private Integer totalXp;
    private String message;
}
