import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Interceptor de Pedidos (Request): Adiciona o token a cada pedido que sai.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// NOVO: Interceptor de Respostas (Response): Lida com erros de token expirado.
apiClient.interceptors.response.use(
  // Se a resposta for bem-sucedida, não faz nada.
  (response) => response,
  // Se a resposta der erro...
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (Unauthorized) e ainda não tentámos atualizar o token...
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca que já tentámos uma vez

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        // Pedimos um novo access_token usando o refresh_token
        const { data } = await apiClient.post('api/auth/login/refresh/', {
          refresh: refreshToken,
        });

        // Guardamos o novo token
        localStorage.setItem('access_token', data.access);
        // Atualizamos o cabeçalho do pedido original com o novo token
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;

        // Tentamos novamente o pedido original que tinha falhado
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Se a atualização do token falhar (ex: refresh_token também expirou),
        // limpamos tudo e redirecionamos para o login.
        console.error("Sessão expirada. Por favor, faça login novamente.", refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // A linha abaixo irá forçar um recarregamento da página, e o ProtectedRoute
        // irá redirecionar para o login.
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    // Para qualquer outro erro, simplesmente rejeitamos a promessa.
    return Promise.reject(error);
  }
);

export default apiClient;
