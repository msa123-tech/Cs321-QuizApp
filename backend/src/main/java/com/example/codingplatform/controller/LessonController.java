package com.example.codingplatform.controller;

import com.example.codingplatform.dto.QuestionDTO;
import com.example.codingplatform.entity.Lesson;
import com.example.codingplatform.service.LessonService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "http://localhost:3000")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping
    public List<Lesson> getAllLessons() {
        return lessonService.getAllLessons();
    }

    @PostMapping
    public Lesson createLesson(@RequestBody Lesson lesson) {
        return lessonService.saveLesson(lesson);
    }

    @GetMapping("/{id}/questions")
    public List<QuestionDTO> getQuestionsByLesson(@PathVariable Long id) {
        return lessonService.getQuestionsByLessonId(id);
    }
}