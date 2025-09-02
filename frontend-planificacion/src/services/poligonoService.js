import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  /**
   * Obtener el polígono de un predio por su clave catastral
   * @param {string} claveCatastral - Clave catastral del predio
   * @returns {Promise} Promise con los datos del polígono del predio
   */
  obtenerPoligonoPorClaveCatastral(claveCatastral) {
    return axios.get(
      `${API_BASE_URL}/geometria-predio/${claveCatastral}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }
};
