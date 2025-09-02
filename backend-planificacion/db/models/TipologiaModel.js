const db = require('../config');

/**
 * Modelo para la tabla planificacion.tipologia
 */
const TipologiaModel = {
  /**
   * Obtener todas las tipologías
   * @returns {Promise<Array>} Lista de tipologías
   */
  async obtenerTipologias() {
    try {
      const query = `
        SELECT id_tipologia, tipo, nombre, descriptacion, nivel
        FROM planificacion.tipologia
        ORDER BY id_tipologia
      `;
      
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener tipologías:', error);
      throw error;
    }
  },

  /**
   * Obtener una tipología por su ID
   * @param {Number} id_tipologia - ID de la tipología
   * @returns {Promise<Object>} Datos de la tipología
   */
  async obtenerTipologiaPorId(id_tipologia) {
    try {
      console.log(`Model: Buscando tipología con ID '${id_tipologia}', tipo: ${typeof id_tipologia}`);
      
      const query = `
        SELECT id_tipologia, tipo, nombre, descriptacion, nivel
        FROM planificacion.tipologia
        WHERE id_tipologia = $1
      `;
      
      console.log(`Model: Ejecutando consulta SQL con parámetro:`, [id_tipologia]);
      const result = await db.query(query, [id_tipologia]);
      
      console.log(`Model: Filas encontradas: ${result.rowCount}`);
      if (result.rowCount > 0) {
        console.log(`Model: Tipología encontrada:`, JSON.stringify(result.rows[0]));
      } else {
        console.log(`Model: No se encontró tipología con ID '${id_tipologia}'`);
        
        // Log adicional: buscar todas las tipologías para verificar
        console.log(`Model: Verificando todas las tipologías disponibles...`);
        const allResult = await db.query(`
          SELECT id_tipologia 
          FROM planificacion.tipologia 
          ORDER BY id_tipologia
          LIMIT 10
        `);
        console.log(`Model: Primeros 10 IDs disponibles:`, allResult.rows.map(r => r.id_tipologia));
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error al obtener tipología por ID:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva tipología
   * @param {Object} tipologiaData - Datos de la tipología a crear
   * @returns {Promise<Object>} Tipología creada
   */
  async crearTipologia(tipologiaData) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { tipo, nombre, descriptacion, nivel } = tipologiaData;
      
      const query = `
        INSERT INTO planificacion.tipologia (tipo, nombre, descriptacion, nivel)
        VALUES ($1, $2, $3, $4)
        RETURNING id_tipologia, tipo, nombre, descriptacion, nivel
      `;
      
      const result = await client.query(query, [tipo, nombre, descriptacion, nivel]);
      
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al crear tipología:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Actualizar una tipología existente
   * @param {Number} id - ID de la tipología a actualizar
   * @param {Object} tipologiaData - Nuevos datos de la tipología
   * @returns {Promise<Object>} Tipología actualizada
   */
  async actualizarTipologia(id_tipologia, tipologiaData) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { tipo, nombre, descriptacion, nivel } = tipologiaData;
      
      const query = `
        UPDATE planificacion.tipologia
        SET tipo = $1, nombre = $2, descriptacion = $3, nivel = $4
        WHERE id_tipologia = $5
        RETURNING id_tipologia, tipo, nombre, descriptacion, nivel
      `;
      
      const result = await client.query(query, [tipo, nombre, descriptacion, nivel, id_tipologia]);
      
      if (result.rowCount === 0) {
        throw new Error(`No se encontró la tipología con ID ${id_tipologia}`);
      }
      
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al actualizar tipología:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Eliminar una tipología
   * @param {Number} id - ID de la tipología a eliminar
   * @returns {Promise<Boolean>} true si se eliminó correctamente
   */
  async eliminarTipologia(id_tipologia) {
    const client = await db.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const query = `
        DELETE FROM planificacion.tipologia
        WHERE id_tipologia = $1
      `;
      
      const result = await client.query(query, [id_tipologia]);
      
      if (result.rowCount === 0) {
        throw new Error(`No se encontró la tipología con ID ${id_tipologia}`);
      }
      
      await client.query('COMMIT');
      
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error al eliminar tipología:', error);
      throw error;
    } finally {
      client.release();
    }
  }
};

module.exports = TipologiaModel;
