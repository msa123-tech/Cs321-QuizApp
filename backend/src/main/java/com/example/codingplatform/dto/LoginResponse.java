package com.example.codingplatform.dto;

public class LoginResponse {
    private String token;
    private UserInfo user;

    public LoginResponse() {
    }

    public LoginResponse(String token, UserInfo user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    public static class UserInfo {
        private Long id;
        private String username;
        private String email;
        private Integer xp;

        public UserInfo() {
        }

        public UserInfo(Long id, String username, String email, Integer xp) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.xp = xp;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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

        public Integer getXp() {
            return xp;
        }

        public void setXp(Integer xp) {
            this.xp = xp;
        }
    }
}
