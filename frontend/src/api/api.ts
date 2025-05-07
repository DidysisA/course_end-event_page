import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
});

// No explicit type annotation here – TS will infer
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    // ensure headers object exists
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
