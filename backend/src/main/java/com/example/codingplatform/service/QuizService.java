package com.example.codingplatform.service;

import com.example.codingplatform.dto.QuestionDTO;
import com.example.codingplatform.dto.QuizSubmitRequest;
import com.example.codingplatform.dto.QuizResultResponse;
import com.example.codingplatform.entity.Question;
import com.example.codingplatform.entity.UserProgress;
import com.example.codingplatform.repository.QuestionRepository;
import com.example.codingplatform.repository.UserProgressRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuizService {
    private final QuestionRepository questionRepository;
    private final UserProgressRepository userProgressRepository;

    public QuizService(QuestionRepository questionRepository, UserProgressRepository userProgressRepository) {
        this.questionRepository = questionRepository;
        this.userProgressRepository = userProgressRepository;
    }

    public List<QuestionDTO> getQuestionsByLesson(Long lessonId) {
        return questionRepository.findByLessonId(lessonId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public QuizResultResponse submitQuiz(Long userId, QuizSubmitRequest request) {
        // Fetch all questions
        List<Question> questions = questionRepository.findAll();
        
        if (questions.isEmpty()) {
            return new QuizResultResponse(0, 0, 0, 0, 0, 0, "No questions available");
        }

        // Calculate score
        int correctCount = 0;
        int totalQuestions = Math.min(questions.size(), request.getAnswers().size());

        for (QuizSubmitRequest.AnswerDTO answer : request.getAnswers()) {
            Optional<Question> questionOpt = questions.stream()
                .filter(q -> q.getId().equals(answer.getQuestionId()))
                .findFirst();

            if (questionOpt.isPresent()) {
                Question q = questionOpt.get();
                if (answer.getSelectedOptionIndex() != null && 
                    answer.getSelectedOptionIndex().equals(q.getCorrectAnswer())) {
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
        int score = (int) ((correctCount * 100) / totalQuestions);
        String message = correctCount == totalQuestions ? "Perfect score! 🎉" : 
                        correctCount >= totalQuestions / 2 ? "Great job! 👍" : 
                        "Keep practicing! 💪";

        return new QuizResultResponse(
            score,
            100,
            correctCount,
            totalQuestions,
            xpGained,
            progress.getXp(),
            message
        );
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
