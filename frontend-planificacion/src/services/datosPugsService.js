import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const datosPugsService = {
  /**
   * Obtener datos PUGS por clave catastral
   * @param {string} claveCatastral - Clave catastral a consultar
   * @returns {Promise<Object>} Respuesta con los datos PUGS
   */
  obtenerPorClaveCatastral: async (claveCatastral) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/datos-pugs/${claveCatastral}`);
      return response;
    } catch (error) {
      console.error('Error al obtener datos PUGS:', error);
      throw error;
    }
  }
};

export default datosPugsService;
