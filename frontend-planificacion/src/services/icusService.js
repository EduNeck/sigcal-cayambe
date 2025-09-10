import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  /**
   * Crear un nuevo ICUS
   * @param {Object} data - Datos del ICUS a crear
   * @returns {Promise} Promesa con la respuesta
   */
  crearIcus(data) {
    return axios.post(`${API_BASE_URL}/icus/crearIcus`, data)
      .then(response => {
        console.log('✅ Service ICUS: ICUS creado con éxito:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ Service ICUS: Error al crear ICUS:', error);
        console.error('❌ Detalles:', error.response?.data || error.message);
        throw error;
      });
  },

  /**
   * Obtener un ICUS por su ID
   * @param {Number} id - ID del ICUS
   * @returns {Promise} Promesa con los datos del ICUS
   */
  obtenerIcusPorId(id) {
    console.log(`🔍 Service ICUS: Obteniendo ICUS con ID ${id}`);
    return axios.get(`${API_BASE_URL}/icus/recuperarIcus/${id}`)
      .then(response => {
        console.log('✅ Service ICUS: ICUS obtenido:', response.data);
        
        // Si la respuesta no tiene el formato esperado pero parece un ICUS válido,
        // lo adaptamos al formato esperado para mantener compatibilidad
        if (response.data && 
            typeof response.data === 'object' && 
            response.data.id && 
            !response.data.success) {
          console.log('Adaptando formato de respuesta para mantener compatibilidad');
          
          // No modificamos el objeto original de response
          return {
            ...response,
            originalData: response.data, // Guardamos los datos originales por si acaso
            data: {
              success: true,
              data: response.data
            }
          };
        }
        
        return response;
      })
      .catch(error => {
        console.error(`❌ Service ICUS: Error al obtener ICUS con ID ${id}:`, error);
        console.error('❌ Detalles:', error.response?.data || error.message);
        throw error;
      });
  },

  /**
   * Obtener lista de ICUS con paginación y búsqueda
   * @param {Object} params - Parámetros de búsqueda
   * @param {Number} params.page - Número de página
   * @param {Number} params.limit - Límite de registros por página
   * @param {String} params.search - Texto de búsqueda
   * @returns {Promise} Promesa con la lista de ICUS y datos de paginación
   */
  obtenerIcus(params = {}) {
    const { page = 1, limit = 10, search = '' } = params;
    
    console.log('🔍 Service ICUS: Listando ICUS con parámetros:', { page, limit, search });
    
    return axios.get(`${API_BASE_URL}/icus/recuperarIcus`, {
      params: { page, limit, search }
    })
      .then(response => {
        console.log('✅ Service ICUS: Lista de ICUS obtenida:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ Service ICUS: Error al listar ICUS:', error);
        console.error('❌ Detalles:', error.response?.data || error.message);
        throw error;
      });
  },

  /**
   * Actualizar un ICUS existente
   * @param {Number} id - ID del ICUS
   * @param {Object} data - Datos a actualizar
   * @returns {Promise} Promesa con la respuesta
   */
  actualizarIcus(id, data) {
    console.log(`🔄 Service ICUS: Actualizando ICUS con ID ${id}`);
    return axios.put(`${API_BASE_URL}/icus/actualizarIcus/${id}`, data)
      .then(response => {
        console.log('✅ Service ICUS: ICUS actualizado:', response.data);
        return response;
      })
      .catch(error => {
        console.error(`❌ Service ICUS: Error al actualizar ICUS con ID ${id}:`, error);
        console.error('❌ Detalles:', error.response?.data || error.message);
        throw error;
      });
  },

  /**
   * Eliminar un ICUS
   * @param {Number} id - ID del ICUS a eliminar
   * @returns {Promise} Promesa con la respuesta
   */
  eliminarIcus(id) {
    console.log(`🗑️ Service ICUS: Eliminando ICUS con ID ${id}`);
    return axios.delete(`${API_BASE_URL}/icus/eliminarIcus/${id}`)
      .then(response => {
        console.log('✅ Service ICUS: ICUS eliminado:', response.data);
        return response;
      })
      .catch(error => {
        console.error(`❌ Service ICUS: Error al eliminar ICUS con ID ${id}:`, error);
        console.error('❌ Detalles:', error.response?.data || error.message);
        throw error;
      });
  },

  /**
   * Buscar ICUS por criterios avanzados
   * @param {Object} criterios - Criterios de búsqueda
   * @returns {Promise} Promesa con los resultados de búsqueda
   */
  buscarIcus(criterios = {}) {
    console.log('🔍 Service ICUS: Buscando ICUS con criterios:', criterios);
    
    return axios.get(`${API_BASE_URL}/icus/buscar`, {
      params: criterios
    })
      .then(response => {
        console.log('✅ Service ICUS: Resultado de búsqueda:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ Service ICUS: Error al buscar ICUS:', error);
        console.error('❌ Detalles:', error.response?.data || error.message);
        throw error;
      });
  }
};
