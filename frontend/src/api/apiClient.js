import axios from 'axios';

const apiClient = axios.create({
  // Aponte para o URL base da sua API Django
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Interceptor: Adiciona o token de autenticação a todos os pedidos
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
