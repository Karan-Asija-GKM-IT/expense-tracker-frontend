import axios from 'axios';
import API_URL from '../config.js';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});


api.interceptors.request.use((configs) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    configs.headers.Authorization = `Bearer ${token}`;
  }
  return configs;
});
export default api;
