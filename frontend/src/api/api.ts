import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';
export const IMG_BASE = BACKEND_URL;

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
