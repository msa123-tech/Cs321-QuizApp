import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const progressClient = axios.create({
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

export function fetchUserProgress(userId, token) {
  return progressClient.get(`/api/progress/${userId}`, {
    headers: authHeaders(token),
  });
}
