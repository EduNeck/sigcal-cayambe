const db = require('../config');

/**
 * Modelo para la tabla planificacion.compatibilidad
 */
const CompatibilidadModel = {
  /**
   * Obtener todas las compatibilidades
   * @returns {Promise<Array>} Lista de compatibilidades
   */
  async obtenerCompatibilidades() {
    try {
      const query = `
        SELECT id_compatibilidad, id_tipologia, tipo, id_uso, fcode, resultado
        FROM planificacion.compatibilidad
        ORDER BY id_compatibilidad
      `;
      
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener compatibilidades:', error);
      throw error;
    }
  },

  /**
   * Obtener una compatibilidad por su ID
   * @param {Number} id - ID de la compatibilidad
   * @returns {Promise<Object>} Datos de la compatibilidad
   */
  async obtenerCompatibilidadPorId(id) {
    try {
      const query = `
        SELECT id_compatibilidad, id_tipologia, tipo, id_uso, fcode, resultado
        FROM planificacion.compatibilidad
        WHERE id_compatibilidad = $1
      `;
      
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error al obtener compatibilidad por ID:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva compatibilidad
   * @param {Object} compatibilidadData - Datos de la compatibilidad a crear
   * @returns {Promise<Object>} Compatibilidad creada
   */
  async crearCompatibilidad(compatibilidadData) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { id_tipologia, tipo, id_uso, fcode, resultado } = compatibilidadData;
      
      const query = `
        INSERT INTO planificacion.compatibilidad (id_tipologia, tipo, id_uso, fcode, resultado)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id_compatibilidad, id_tipologia, tipo, id_uso, fcode, resultado
      `;
      
      const result = await client.query(query, [id_tipologia, tipo, id_uso, fcode, resultado]);
      
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al crear compatibilidad:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Actualizar una compatibilidad existente
   * @param {Number} id - ID de la compatibilidad a actualizar
   * @param {Object} compatibilidadData - Nuevos datos de la compatibilidad
   * @returns {Promise<Object>} Compatibilidad actualizada
   */
  async actualizarCompatibilidad(id, compatibilidadData) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { id_tipologia, tipo, id_uso, fcode, resultado } = compatibilidadData;
      
      const query = `
        UPDATE planificacion.compatibilidad
        SET id_tipologia = $1, tipo = $2, id_uso = $3, fcode = $4, resultado = $5
        WHERE id_compatibilidad = $6
        RETURNING id_compatibilidad, id_tipologia, tipo, id_uso, fcode, resultado
      `;
      
      const result = await client.query(query, [id_tipologia, tipo, id_uso, fcode, resultado, id]);
      
      if (result.rowCount === 0) {
        throw new Error(`No se encontró la compatibilidad con ID ${id}`);
      }
      
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al actualizar compatibilidad:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Eliminar una compatibilidad
   * @param {Number} id - ID de la compatibilidad a eliminar
   * @returns {Promise<Boolean>} true si se eliminó correctamente
   */
  async eliminarCompatibilidad(id) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const query = `
        DELETE FROM planificacion.compatibilidad
        WHERE id_compatibilidad = $1
      `;
      
      const result = await client.query(query, [id]);
      
      if (result.rowCount === 0) {
        throw new Error(`No se encontró la compatibilidad con ID ${id}`);
      }
      
      await client.query('COMMIT');
      
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al eliminar compatibilidad:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Obtener resultado de compatibilidad entre una tipología y un uso de suelo
   * @param {String} idTipologia - ID de la tipología
   * @param {String} idUso - ID del uso de suelo (usc)
   * @returns {Promise<Object>} Resultado de la compatibilidad
   */
  async obtenerCompatibilidadPorTipologiaYUso(idTipologia, idUso) {
    try {
      const query = `
        SELECT resultado, tipo, fcode
        FROM planificacion.compatibilidad
        WHERE id_tipologia = $1 AND id_uso = $2
      `;
      
      const result = await db.query(query, [idTipologia, idUso]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error al obtener compatibilidad por tipología y uso:', error);
      throw error;
    }
  }
};

module.exports = CompatibilidadModel;
