// src/config/apiConfig.js
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

if (!API_BASE_URL || API_BASE_URL === 'undefined') {
  console.warn('[⚠️] API_BASE_URL no está definido correctamente.');
}

export default API_BASE_URL;
