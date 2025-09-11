import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  /**
   * Obtiene todas las tipologías
   * @returns {Promise} Promise con la lista de tipologías
   */
  obtenerTipologias() {
    console.log('🔍 Service: Obteniendo todas las tipologías');
    return axios.get(`${API_BASE_URL}/tipologias`);
  },

  /**
   * Obtiene una tipología por su ID
   * @param {string|number} id - ID de la tipología (puede ser texto o número)
   * @returns {Promise} Promise con los datos de la tipología
   */
  obtenerTipologiaPorId(id) {
    console.log(`🔍 Service: Obteniendo tipología con ID ${id}`);
    console.log(`🔍 Service: TIPO DE DATO del ID recibido: ${typeof id}`);
    console.log(`🔍 Service: VALOR EXACTO: ${JSON.stringify(id)}`);
    
    // Asegurarse de que el ID sea un string y esté correctamente formateado
    const idString = String(id).trim();
    console.log(`🔍 Service: ID convertido a string: ${idString}`);
    console.log(`🔍 Service: URL completa: ${API_BASE_URL}/tipologias/${encodeURIComponent(idString)}`);
    
    return axios.get(`${API_BASE_URL}/tipologias/${encodeURIComponent(idString)}`)
      .then(response => {
        console.log(`✅ Service: Respuesta exitosa para tipología ID ${idString}:`, response);
        console.log(`✅ Service: Datos recibidos:`, JSON.stringify(response.data));
        
        // Verificar y registrar estructura de datos
        if (response.data && response.data.success && response.data.data) {
          const tipologia = response.data.data;
          console.log('✅ Service: Estructura de la tipología:', {
            'Tiene id': 'id' in tipologia,
            'Tiene codigo': 'codigo' in tipologia,
            'Tiene id_tipologia': 'id_tipologia' in tipologia,
            'Tiene nombre': 'nombre' in tipologia
          });
          
          // Si no tiene un ID explícito, asignarle el ID que usamos para buscar
          if (!tipologia.id && !tipologia.codigo && !tipologia.id_tipologia) {
            console.log('⚠️ Service: La tipología no tiene ID, asignando ID de búsqueda:', idString);
            response.data.data.id = idString;
          }
        }
        
        return response;
      })
      .catch(error => {
        console.error(`❌ Service: Error al obtener tipología ID ${idString}:`, error);
        console.error('❌ Service: Status:', error.response?.status);
        console.error('❌ Service: Detalles:', error.response?.data || error.message);
        throw error;
      });
  }
};
