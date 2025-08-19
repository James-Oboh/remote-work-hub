// src/services/api.ts
// This file centralizes all API calls and error handling logic.

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8085/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the Authorization token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors, specifically 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized request. Logging out.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  // Login function that returns the backend data directly
  login: async (credentials: { username: string; password: string }) => {
    try {
      console.log('API: Sending login request with credentials:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('API: Received successful login response:', response.data);
      return response.data; // This is the key: return the data payload
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      console.error('API: Login request failed with error:', error.response?.data);
      throw new Error(message);
    }
  },
  
  // Register function that returns the backend data directly
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      console.log('API: Sending registration request with data:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('API: Received successful registration response:', response.data);
      return response.data; // This is the key: return the data payload
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      console.error('API: Registration request failed with error:', error.response?.data);
      throw new Error(message);
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
};

// ... other APIs (teamAPI, taskAPI, userAPI)
// These are not changed as they are not the source of the current issue




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