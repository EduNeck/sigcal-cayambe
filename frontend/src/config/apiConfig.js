// src/config/apiConfig.js
const API_BASE_URL = '/api';

if (!API_BASE_URL || API_BASE_URL === 'undefined') {
  if (import.meta?.env?.MODE !== 'production') {
    console.warn('[ADVERTENCIA] API_BASE_URL no está correctamente definido en apiConfig.js');
  }
}

export default API_BASE_URL;
