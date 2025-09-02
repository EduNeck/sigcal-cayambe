import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const catastroService = {
  /**
   * Obtener datos de un predio por clave catastral
   * @param {string} claveCatastral - Clave catastral a consultar
   * @returns {Promise<Object>} Respuesta con los datos del predio
   */
  obtenerPredioPorClaveCatastral: async (claveCatastral) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/irm/predios/clave/${claveCatastral}`);
      return response;
    } catch (error) {
      console.error('Error al obtener datos del predio:', error);
      throw error;
    }
  }
};

export default catastroService;
