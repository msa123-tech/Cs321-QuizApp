package com.example.codingplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {
    private Long id;
    private String topic;
    private String difficulty;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
}
