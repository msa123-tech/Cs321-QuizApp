package com.example.codingplatform.service;

import com.example.codingplatform.entity.Lesson;
import com.example.codingplatform.entity.Question;
import com.example.codingplatform.repository.LessonRepository;
import com.example.codingplatform.repository.QuestionRepository;
import org.springframework.stereotype.Service;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final LessonRepository lessonRepository;

    public QuestionService(QuestionRepository questionRepository,
                           LessonRepository lessonRepository) {
        this.questionRepository = questionRepository;
        this.lessonRepository = lessonRepository;
    }

    public Question saveQuestion(Question question) {
        if (question.getLesson() == null || question.getLesson().getId() == null) {
            throw new RuntimeException("Lesson id is required");
        }

        Long lessonId = question.getLesson().getId();

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        question.setLesson(lesson);

        return questionRepository.save(question);
    }

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
    }

    public Question updateQuestion(Long id, Question updatedQuestion) {
        Question existingQuestion = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));

        existingQuestion.setTopic(updatedQuestion.getTopic());
        existingQuestion.setDifficulty(updatedQuestion.getDifficulty());
        existingQuestion.setQuestionText(updatedQuestion.getQuestionText());
        existingQuestion.setOptionA(updatedQuestion.getOptionA());
        existingQuestion.setOptionB(updatedQuestion.getOptionB());
        existingQuestion.setOptionC(updatedQuestion.getOptionC());
        existingQuestion.setOptionD(updatedQuestion.getOptionD());
        existingQuestion.setCorrectAnswer(updatedQuestion.getCorrectAnswer());

        if (updatedQuestion.getLesson() != null && updatedQuestion.getLesson().getId() != null) {
            Long lessonId = updatedQuestion.getLesson().getId();

            Lesson lesson = lessonRepository.findById(lessonId)
                    .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

            existingQuestion.setLesson(lesson);
        }

        return questionRepository.save(existingQuestion);
    }

    public void deleteQuestion(Long id) {
        Question existingQuestion = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));

        questionRepository.delete(existingQuestion);
    }
}