package com.example.codingplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizSubmitRequest {
    private List<AnswerDTO> answers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerDTO {
        private Long questionId;
        private Integer selectedOptionIndex;
        private String selectedOptionText;
    }
}
