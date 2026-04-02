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
}