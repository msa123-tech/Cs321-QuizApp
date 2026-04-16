package com.example.codingplatform.service;

import com.example.codingplatform.dto.QuestionDTO;
import com.example.codingplatform.dto.QuizSubmitRequest;
import com.example.codingplatform.dto.QuizResultResponse;
import com.example.codingplatform.entity.QuestionType;
import com.example.codingplatform.entity.Question;
import com.example.codingplatform.entity.UserProgress;
import com.example.codingplatform.repository.QuestionRepository;
import com.example.codingplatform.repository.UserProgressRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class QuizService {
    private final QuestionRepository questionRepository;
    private final UserProgressRepository userProgressRepository;

    public QuizService(QuestionRepository questionRepository, UserProgressRepository userProgressRepository) {
        this.questionRepository = questionRepository;
        this.userProgressRepository = userProgressRepository;
    }

    public List<QuestionDTO> getQuestionsByLesson(Long lessonId) {
        return questionRepository.findByLesson_Id(lessonId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public QuizResultResponse submitQuiz(Long userId, QuizSubmitRequest request) {
        // Fetch all questions
        List<Question> questions = questionRepository.findAll();
        
        if (questions.isEmpty()) {
            return new QuizResultResponse(0, 0, 0, 0, 0, 0, "No questions available", List.of());
        }

        // Calculate score
        int correctCount = 0;
        int totalQuestions = Math.min(questions.size(), request.getAnswers().size());
        List<QuizResultResponse.QuestionFeedbackDTO> questionFeedback = new ArrayList<>();

        for (QuizSubmitRequest.AnswerDTO answer : request.getAnswers()) {
            Optional<Question> questionOpt = questions.stream()
                .filter(q -> q.getId().equals(answer.getQuestionId()))
                .findFirst();

            if (questionOpt.isPresent()) {
                Question q = questionOpt.get();
                Set<Integer> submittedAnswers = new LinkedHashSet<>(answer.getNormalizedSelectedOptionIndices());
                QuizResultResponse.QuestionFeedbackDTO feedback = buildQuestionFeedback(q, submittedAnswers);
                questionFeedback.add(feedback);

                if ("CORRECT".equals(feedback.getResult())) {
                    correctCount++;
                }
            }
        }

        // Calculate XP (10 XP per correct answer)
        int xpGained = correctCount * 10;

        // Update user progress
        Optional<UserProgress> progressOpt = userProgressRepository.findByUserId(userId);
        UserProgress progress;
        
        if (progressOpt.isPresent()) {
            progress = progressOpt.get();
            progress.setXp(progress.getXp() + xpGained);
            progress.setCompletedQuizzes(progress.getCompletedQuizzes() + 1);
        } else {
            progress = new UserProgress();
            progress.setUserId(userId);
            progress.setXp(xpGained);
            progress.setCompletedQuizzes(1);
        }
        
        userProgressRepository.save(progress);

        // Create response
        int score = totalQuestions == 0 ? 0 : (int) ((correctCount * 100) / totalQuestions);
        String message = correctCount == totalQuestions ? "Perfect score! 🎉" : 
                        (correctCount > 0 && correctCount * 2 >= totalQuestions) ? "Great job! 👍" : 
                        "Keep practicing! 💪";

        return new QuizResultResponse(
            score,
            100,
            correctCount,
            totalQuestions,
            xpGained,
            progress.getXp(),
            message,
            questionFeedback
        );
    }

    private QuizResultResponse.QuestionFeedbackDTO buildQuestionFeedback(Question question, Set<Integer> submittedAnswers) {
        Set<Integer> correctAnswers = new LinkedHashSet<>(question.getCorrectAnswers());
        Set<Integer> missedAnswers = new LinkedHashSet<>(correctAnswers);
        missedAnswers.removeAll(submittedAnswers);

        Set<Integer> wrongAnswers = new LinkedHashSet<>(submittedAnswers);
        wrongAnswers.removeAll(correctAnswers);

        String result = determineResult(question.getQuestionType(), submittedAnswers, correctAnswers, missedAnswers, wrongAnswers);

        return new QuizResultResponse.QuestionFeedbackDTO(
                question.getId(),
                result,
                List.copyOf(submittedAnswers),
                List.copyOf(correctAnswers),
                List.copyOf(missedAnswers),
                List.copyOf(wrongAnswers)
        );
    }

    private String determineResult(QuestionType questionType,
                                   Set<Integer> submittedAnswers,
                                   Set<Integer> correctAnswers,
                                   Set<Integer> missedAnswers,
                                   Set<Integer> wrongAnswers) {
        if (submittedAnswers.equals(correctAnswers)) {
            return "CORRECT";
        }

        if (questionType == QuestionType.MULTI && !submittedAnswers.isEmpty()) {
            Set<Integer> matchedAnswers = new LinkedHashSet<>(submittedAnswers);
            matchedAnswers.retainAll(correctAnswers);

            if (!matchedAnswers.isEmpty() && (!missedAnswers.isEmpty() || !wrongAnswers.isEmpty())) {
                return "PARTIAL";
            }
        }

        return "INCORRECT";
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
