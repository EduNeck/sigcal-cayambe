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
    console.log('🔍 Service datosTitular: Iniciando búsqueda avanzada con parámetros:', params);
    return axios.post(`${API_BASE_URL}/datos-titular/busquedaAvanzada`, params)
      .then(response => {
        console.log('✅ Service datosTitular: Respuesta búsqueda:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ Service datosTitular: Error en búsqueda:', error);
        console.error('❌ Detalles:', error.response?.data || error.message);
        throw error;
      });
  },

  /**
   * Obtiene un titular por su ID
   * @param {number} id - ID del titular
   * @returns {Promise} Promise con los datos del titular
   */
  obtenerPorId(id) {
    return axios.get(`${API_BASE_URL}/datos-titular/recuperarDatosTitular/${id}`);
  }
};
