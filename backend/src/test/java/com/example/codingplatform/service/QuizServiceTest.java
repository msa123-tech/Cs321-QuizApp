package com.example.codingplatform.service;

import com.example.codingplatform.dto.QuizResultResponse;
import com.example.codingplatform.dto.QuizSubmitRequest;
import com.example.codingplatform.entity.Question;
import com.example.codingplatform.entity.QuestionType;
import com.example.codingplatform.entity.UserProgress;
import com.example.codingplatform.repository.QuestionRepository;
import com.example.codingplatform.repository.UserProgressRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private UserProgressRepository userProgressRepository;

    @InjectMocks
    private QuizService quizService;

    @Test
    void submitQuizReturnsEmptyStateWhenNoQuestionsExist() {
        QuizSubmitRequest request = new QuizSubmitRequest(List.of(), "easy");

        when(questionRepository.findAll()).thenReturn(List.of());

        QuizResultResponse response = quizService.submitQuiz(1L, request);

        assertEquals(0, response.getScore());
        assertEquals(0, response.getCorrectAnswers());
        assertEquals("No questions available", response.getMessage());
        assertTrue(response.getQuestionFeedback().isEmpty());
    }

    @Test
    void submitQuizAwardsXpAndMarksDifficultyProgress() {
        Question q1 = buildQuestion(1L, QuestionType.SINGLE, Set.of(1));
        Question q2 = buildQuestion(2L, QuestionType.SINGLE, Set.of(2));

        QuizSubmitRequest.AnswerDTO a1 = new QuizSubmitRequest.AnswerDTO(1L, 1, null, null);
        QuizSubmitRequest.AnswerDTO a2 = new QuizSubmitRequest.AnswerDTO(2L, 0, null, null);
        QuizSubmitRequest request = new QuizSubmitRequest(List.of(a1, a2), "medium");

        UserProgress progress = new UserProgress();
        progress.setUserId(9L);
        progress.setXp(20);
        progress.setCompletedQuizzes(1);

        when(questionRepository.findAll()).thenReturn(List.of(q1, q2));
        when(userProgressRepository.findByUserId(9L)).thenReturn(Optional.of(progress));

        QuizResultResponse response = quizService.submitQuiz(9L, request);

        ArgumentCaptor<UserProgress> captor = ArgumentCaptor.forClass(UserProgress.class);
        verify(userProgressRepository).save(captor.capture());

        assertEquals(50, response.getScore());
        assertEquals(1, response.getCorrectAnswers());
        assertEquals(10, response.getXpGained());
        assertEquals(30, response.getTotalXp());
        assertEquals("Great job! 👍", response.getMessage());

        UserProgress saved = captor.getValue();
        assertEquals(30, saved.getXp());
        assertEquals(2, saved.getCompletedQuizzes());
        assertTrue(saved.getMediumCleared());
        assertFalse(saved.getEasyCleared());
        assertFalse(saved.getHardCleared());
    }

    @Test
    void checkAnswerReturnsPartialForMultiSelectQuestion() {
        Question question = buildQuestion(3L, QuestionType.MULTI, Set.of(0, 2));
        QuizSubmitRequest.AnswerDTO answer = new QuizSubmitRequest.AnswerDTO(3L, null, List.of(0), null);

        when(questionRepository.findById(3L)).thenReturn(Optional.of(question));

        QuizResultResponse.QuestionFeedbackDTO feedback = quizService.checkAnswer(answer);

        assertEquals("PARTIAL", feedback.getResult());
        assertEquals(List.of(0), feedback.getSelectedAnswers());
        assertEquals(List.of(0, 2), feedback.getCorrectAnswers());
        assertEquals(List.of(2), feedback.getMissedAnswers());
        assertTrue(feedback.getWrongAnswers().isEmpty());
    }

    private Question buildQuestion(Long id, QuestionType type, Set<Integer> correctAnswers) {
        Question question = Question.createSampleQuestion(
                "Java Basics",
                "Easy",
                "Sample question",
                "A",
                "B",
                "C",
                "D",
                type,
                correctAnswers
        );
        ReflectionTestUtils.setField(question, "id", id);
        return question;
    }
}
