import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function registerUser(payload) {
  return authClient.post('/api/auth/register', payload);
}

export function loginUser(payload) {
  return authClient.post('/api/auth/login', payload);
}
