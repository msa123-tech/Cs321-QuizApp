package com.example.codingplatform.dto;

import com.example.codingplatform.entity.UserProgress;

public class UserProgressDTO {
    private Long userId;
    private Integer xp;
    private Integer completedQuizzes;
    private Boolean easyCleared;
    private Boolean mediumCleared;
    private Boolean hardCleared;

    public UserProgressDTO() {
    }

    public UserProgressDTO(Long userId,
                           Integer xp,
                           Integer completedQuizzes,
                           Boolean easyCleared,
                           Boolean mediumCleared,
                           Boolean hardCleared) {
        this.userId = userId;
        this.xp = xp;
        this.completedQuizzes = completedQuizzes;
        this.easyCleared = easyCleared;
        this.mediumCleared = mediumCleared;
        this.hardCleared = hardCleared;
    }

    public static UserProgressDTO fromProgress(UserProgress progress, Long userId) {
        if (progress == null) {
            return new UserProgressDTO(userId, 0, 0, false, false, false);
        }

        return new UserProgressDTO(
                userId,
                progress.getXp() != null ? progress.getXp() : 0,
                progress.getCompletedQuizzes() != null ? progress.getCompletedQuizzes() : 0,
                Boolean.TRUE.equals(progress.getEasyCleared()),
                Boolean.TRUE.equals(progress.getMediumCleared()),
                Boolean.TRUE.equals(progress.getHardCleared())
        );
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getXp() {
        return xp;
    }

    public void setXp(Integer xp) {
        this.xp = xp;
    }

    public Integer getCompletedQuizzes() {
        return completedQuizzes;
    }

    public void setCompletedQuizzes(Integer completedQuizzes) {
        this.completedQuizzes = completedQuizzes;
    }

    public Boolean getEasyCleared() {
        return easyCleared;
    }

    public void setEasyCleared(Boolean easyCleared) {
        this.easyCleared = easyCleared;
    }

    public Boolean getMediumCleared() {
        return mediumCleared;
    }

    public void setMediumCleared(Boolean mediumCleared) {
        this.mediumCleared = mediumCleared;
    }

    public Boolean getHardCleared() {
        return hardCleared;
    }

    public void setHardCleared(Boolean hardCleared) {
        this.hardCleared = hardCleared;
    }
}
