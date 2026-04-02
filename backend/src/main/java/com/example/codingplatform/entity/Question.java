package com.example.codingplatform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    private String difficulty;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(nullable = false)
    private String optionA;

    @Column(nullable = false)
    private String optionB;

    @Column(nullable = false)
    private String optionC;

    @Column(nullable = false)
    private String optionD;

    @Column(nullable = false)
    private Integer correctAnswer; // 0 for A, 1 for B, 2 for C, 3 for D

    public static Question createSampleQuestion(String topic, String difficulty, String questionText,
                                               String optionA, String optionB, String optionC, String optionD,
                                               Integer correctAnswer) {
        Question q = new Question();
        q.setTopic(topic);
        q.setDifficulty(difficulty);
        q.setQuestionText(questionText);
        q.setOptionA(optionA);
        q.setOptionB(optionB);
        q.setOptionC(optionC);
        q.setOptionD(optionD);
        q.setCorrectAnswer(correctAnswer);
        return q;
    }
}
