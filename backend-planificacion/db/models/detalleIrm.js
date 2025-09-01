const db = require('../config');

/**
 * Crear un nuevo detalle de IRM
 * @param {Object} detalleData - Datos del detalle de IRM a crear
 * @returns {Promise<Object>} - Objeto con los datos del detalle creado
 */
async function insertaDetalleIrm(detalleData) {
  try {
    const normalizar = (valor, tipo = 'texto') => {
      if (valor === undefined || valor === null || valor === '') {
        if (tipo === 'texto') return '';
        if (tipo === 'numero') return 0;
        if (tipo === 'booleano') return false;
        return null;
      }
      return valor;
    };

    const {
      id_certificado_regulacion,
      nombre_zona,
      implantacion,
      retiro_frontal,
      retiro_lateral_izq,
      retiro_lateral_der,
      retiro_posterior,
      altura_edificacion,
      numero_pisos,
      cos_pb,
      cos_total,
      lote_minimo,
      frente_minimo,
      observaciones
    } = detalleData;

    const query = `
      INSERT INTO planificacion.detalle_irm (
        id_certificado_regulacion,
        nombre_zona,
        implantacion,
        retiro_frontal,
        retiro_lateral_izq,
        retiro_lateral_der,
        retiro_posterior,
        altura_edificacion,
        numero_pisos,
        cos_pb,
        cos_total,
        lote_minimo,
        frente_minimo,
        observaciones
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    
    const values = [
      normalizar(id_certificado_regulacion, 'numero'),
      normalizar(nombre_zona),
      normalizar(implantacion),
      normalizar(retiro_frontal, 'numero'),
      normalizar(retiro_lateral_izq, 'numero'),
      normalizar(retiro_lateral_der, 'numero'),
      normalizar(retiro_posterior, 'numero'),
      normalizar(altura_edificacion, 'numero'),
      normalizar(numero_pisos, 'numero'),
      normalizar(cos_pb, 'numero'),
      normalizar(cos_total, 'numero'),
      normalizar(lote_minimo, 'numero'),
      normalizar(frente_minimo, 'numero'),
      normalizar(observaciones)
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    let errorMessage = 'Error al crear detalle de IRM';
    if (err.code) {
      switch (err.code) {
        case '23505':
          errorMessage = 'Error: Valor duplicado viola la restricción de unicidad';
          break;
        case '23503':
          errorMessage = `Error: Violación de clave foránea (${err.detail})`;
          break;
        case '23502':
          errorMessage = `Error: Valor nulo en la columna '${err.column}' viola la restricción NOT NULL`;
          break;
        case '22P02':
          errorMessage = 'Error: Sintaxis de entrada no válida (esperaba número y recibió texto)';
          break;
        default:
          errorMessage = `Error de base de datos: ${err.message}`;
      }
    } else {
      errorMessage = `Error ejecutando la consulta: ${err.stack}`;
    }

    console.error('==== ERROR CREANDO DETALLE IRM ====');
    console.error('Mensaje de error:', errorMessage);
    console.error('Datos recibidos que causaron el error:', detalleData);
    throw new Error(errorMessage);
  }
}

/**
 * Crear múltiples detalles de IRM en una transacción
 * @param {Array} detalles - Array de objetos con datos de detalles de IRM
 * @param {Number} idCertificado - ID del certificado IRM al que pertenecen los detalles
 * @returns {Promise<Array>} - Array con los detalles creados
 */
async function insertaMultiplesDetallesIrm(detalles, idCertificado) {
  const client = await db.pool.connect();
  const resultados = [];
  
  try {
    await client.query('BEGIN');
    
    for (const detalle of detalles) {
      // Asegurarse que cada detalle tenga el id_certificado_regulacion correcto
      detalle.id_certificado_regulacion = idCertificado;
      
      const normalizar = (valor, tipo = 'texto') => {
        if (valor === undefined || valor === null || valor === '') {
          if (tipo === 'texto') return '';
          if (tipo === 'numero') return 0;
          return null;
        }
        return valor;
      };

      const query = `
        INSERT INTO planificacion.detalle_irm (
          id_certificado_regulacion,
          nombre_zona,
          implantacion,
          retiro_frontal,
          retiro_lateral_izq,
          retiro_lateral_der,
          retiro_posterior,
          altura_edificacion,
          numero_pisos,
          cos_pb,
          cos_total,
          lote_minimo,
          frente_minimo,
          observaciones
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;
      
      const values = [
        normalizar(detalle.id_certificado_regulacion, 'numero'),
        normalizar(detalle.nombre_zona),
        normalizar(detalle.implantacion),
        normalizar(detalle.retiro_frontal, 'numero'),
        normalizar(detalle.retiro_lateral_izq, 'numero'),
        normalizar(detalle.retiro_lateral_der, 'numero'),
        normalizar(detalle.retiro_posterior, 'numero'),
        normalizar(detalle.altura_edificacion, 'numero'),
        normalizar(detalle.numero_pisos, 'numero'),
        normalizar(detalle.cos_pb, 'numero'),
        normalizar(detalle.cos_total, 'numero'),
        normalizar(detalle.lote_minimo, 'numero'),
        normalizar(detalle.frente_minimo, 'numero'),
        normalizar(detalle.observaciones)
      ];
      
      const result = await client.query(query, values);
      resultados.push(result.rows[0]);
    }
    
    await client.query('COMMIT');
    return resultados;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear múltiples detalles IRM:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Obtener todos los detalles de un IRM por el ID del certificado
 * @param {Number} idCertificado - ID del certificado IRM
 * @returns {Promise<Array>} - Array con los detalles del IRM
 */
async function recuperaDetallesByIrmId(idCertificado) {
  try {
    const query = 'SELECT * FROM planificacion.detalle_irm WHERE id_certificado_regulacion = $1 ORDER BY id_detalle_certificado';
    const result = await db.query(query, [idCertificado]);
    return result.rows;
  } catch (error) {
    console.error('Error al obtener detalles por ID de IRM:', error);
    throw error;
  }
}

/**
 * Obtener un detalle específico de IRM por su ID
 * @param {Number} id - ID del detalle de certificado
 * @returns {Promise<Object>} - Objeto con los datos del detalle
 */
async function recuperaDetalleById(id) {
  try {
    const query = 'SELECT * FROM planificacion.detalle_irm WHERE id_detalle_certificado = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener detalle IRM por ID:', error);
    throw error;
  }
}

/**
 * Actualizar un detalle de IRM
 * @param {Number} id - ID del detalle de certificado
 * @param {Object} detalleData - Datos actualizados del detalle
 * @returns {Promise<Object>} - Objeto con los datos del detalle actualizado
 */
async function actualizaDetalleIrm(id, detalleData) {
  try {
    const normalizar = (valor, tipo = 'texto') => {
      if (valor === undefined || valor === null || valor === '') {
        if (tipo === 'texto') return '';
        if (tipo === 'numero') return 0;
        return null;
      }
      return valor;
    };

    const allowedFields = [
      'nombre_zona',
      'implantacion',
      'retiro_frontal',
      'retiro_lateral_izq',
      'retiro_lateral_der',
      'retiro_posterior',
      'altura_edificacion',
      'numero_pisos',
      'cos_pb',
      'cos_total',
      'lote_minimo',
      'frente_minimo',
      'observaciones'
    ];
    
    // Construir la consulta dinámicamente
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    Object.keys(detalleData).forEach(key => {
      if (allowedFields.includes(key)) {
        updates.push(`${key} = $${paramCount}`);
        const tipo = ['retiro_frontal', 'retiro_lateral_izq', 'retiro_lateral_der', 
                     'retiro_posterior', 'altura_edificacion', 'numero_pisos', 
                     'cos_pb', 'cos_total', 'lote_minimo', 'frente_minimo'].includes(key) ? 'numero' : 'texto';
        values.push(normalizar(detalleData[key], tipo));
        paramCount++;
      }
    });
    
    if (updates.length === 0) {
      throw new Error('No se proporcionaron campos válidos para actualizar');
    }
    
    values.push(id);
    
    const query = `
      UPDATE planificacion.detalle_irm 
      SET ${updates.join(', ')} 
      WHERE id_detalle_certificado = $${paramCount} 
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    
    if (result.rowCount === 0) {
      throw new Error(`No se encontró el detalle de IRM con ID ${id}`);
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error al actualizar detalle IRM:', error);
    throw error;
  }
}

/**
 * Eliminar un detalle de IRM
 * @param {Number} id - ID del detalle de certificado
 * @returns {Promise<Boolean>} - True si se eliminó correctamente
 */
async function eliminaDetalleIrm(id) {
  try {
    const query = 'DELETE FROM planificacion.detalle_irm WHERE id_detalle_certificado = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error al eliminar detalle IRM:', error);
    throw error;
  }
}

/**
 * Eliminar todos los detalles asociados a un IRM
 * @param {Number} idCertificado - ID del certificado IRM
 * @returns {Promise<Number>} - Número de detalles eliminados
 */
async function eliminaDetallesByIrmId(idCertificado) {
  try {
    const query = 'DELETE FROM planificacion.detalle_irm WHERE id_certificado_regulacion = $1';
    const result = await db.query(query, [idCertificado]);
    return result.rowCount;
  } catch (error) {
    console.error('Error al eliminar detalles por ID de IRM:', error);
    throw error;
  }
}

module.exports = {
  insertaDetalleIrm,
  insertaMultiplesDetallesIrm,
  recuperaDetalleById,
  recuperaDetallesByIrmId,
  actualizaDetalleIrm,
  eliminaDetalleIrm,
  eliminaDetallesByIrmId
};
