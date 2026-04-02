import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const quizClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function authHeaders(token) {
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export function fetchQuestions(token) {
  return quizClient.get('/api/questions', {
    headers: authHeaders(token),
  });
}

export function submitQuiz(payload, token) {
  return quizClient.post('/api/quiz/submit', payload, {
    headers: authHeaders(token),
  });
}
