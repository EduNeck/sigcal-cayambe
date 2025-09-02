const db = require('../config');

/**
 * Modelo para la tabla planificacion.actividad
 */
const ActividadModel = {
  /**
   * Obtener todas las actividades
   * @returns {Promise<Array>} Lista de actividades
   */
  async obtenerActividades() {
    try {
      const query = `
        SELECT id_actividad, tipo, descripcion
        FROM planificacion.actividad
        ORDER BY id_actividad
      `;
      
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      throw error;
    }
  },

  /**
   * Obtener una actividad por su ID
   * @param {Number} id - ID de la actividad
   * @returns {Promise<Object>} Datos de la actividad
   */
  async obtenerActividadPorId(id) {
    try {
      const query = `
        SELECT id_actividad, tipo, descripcion
        FROM planificacion.actividad
        WHERE id_actividad = $1
      `;
      
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error al obtener actividad por ID:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva actividad
   * @param {Object} actividadData - Datos de la actividad a crear
   * @returns {Promise<Object>} Actividad creada
   */
  async crearActividad(actividadData) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { tipo, descripcion } = actividadData;
      
      const query = `
        INSERT INTO planificacion.actividad (tipo, descripcion)
        VALUES ($1, $2)
        RETURNING id_actividad, tipo, descripcion
      `;
      
      const result = await client.query(query, [tipo, descripcion]);
      
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al crear actividad:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Actualizar una actividad existente
   * @param {Number} id - ID de la actividad a actualizar
   * @param {Object} actividadData - Nuevos datos de la actividad
   * @returns {Promise<Object>} Actividad actualizada
   */
  async actualizarActividad(id, actividadData) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { tipo, descripcion } = actividadData;
      
      const query = `
        UPDATE planificacion.actividad
        SET tipo = $1, descripcion = $2
        WHERE id_actividad = $3
        RETURNING id_actividad, tipo, descripcion
      `;
      
      const result = await client.query(query, [tipo, descripcion, id]);
      
      if (result.rowCount === 0) {
        throw new Error(`No se encontró la actividad con ID ${id}`);
      }
      
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al actualizar actividad:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Eliminar una actividad
   * @param {Number} id - ID de la actividad a eliminar
   * @returns {Promise<Boolean>} true si se eliminó correctamente
   */
  async eliminarActividad(id) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const query = `
        DELETE FROM planificacion.actividad
        WHERE id_actividad = $1
      `;
      
      const result = await client.query(query, [id]);
      
      if (result.rowCount === 0) {
        throw new Error(`No se encontró la actividad con ID ${id}`);
      }
      
      await client.query('COMMIT');
      
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al eliminar actividad:', error);
      throw error;
    } finally {
      client.release();
    }
  }
};

module.exports = ActividadModel;
