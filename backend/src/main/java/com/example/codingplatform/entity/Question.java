package com.example.codingplatform.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.LinkedHashSet;
import java.util.Set;

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
    @Enumerated(EnumType.STRING)
    private QuestionType questionType = QuestionType.SINGLE;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "question_correct_answers", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "correct_option_index", nullable = false)
    private Set<Integer> correctAnswers = new LinkedHashSet<>();

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    public static Question createSampleQuestion(String topic, String difficulty, String questionText,
                                               String optionA, String optionB, String optionC, String optionD,
                                               Integer correctAnswer) {
        return createSampleQuestion(
                topic,
                difficulty,
                questionText,
                optionA,
                optionB,
                optionC,
                optionD,
                QuestionType.SINGLE,
                Set.of(correctAnswer)
        );
    }

    public static Question createSampleQuestion(String topic, String difficulty, String questionText,
                                               String optionA, String optionB, String optionC, String optionD,
                                               QuestionType questionType, Set<Integer> correctAnswers) {
        Question q = new Question();
        q.setTopic(topic);
        q.setDifficulty(difficulty);
        q.setQuestionText(questionText);
        q.setOptionA(optionA);
        q.setOptionB(optionB);
        q.setOptionC(optionC);
        q.setOptionD(optionD);
        q.setQuestionType(questionType);
        q.setCorrectAnswers(new LinkedHashSet<>(correctAnswers));
        return q;
    }
}
