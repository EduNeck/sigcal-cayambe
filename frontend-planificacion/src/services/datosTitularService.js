import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

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
      `${API_BASE_URL}/datos-titular/busquedaAvanzada`, 
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
      `${API_BASE_URL}/datos-titular/recuperarDatosTitular/${id}`, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }
};
