// src/config/apiConfig.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Verifica si la variable de entorno está definida
if (!API_BASE_URL || API_BASE_URL === 'undefined') {
  console.warn('[⚠️] API_BASE_URL no está definido correctamente.');
}

export default API_BASE_URL;
