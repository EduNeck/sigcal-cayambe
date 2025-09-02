import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  /**
   * Obtiene todas las actividades
   * @returns {Promise} Promise con la lista de actividades
   */
  obtenerActividades() {
    return axios.get(`${API_BASE_URL}/actividades`);
  },

  /**
   * Obtiene una actividad por su ID
   * @param {number} id - ID de la actividad
   * @returns {Promise} Promise con los datos de la actividad
   */
  obtenerActividadPorId(id) {
    return axios.get(`${API_BASE_URL}/actividades/${id}`);
  }
};
