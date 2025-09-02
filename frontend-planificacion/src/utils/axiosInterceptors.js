import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';
import router from '@/router';

// Interceptor para manejar los tokens JWT y refresh
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores de autenticación
axios.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    
    // Si es un error 401 (Unauthorized) o 403 (Forbidden) y no hemos intentado renovar el token ya
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      localStorage.getItem('token')
    ) {
      originalRequest._retry = true;
      
      try {
        // Intentar renovar el token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // Si no hay refresh token, redirigir al login
          redirigirAlLogin();
          return Promise.reject(error);
        }
        
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        });
        
        if (response.data && response.data.token) {
          // Guardar el nuevo token
          localStorage.setItem('token', response.data.token);
          
          // Si también devuelve un nuevo refresh token
          if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          }
          
          // Reintentar la petición original con el nuevo token
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
          return axios(originalRequest);
        } else {
          // Si no se pudo renovar el token, redirigir al login
          redirigirAlLogin();
        }
      } catch (refreshError) {
        console.error('Error al renovar el token:', refreshError);
        redirigirAlLogin();
      }
    }
    
    return Promise.reject(error);
  }
);

// Función para redirigir al login
function redirigirAlLogin() {
  // Limpiar el almacenamiento local
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Mostrar un mensaje al usuario
  alert('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
  
  // Redirigir a la página de login
  if (router.currentRoute.value.name !== 'login') {
    router.push('/login');
  }
}

export default axios;
