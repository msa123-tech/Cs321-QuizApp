package com.example.codingplatform.config;

import com.example.codingplatform.entity.Question;
import com.example.codingplatform.entity.QuestionType;
import com.example.codingplatform.repository.QuestionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.util.LinkedHashSet;
import java.util.List;

@Configuration
public class DataSeeder {
    private static final String QUESTION_BANK_FILE = "questions.json";

    @Bean
    public CommandLineRunner seedQuestions(QuestionRepository questionRepository, ObjectMapper objectMapper) {
        return args -> {
            if (questionRepository.count() > 0) {
                return;
            }

            ClassPathResource resource = new ClassPathResource(QUESTION_BANK_FILE);
            if (!resource.exists()) {
                System.out.println("No " + QUESTION_BANK_FILE + " found. Skipping question seeding.");
                return;
            }

            try (InputStream inputStream = resource.getInputStream()) {
                List<Question> questions = objectMapper.readValue(inputStream, new TypeReference<>() {});

                questions.forEach(this::normalizeQuestion);
                questionRepository.saveAll(questions);

                System.out.println("✅ Seeded " + questions.size() + " questions from " + QUESTION_BANK_FILE);
            }
            catch (Exception e) {
                throw new RuntimeException("Failed to seed questions from " + QUESTION_BANK_FILE, e);
            }
        };
    }

    private void normalizeQuestion(Question question) {
        if (question.getCorrectAnswers() == null) {
            question.setCorrectAnswers(new LinkedHashSet<>());
        } else {
            question.setCorrectAnswers(new LinkedHashSet<>(question.getCorrectAnswers()));
        }

        if (question.getQuestionType() == null) {
            question.setQuestionType(
                    question.getCorrectAnswers().size() > 1 ? QuestionType.MULTI : QuestionType.SINGLE
            );
        }
    }
}
