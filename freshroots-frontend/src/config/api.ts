import axios, { InternalAxiosRequestConfig } from 'axios';

export const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Adds "Authorization: Bearer <token>" from localStorage if present
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const storedUser = localStorage.getItem('freshroots_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch {
        // ignore JSON parse errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to extract clean error message from backend
export function getApiErrorMessage(error: unknown, defaultMessage = 'An unexpected error occurred'): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        return error.response.data;
      }
      if (typeof error.response.data === 'object' && error.response.data !== null) {
        const data = error.response.data as { message?: string; error?: string };
        return data.message || data.error || error.message;
      }
    }
    if (error.code === 'ERR_NETWORK') {
      return 'Unable to reach backend server at http://localhost:8080/api. Please verify your Spring Boot service is active.';
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}
