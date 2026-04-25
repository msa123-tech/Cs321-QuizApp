package com.example.codingplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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
    private List<QuestionFeedbackDTO> questionFeedback;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionFeedbackDTO {
        private Long questionId;
        private String result;
        private List<Integer> selectedAnswers;
        private List<Integer> correctAnswers;
        private List<Integer> missedAnswers;
        private List<Integer> wrongAnswers;
    }
}
