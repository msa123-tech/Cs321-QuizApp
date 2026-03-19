# CS 321 Quiz Platform - Sprint 1 Frontend

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
