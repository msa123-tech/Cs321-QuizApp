package com.example.codingplatform.repository;

import com.example.codingplatform.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByTopic(String topic);
    List<Question> findByDifficulty(String difficulty);
    List<Question> findByLesson_Id(Long lessonId);
}
