package com.example.codingplatform.service;

import com.example.codingplatform.dto.QuestionDTO;
import com.example.codingplatform.entity.Lesson;
import com.example.codingplatform.entity.Question;
import com.example.codingplatform.repository.LessonRepository;
import com.example.codingplatform.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final QuestionRepository questionRepository;

    public LessonService(LessonRepository lessonRepository,
                         QuestionRepository questionRepository) {
        this.lessonRepository = lessonRepository;
        this.questionRepository = questionRepository;
    }

    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    public Lesson saveLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    public List<QuestionDTO> getQuestionsByLessonId(Long lessonId) {
        List<Question> questions = questionRepository.findByLessonId(lessonId);

        return questions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
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
        return dto;
    }
}