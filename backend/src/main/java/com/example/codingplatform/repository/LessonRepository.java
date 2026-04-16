package com.example.codingplatform.repository;

import com.example.codingplatform.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByUnitId(Long unitId);

}