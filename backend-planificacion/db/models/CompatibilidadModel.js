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
        SELECT com_id, tip_id, tipo, uso_id, fcode
        FROM planificacion.compatibilidad
        ORDER BY com_id
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
        SELECT com_id, tip_id, tipo, uso_id, fcode
        FROM planificacion.compatibilidad
        WHERE com_id = $1
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
      
      const { tip_id, tipo, uso_id, fcode } = compatibilidadData;
      
      const query = `
        INSERT INTO planificacion.compatibilidad (tip_id, tipo, uso_id, fcode)
        VALUES ($1, $2, $3, $4)
        RETURNING com_id, tip_id, tipo, uso_id, fcode
      `;
      
      const result = await client.query(query, [tip_id, tipo, uso_id, fcode]);
      
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
      
      const { tip_id, tipo, uso_id, fcode } = compatibilidadData;
      
      const query = `
        UPDATE planificacion.compatibilidad
        SET tip_id = $1, tipo = $2, uso_id = $3, fcode = $4
        WHERE com_id = $5
        RETURNING com_id, tip_id, tipo, uso_id, fcode
      `;
      
      const result = await client.query(query, [tip_id, tipo, uso_id, fcode, id]);
      
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
        WHERE com_id = $1
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
  }
};

module.exports = CompatibilidadModel;
