# CS 321 Quiz Platform

A fullstack quiz application built with React/Vite (frontend) and Java/Spring Boot (backend).

## Project Structure

```
/
├── frontend/   (React/Vite)
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── backend/    (Spring Boot)
│   ├── src/
│   └── pom.xml
├── README.md
└── .gitignore
```

---

# Frontend – React/Vite

## Sprint 1 Frontend

## Project Structure

```
frontend/
  src/
    api/
      - authApi.js
      - quizApi.js
    components/
      - Navbar.jsx
      - ProtectedRoute.jsx
      - QuestionCard.jsx
      - ErrorMessage.jsx
      - LoadingSpinner.jsx
    pages/
      - LoginPage.jsx
      - QuizPage.jsx
      - ResultsPage.jsx
    context/
      - AuthContext.jsx
    styles/
      - auth.css
      - quiz.css
      - results.css
      - common.css
    App.jsx
    main.jsx
  package.json
  vite.config.js
  index.html
  .env
```

## Prerequisites

1. **Node.js 16+** - Install from https://nodejs.org/
2. **Backend Running** - Ensure backend is running on http://localhost:8080

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Frontend will start on **http://localhost:5173**

### 3. Build for Production

```bash
npm run build
```

---

## Environment Variables

Edit `.env` file:

```properties
VITE_API_BASE_URL=http://localhost:8080
```

---

## Features

- ✅ User Registration
- ✅ User Login
- ✅ Dynamic Quiz Questions (from backend)
- ✅ Answer Selection
- ✅ Quiz Submission
- ✅ Score Display
- ✅ XP Tracking
- ✅ Modern Duolingo-style UI
- ✅ Protected Routes
- ✅ Local State Persistence

---

## Testing the Flow

1. Open http://localhost:5173
2. Click "Register" tab
3. Enter username, email, password
4. Submit registration
5. Switch to "Login" tab and login with credentials
6. Answer quiz questions
7. Submit quiz
8. View results with XP gained

---

## Common Issues

### Cannot reach backend API
- Verify backend is running on http://localhost:8080
- Check API base URL in `.env` file
- Ensure CORS is enabled on backend

### Styling issues
- Clear browser cache
- Restart dev server: `npm run dev`

### Port 5173 already in use
```bash
npm run dev -- --port 5174
```

---

## File Descriptions

| File | Purpose |
|------|---------|
| authApi.js | Axios calls for register/login |
| quizApi.js | Axios calls for questions/submit |
| AuthContext.jsx | Global auth state management |
| ProtectedRoute.jsx | Route protection for authenticated users |
| LoginPage.jsx | Registration & login form |
| QuizPage.jsx | Quiz display & answer selection |
| ResultsPage.jsx | Score & XP display |
| common.css | Shared styling & navbar |
| auth.css | Login/register page styling |
| quiz.css | Quiz page styling |
| results.css | Results page styling |

---

# Backend – Java/Spring Boot

## Sprint 1 Backend

## Project Structure

```
backend/
  src/
    main/
      java/com/example/codingplatform/
        controller/
          - AuthController.java
          - QuizController.java
        service/
          - AuthService.java
          - QuizService.java
        repository/
          - UserRepository.java
          - QuestionRepository.java
          - UserProgressRepository.java
        entity/
          - User.java
          - Question.java
          - UserProgress.java
        dto/
          - RegisterRequest.java
          - LoginRequest.java
          - AuthResponse.java
          - UserDTO.java
          - QuestionDTO.java
          - QuizSubmitRequest.java
          - QuizResultResponse.java
        config/
          - SecurityConfig.java
          - DataSeeder.java
        CodingPlatformApplication.java
      resources/
        - application.properties
  pom.xml
```

## Prerequisites

1. **Java 17+** - Install from https://adoptopenjdk.net/
2. **Maven** - Install from https://maven.apache.org/
3. **PostgreSQL** - Install from https://www.postgresql.org/

## Setup Instructions

### 1. PostgreSQL Database Setup

```sql
CREATE DATABASE cs321_quiz_db;
```

### 2. Update application.properties (if needed)

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cs321_quiz_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### 3. Build Backend

```bash
cd backend
mvn clean package
```

### 4. Run Backend

```bash
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

---

## API Endpoints

### Authentication

#### Register User
```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "identifier": "john_doe",
  "password": "password123"
}
```

### Quiz

#### Get All Questions
```http
GET http://localhost:8080/api/questions
```

#### Submit Quiz
```http
POST http://localhost:8080/api/quiz/submit?userId=1
Content-Type: application/json
```

---

## Troubleshooting

### PostgreSQL Connection Error
- Verify PostgreSQL is running: `psql -U postgres`
- Check username/password in `application.properties`
- Ensure database `cs321_quiz_db` exists

### Port 8080 Already in Use
```bash
# Find process using port 8080
netstat -ano | findstr :8080
```

### Build Fails
```bash
mvn clean install -U
```
