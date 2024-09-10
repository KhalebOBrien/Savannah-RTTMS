import axios from 'axios';
import routes from '../routes/routes';

const api = axios.create({
  baseURL: 'http://localhost:1543/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = routes.LOGIN_PAGE;
    }
    return Promise.reject(error);
  },
);

export default api;
