import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Adicionar token de autenticação caso disponível
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
