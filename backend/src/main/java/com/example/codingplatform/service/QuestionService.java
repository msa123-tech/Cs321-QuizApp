package com.example.codingplatform.service;

import com.example.codingplatform.dto.QuestionDTO;
import com.example.codingplatform.entity.Lesson;
import com.example.codingplatform.entity.Question;
import com.example.codingplatform.entity.QuestionType;
import com.example.codingplatform.repository.LessonRepository;
import com.example.codingplatform.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

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
        normalizeQuestion(question);

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

    public List<QuestionDTO> getQuestions(String topic, String difficulty) {
        return questionRepository.findAll().stream()
                .filter(question -> matchesFilter(question.getTopic(), topic))
                .filter(question -> matchesFilter(question.getDifficulty(), difficulty))
                .map(this::convertToDTO)
                .toList();
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
        existingQuestion.setQuestionType(updatedQuestion.getQuestionType());
        existingQuestion.setCorrectAnswers(updatedQuestion.getCorrectAnswers());
        normalizeQuestion(existingQuestion);

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

    private void normalizeQuestion(Question question) {
        Set<Integer> normalizedAnswers = question.getCorrectAnswers() == null
                ? new LinkedHashSet<>()
                : new LinkedHashSet<>(question.getCorrectAnswers());

        question.setCorrectAnswers(normalizedAnswers);

        if (question.getQuestionType() == null) {
            question.setQuestionType(normalizedAnswers.size() > 1 ? QuestionType.MULTI : QuestionType.SINGLE);
        }

        if (normalizedAnswers.isEmpty()) {
            throw new RuntimeException("At least one correct answer is required");
        }

        if (question.getQuestionType() == QuestionType.SINGLE && normalizedAnswers.size() != 1) {
            throw new RuntimeException("SINGLE questions must have exactly one correct answer");
        }

        if (question.getQuestionType() == QuestionType.MULTI && normalizedAnswers.size() < 2) {
            throw new RuntimeException("MULTI questions must have at least two correct answers");
        }
    }

    private boolean matchesFilter(String value, String filter) {
        return filter == null || filter.isBlank() || value.equalsIgnoreCase(filter);
    }

    private QuestionDTO convertToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setTopic(question.getTopic());
        dto.setDifficulty(question.getDifficulty());
        dto.setQuestionText(question.getQuestionText());
        dto.setOptionA(question.getOptionA());
        dto.setOptionB(question.getOptionB());
        dto.setOptionC(question.getOptionC());
        dto.setOptionD(question.getOptionD());
        dto.setQuestionType(question.getQuestionType());
        return dto;
    }
}
