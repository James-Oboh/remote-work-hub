// This file centralizes all API calls and error handling logic.

import axios from 'axios'; 
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ResetPasswordRequest
} from '../types'; 

// Set the base URL for all API requests.
const API_BASE_URL = 'http://localhost:8085/api/v1';

// Create a custom axios instance with a base URL and default headers.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Custom type guard to check if an unknown error is an AxiosError.
 * This is a robust workaround if `axios.isAxiosError` is not available.
 * @param error The error object to check.
 * @returns True if the error is an AxiosError, otherwise false.
 */

interface AxiosError extends Error {
  isAxiosError?: boolean;
  response?: {
    status?: number;
    data?: any;
  };
}
const isAxiosError = (error: any): error is AxiosError => {
  return (error as AxiosError).isAxiosError !== undefined;
};


// --- Interceptors for Authentication and Error Handling ---
// These interceptors run on every request and response, centralizing common logic.

// Request interceptor: adds the Authorization token to all outgoing requests.
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage.
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handles common response errors, specifically 401 Unauthorized.
api.interceptors.response.use(
  (response) => response, 
  (error: any) => { 
    // FIX: Use the custom type guard for safe error handling.
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error('Unauthorized request. Logging out.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);


// --- Generic Request Handler ---
// This helper function reduces repetitive try/catch blocks in your API calls.
const requestHandler = async <T, P>(
  // FIX: Change the request type to `Promise<any>` to avoid the `AxiosResponse` error
  request: (params?: P) => Promise<any>,
  params?: P
): Promise<T> => {
  try {
    const response = await request(params);
    return response.data; // Return the data directly to simplify usage
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred.';
    console.error('API request failed:', message, error.response?.data);
    throw new Error(message);
  }
};

// API Endpoints

// Auth API endpoints
export const authAPI = {
  login: (credentials: LoginRequest) => api.post<AuthResponse>('/auth/login', credentials),
  register: (userData: RegisterRequest) => api.post<AuthResponse>('/auth/register', userData),
  forgotPassword: (data: { email: string }) => api.post('/auth/forgot-password', data),
  resetPassword: (data: ResetPasswordRequest) => api.post('/auth/reset-password', data),
  logout: () => {
    localStorage.removeItem('token');
  },
};

// Team API endpoints
export const teamAPI = {
  getAllTeams: () => api.get('/teams'),
  getTeamById: (id: number) => api.get(`/teams/${id}`),
  createTeam: (teamData: {
    name: string;
    description: string;
    managerId?: number;
  }) => api.post('/teams', teamData),
  updateTeam: (id: number, teamData: any) => api.put(`/teams/${id}`, teamData),
  deleteTeam: (id: number) => api.delete(`/teams/${id}`),
  addMember: (teamId: number, userId: number) =>
    api.post(`/teams/${teamId}/add-member/${userId}`),
  removeMember: (teamId: number, userId: number) =>
    api.delete(`/teams/${teamId}/members/${userId}`),
};

// Task API endpoints
export const taskAPI = {
  getAllTasks: () => api.get('/tasks'),
  getTaskById: (id: number) => api.get(`/tasks/${id}`),
  getTasksByTeam: (teamId: number) => api.get(`/tasks/team/${teamId}`),
  createTask: (taskData: {
    title: string;
    description: string;
    teamId: number;
    assignedToId?: number;
    deadline?: string;
    priority?: string;
  }) => api.post('/tasks', taskData),
  updateTask: (id: number, taskData: any) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id: number) => api.delete(`/tasks/${id}`),
  assignTask: (taskId: number, userId: number) =>
    api.put(`/tasks/${taskId}/assign/${userId}`),
  completeTask: (taskId: number) => api.put(`/tasks/${taskId}/complete`),
  certifyTask: (taskId: number) => api.put(`/tasks/${taskId}/certify`),
  getActiveTasksByTeam: (teamId: number) => api.get(`/tasks/team/${teamId}/active`),
  getActiveTasksByUser: (userId: number) => api.get(`/tasks/user/${userId}/active`),
};

// User API endpoints
export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (userData: any) => api.put('/users/me', userData),
  getAllUsers: () => api.get('/users'),
  getUserById: (id: number) => api.get(`/users/${id}`),
};


export default api;
