import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  /**
   * Obtener todas las compatibilidades
   * @returns {Promise} Promesa con la respuesta
   */
  obtenerCompatibilidades() {
    console.log('🔍 Service: Obteniendo todas las compatibilidades');
    return axios.get(`${API_BASE_URL}/compatibilidades`);
  },

  /**
   * Obtener una compatibilidad por su ID
   * @param {Number} id - ID de la compatibilidad
   * @returns {Promise} Promesa con la respuesta
   */
  obtenerCompatibilidadPorId(id) {
    console.log(`🔍 Service: Obteniendo compatibilidad con ID ${id}`);
    return axios.get(`${API_BASE_URL}/compatibilidades/${id}`);
  },

  /**
   * Obtener resultado de compatibilidad entre una tipología y un uso de suelo
   * @param {String} idTipologia - ID de la tipología
   * @param {String} idUso - ID del uso de suelo (usc)
   * @returns {Promise} Promesa con la respuesta
   */
  obtenerCompatibilidadPorTipologiaYUso(idTipologia, idUso) {
    console.log(`🔍 Service: Consultando compatibilidad para tipología ${idTipologia} y uso ${idUso}`);
    
    // Asegurarse de que los IDs sean strings y estén correctamente formateados
    const tipologiaId = String(idTipologia).trim();
    const usoId = String(idUso).trim();
    
    console.log(`🔍 Service: Parámetros formateados: tipología=${tipologiaId}, uso=${usoId}`);
    console.log(`🔍 Service: URL completa: ${API_BASE_URL}/compatibilidades/tipologia-uso/resultado?idTipologia=${encodeURIComponent(tipologiaId)}&idUso=${encodeURIComponent(usoId)}`);
    
    return axios.get(`${API_BASE_URL}/compatibilidades/tipologia-uso/resultado`, {
      params: {
        idTipologia: tipologiaId,
        idUso: usoId
      }
    })
    .then(response => {
      console.log(`✅ Service: Respuesta exitosa para compatibilidad:`, response);
      return response;
    })
    .catch(error => {
      console.log(`ℹ️ Service: Ocurrió un error al consultar compatibilidad para ${tipologiaId} y ${usoId}`);
      
      // Si es un 404, esto es un caso esperado cuando no hay una compatibilidad definida
      if (error.response?.status === 404) {
        console.log(`ℹ️ Service: No se encontró compatibilidad para tipología ${tipologiaId} y uso ${usoId} (404)`);
        console.log(`ℹ️ Service: Este caso se manejará como "NO COMPATIBLE → PROHIBIDO"`);
      } else {
        console.error(`❌ Service: Error al obtener compatibilidad:`, error);
        console.error('❌ Service: Status:', error.response?.status);
        console.error('❌ Service: Detalles:', error.response?.data || error.message);
      }
      
      throw error;
    });
  }
};
