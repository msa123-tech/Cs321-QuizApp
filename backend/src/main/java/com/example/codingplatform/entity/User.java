package com.example.codingplatform.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Auth fields ---
    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // --- Gamification ---
    @Column(nullable = false)
    private int xp = 0;

    @Column(nullable = false)
    private int level = 1;

    // --- Progress tracking (basic version) ---
    @ElementCollection
    private List<Long> completedLessonIds = new ArrayList<>();

    // --- Constructors ---
    public User() {}

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.xp = 0;
        this.level = 1;
    }

    // --- Getters & Setters ---

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getXp() {
        return xp;
    }

    public void setXp(int xp) {
        this.xp = xp;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public List<Long> getCompletedLessonIds() {
        return completedLessonIds;
    }

    public void setCompletedLessonIds(List<Long> completedLessonIds) {
        this.completedLessonIds = completedLessonIds;
    }

    public void addCompletedLesson(Long lessonId) {
        this.completedLessonIds.add(lessonId);
    }
}