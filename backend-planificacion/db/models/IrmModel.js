const db = require('../config');

/**
 * Crear un nuevo IRM
 * @param {Object} irmData - Datos del IRM a crear
 * @returns {Promise<Object>} - Objeto con los datos del IRM creado
 */
async function insertaIrm(irmData) {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      fecha, 
      tipo,
      tipo_predio,
      id_ciudadano,
      numero_documento,
      clave_catastral,
      clave_anterior,
      derechos_acciones,
      area_construccion,
      area_escritura,
      area_grafica,
      frente,
      tiene_construccion,
      parroquia,
      barrio_sector,
      notas_irm,
      agua,
      energia_electrica,
      alcantarillado,
      otros,
      usuario,
      fecha_reporte
    } = irmData;

    // Insertar el IRM principal
    const query = `
      INSERT INTO planificacion.irm (
        fecha, tipo, tipo_predio, id_ciudadano, numero_documento, clave_catastral, clave_anterior,
        derechos_acciones, area_construccion, area_escritura, area_grafica, frente,
        tiene_construccion, parroquia, barrio_sector, notas_irm, agua,
        energia_electrica, alcantarillado, otros, usuario, fecha_reporte
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING id_irm
    `;
    
    const values = [
      fecha, tipo, tipo_predio, id_ciudadano, numero_documento, clave_catastral, clave_anterior,
      derechos_acciones, area_construccion, area_escritura, area_grafica, frente,
      tiene_construccion, parroquia, barrio_sector, notas_irm, agua,
      energia_electrica, alcantarillado, otros, usuario, fecha_reporte || new Date()
    ];

    const result = await client.query(query, values);
    await client.query('COMMIT');
    
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear IRM:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Obtener un IRM por su ID
 * @param {Number} id - ID del certificado
 * @returns {Promise<Object>} - Objeto con los datos del IRM
 */
async function recuperaIrmById(id) {
  try {
    const query = 'SELECT * FROM planificacion.irm WHERE id_irm = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener IRM por ID:', error);
    throw error;
  }
}

/**
 * Buscar IRMs con filtros
 * @param {Object} filters - Filtros para la búsqueda
 * @param {Number} page - Número de página
 * @param {Number} limit - Límite de resultados por página
 * @returns {Promise<Object>} - Objeto con los resultados y metadata de paginación
 */
async function buscaIrms(filters = {}, page = 1, limit = 10) {
  try {
    const { clave_catastral, id_ciudadano, fecha_desde, fecha_hasta } = filters;
    
    let queryText = 'SELECT * FROM planificacion.irm WHERE 1=1';
    const queryParams = [];
    let paramCount = 1;
    
    // Aplicar filtros si existen
    if (clave_catastral) {
      queryText += ` AND clave_catastral LIKE $${paramCount}`;
      queryParams.push(`%${clave_catastral}%`);
      paramCount++;
    }
    
    if (id_ciudadano) {
      queryText += ` AND id_ciudadano = $${paramCount}`;
      queryParams.push(id_ciudadano);
      paramCount++;
    }
    
    if (fecha_desde) {
      queryText += ` AND fecha >= $${paramCount}`;
      queryParams.push(fecha_desde);
      paramCount++;
    }
    
    if (fecha_hasta) {
      queryText += ` AND fecha <= $${paramCount}`;
      queryParams.push(fecha_hasta);
      paramCount++;
    }
    
    // Agregar ordenamiento y paginación
    const offset = (page - 1) * limit;
    queryText += ` ORDER BY fecha DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(limit, offset);
    
    // Ejecutar la consulta
    const result = await db.query(queryText, queryParams);
    
    // Contar total de registros para la paginación
    let countQueryText = 'SELECT COUNT(*) FROM planificacion.irm WHERE 1=1';
    const countQueryParams = [];
    paramCount = 1;
    
    if (clave_catastral) {
      countQueryText += ` AND clave_catastral LIKE $${paramCount}`;
      countQueryParams.push(`%${clave_catastral}%`);
      paramCount++;
    }
    
    if (id_ciudadano) {
      countQueryText += ` AND id_ciudadano = $${paramCount}`;
      countQueryParams.push(id_ciudadano);
      paramCount++;
    }
    
    if (fecha_desde) {
      countQueryText += ` AND fecha >= $${paramCount}`;
      countQueryParams.push(fecha_desde);
      paramCount++;
    }
    
    if (fecha_hasta) {
      countQueryText += ` AND fecha <= $${paramCount}`;
      countQueryParams.push(fecha_hasta);
      paramCount++;
    }
    
    const countResult = await db.query(countQueryText, countQueryParams);
    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalItems,
        totalPages
      }
    };
  } catch (error) {
    console.error('Error al buscar IRMs:', error);
    throw error;
  }
}

/**
 * Actualizar un IRM
 * @param {Number} id - ID del certificado
 * @param {Object} irmData - Datos actualizados del IRM
 * @returns {Promise<Object>} - Objeto con los datos del IRM actualizado
 */
async function actualizaIrm(id, irmData) {
  try {
    const allowedFields = [
      'fecha', 'tipo', 'tipo_predio', 'id_ciudadano', 'numero_documento', 'clave_catastral', 
      'clave_anterior', 'derechos_acciones', 'area_construccion', 'area_escritura',
      'area_grafica', 'frente', 'tiene_construccion', 'parroquia', 'barrio_sector',
      'notas_irm', 'agua', 'energia_electrica', 'alcantarillado', 'otros',
      'usuario', 'fecha_reporte'
    ];
    
    // Construir la consulta dinámicamente
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    Object.keys(irmData).forEach(key => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramCount}`);
        values.push(irmData[key]);
        paramCount++;
      }
    });
    
    if (updates.length === 0) {
      throw new Error('No se proporcionaron campos válidos para actualizar');
    }
    
    values.push(id);
    
    const query = `
      UPDATE planificacion.irm 
      SET ${updates.join(', ')} 
      WHERE id_irm = $${paramCount} 
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    
    if (result.rowCount === 0) {
      throw new Error(`No se encontró el IRM con ID ${id}`);
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar IRM:', error);
    throw error;
  }
}

/**
 * Eliminar un IRM
 * @param {Number} id - ID del certificado
 * @returns {Promise<Boolean>} - True si se eliminó correctamente
 */
async function eliminaIrm(id) {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Primero eliminamos los detalles relacionados
    await client.query(
      'DELETE FROM planificacion.detalle_irm WHERE id_irm_regulacion = $1',
      [id]
    );
    
    // Luego eliminamos el IRM principal
    const result = await client.query(
      'DELETE FROM planificacion.irm WHERE id_irm = $1',
      [id]
    );
    
    await client.query('COMMIT');
    
    return result.rowCount > 0;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al eliminar IRM:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  insertaIrm,
  recuperaIrmById,
  buscaIrms,
  actualizaIrm,
  eliminaIrm
};
