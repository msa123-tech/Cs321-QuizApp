# CS 321 Quiz Platform

A fullstack quiz application built with React/Vite (frontend) and Java/Spring Boot (backend).

## Project Structure

```
/
├── frontend/   (React/Vite)  →  runs on http://localhost:5173
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── backend/    (Spring Boot) →  runs on http://localhost:8080
│   ├── src/
│   └── pom.xml
├── start.sh    ← run BOTH servers with one command
├── README.md
└── .gitignore
```

---

## 🚀 Quick Start (Run the Full App)

> **Prerequisites:** Node.js 16+, Java 17+, Maven

> ℹ️ **No database setup needed!** The backend uses an embedded H2 in-memory database out of the box.

### Step 1 – Start both servers

```bash
# From the project root, run both frontend and backend together:
./start.sh
```

Or start them separately in two terminal windows:

**Terminal 1 – Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 – Frontend:**
```bash
cd frontend
npm install       # first time only
npm run dev
```

### Step 2 – Open the app in your browser

```
http://localhost:5173
```

### Step 3 – Try it out

1. Click **"Register"** and create an account
2. Click **"Login"** and sign in
3. Answer the quiz questions
4. Submit the quiz and see your score & XP

> 💡 You can also view the H2 database console at http://localhost:8080/h2-console
> (JDBC URL: `jdbc:h2:mem:cs321_quiz_db`, user: `sa`, password: *(leave blank)*)

---

# Frontend – React/Vite

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
# (still inside the frontend/ directory)
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

> The backend uses an **H2 in-memory database** by default — no PostgreSQL installation required for local development.
> To switch to PostgreSQL, see the optional step below.

## Setup Instructions

### 1. (Optional) Switch to PostgreSQL

By default the app uses H2. To use PostgreSQL instead, update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cs321_quiz_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

And create the database first:

```bash
psql -U postgres -c "CREATE DATABASE cs321_quiz_db;"
```

### 2. Build Backend

```bash
cd backend
mvn clean package
```

### 3. Run Backend

```bash
# (still inside the backend/ directory)
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
