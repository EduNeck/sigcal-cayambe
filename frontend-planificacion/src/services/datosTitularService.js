import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

export default {
  /**
   * Realiza una búsqueda avanzada de titulares por múltiples parámetros
   * @param {Object} params - Parámetros de búsqueda 
   * @param {string} params.claveCatastral - Clave catastral (opcional)
   * @param {string} params.nombres - Nombres del titular (opcional)
   * @param {string} params.numeroDocumento - Número de documento (opcional)
   * @returns {Promise} Promise con los resultados de la búsqueda
   */
  busquedaAvanzada(params) {
    return axios.post(
      `${API_URL}/datos-titular/busquedaAvanzada`, 
      params,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  },

  /**
   * Obtiene un titular por su ID
   * @param {number} id - ID del titular
   * @returns {Promise} Promise con los datos del titular
   */
  obtenerPorId(id) {
    return axios.get(
      `${API_URL}/datos-titular/recuperarDatosTitular/${id}`, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }
};
