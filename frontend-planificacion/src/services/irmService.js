import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api';

// Función para obtener el token actualizado desde localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Función para manejar errores de autenticación
const handleAuthError = (error) => {
  console.error('Error de autenticación:', error);
  
  // Si es un error de autenticación, podríamos redirigir al login
  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    console.warn('Token inválido o expirado. Redirigiendo al login...');
    // Aquí podrías redirigir al login o mostrar un mensaje
    // window.location.href = '/login';
  }
  
  throw error;
};

const irmService = {
  // Crear un nuevo IRM
  crearIRM: async (datosIRM) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        console.error('No hay token de autenticación disponible');
        throw new Error('No hay token de autenticación disponible');
      }
      
      console.log('Enviando solicitud para crear IRM con token:', token.substring(0, 15) + '...');
      
      return await axios.post(`${API_URL}/irm`, datosIRM, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      return handleAuthError(error);
    }
  },
  
  // Obtener un IRM por ID
  obtenerIRMPorId: async (id) => {
    try {
      const token = getAuthToken();
      return await axios.get(`${API_URL}/irm/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      return handleAuthError(error);
    }
  },
  
  // Listar IRMs con filtros
  listarIRMs: async (params = {}) => {
    try {
      const token = getAuthToken();
      return await axios.get(`${API_URL}/irm`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      return handleAuthError(error);
    }
  }
};

export default irmService;
