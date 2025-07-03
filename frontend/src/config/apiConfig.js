// src/config/apiConfig.js

// Función para obtener la URL base de la API
const getApiBaseUrl = () => {
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Si la URL está definida en las variables de entorno, úsala
  if (envApiUrl && envApiUrl !== 'undefined') {
    return envApiUrl;
  }

  // Determinar la URL base basada en el entorno
  const isProduction = import.meta.env.PROD;
  if (isProduction) {
    // En producción, usa la URL del servidor
    return 'http://172.23.7.55:3001';
  } else {
    // En desarrollo, usa localhost
    return 'http://localhost:3001';
  }
};

const API_CONFIG = {
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 segundos
};

console.log('[📡] API Config:', {
  baseURL: API_CONFIG.baseURL,
  environment: import.meta.env.MODE,
  production: import.meta.env.PROD
});

export default API_CONFIG;
