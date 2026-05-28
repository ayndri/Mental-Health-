'use client';

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('seribu_cerita_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('seribu_cerita_token');
        localStorage.removeItem('seribu_cerita_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  getProfile: () => api.get('/api/profile'),
  updateProfile: (data) => api.put('/api/profile', data),
};

// ─── Journal ──────────────────────────────────────────────────────────────────
export const journalAPI = {
  getAll: () => api.get('/api/journals'),
  getOne: (id) => api.get(`/api/journals/${id}`),
  create: (data) => api.post('/api/journals', data),
  update: (id, data) => api.put(`/api/journals/${id}`, data),
  delete: (id) => api.delete(`/api/journals/${id}`),
};

// ─── Chat ─────────────────────────────────────────────────────────────────────
export const chatAPI = {
  getHistory: (date) => api.get('/api/chat/history', date ? { params: { date } } : {}),
  getSessions: () => api.get('/api/chat/sessions'),
  sendMessage: (data) => api.post('/api/chat', data),
};

// ─── Highlights ───────────────────────────────────────────────────────────────
export const highlightsAPI = {
  getAll: () => api.get('/api/highlights'),
  create: (data) => api.post('/api/highlights', data),
  delete: (id) => api.delete(`/api/highlights/${id}`),
};

// ─── Guest Chat (no auth) ─────────────────────────────────────────────────────
export const guestChatAPI = {
  send: (message, history) => api.post('/api/guest-chat', { message, history }),
  summary: (history) => api.post('/api/guest-chat/summary', { history }),
};

// ─── Articles ─────────────────────────────────────────────────────────────────
export const articlesAPI = {
  getAll:       (params) => api.get('/api/articles', { params }),
  getBySlug:    (slug)   => api.get(`/api/articles/${slug}`),
  getRecommended: (emotion) => api.get('/api/articles/recommended', { params: { emotion } }),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  login: (password) => api.post('/api/admin/login', { password }),
  getStats: (token) => api.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
  getUsers: (token) => api.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
};

export default api;
