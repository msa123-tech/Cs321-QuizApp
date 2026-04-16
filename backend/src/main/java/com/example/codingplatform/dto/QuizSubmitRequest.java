package com.example.codingplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizSubmitRequest {
    private List<AnswerDTO> answers;
    private String difficulty;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerDTO {
        private Long questionId;
        private Integer selectedOptionIndex;
        private List<Integer> selectedOptionIndices;
        private String selectedOptionText;

        public Set<Integer> getNormalizedSelectedOptionIndices() {
            LinkedHashSet<Integer> normalized = new LinkedHashSet<>();

            if (selectedOptionIndices != null) {
                normalized.addAll(selectedOptionIndices);
            }

            if (selectedOptionIndex != null) {
                normalized.add(selectedOptionIndex);
            }

            return normalized;
        }
    }
}
