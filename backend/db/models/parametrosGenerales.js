const { pool } = require('../config');

/**
 * Consulta todos los parámetros generales
 * @returns {Promise<Array>} Lista de parámetros generales
 */
async function getParametrosGenerales() {
  const query = `
    SELECT codigo, url, descripcion, fecha_registro
    FROM public.parametro_directorio;
  `;
  
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error al obtener parámetros generales:', error);
    throw error;
  }
}

/**
 * Obtiene un parámetro específico por su código
 * @param {string} codigo - Código del parámetro a buscar
 * @returns {Promise<Object>} Parámetro encontrado o null
 */
async function getParametroByCodigo(codigo) {
  const query = `
    SELECT codigo, url, descripcion, fecha_registro
    FROM public.parametro_directorio
    WHERE codigo = $1;
  `;
  const values = [codigo];
  
  try {
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error al obtener parámetro por código:', error);
    throw error;
  }
}

/**
 * Busca parámetros por descripción
 * @param {string} descripcion - Descripción para filtrar parámetros
 * @returns {Promise<Array>} Lista de parámetros que coinciden con la descripción
 */
async function getParametrosByDescripcion(descripcion) {
  const query = `
    SELECT codigo, url, descripcion, fecha_registro
    FROM public.parametro_directorio
    WHERE descripcion ILIKE $1;
  `;
  const values = [`%${descripcion}%`];
  
  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error al buscar parámetros por descripción:', error);
    throw error;
  }
}

/**
 * Crea un nuevo parámetro
 * @param {Object} parametro - Objeto con los datos del parámetro
 * @param {string} parametro.codigo - Código único del parámetro
 * @param {string} parametro.url - URL del parámetro
 * @param {string} parametro.descripcion - Descripción del parámetro
 * @param {Date} parametro.fecha_registro - Fecha de registro (opcional)
 * @returns {Promise<Object>} Parámetro creado
 */
async function createParametro(parametro) {
  const query = `
    INSERT INTO public.parametro_directorio (codigo, url, descripcion, fecha_registro)
    VALUES ($1, $2, $3, $4)
    RETURNING codigo, url, descripcion, fecha_registro;
  `;
  const values = [
    parametro.codigo,
    parametro.url,
    parametro.descripcion,
    parametro.fecha_registro || new Date()
  ];
  
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error al crear parámetro:', error);
    throw error;
  }
}

/**
 * Actualiza un parámetro existente
 * @param {string} codigo - Código del parámetro a actualizar
 * @param {Object} parametro - Datos actualizados del parámetro
 * @param {string} parametro.url - URL actualizada
 * @param {string} parametro.descripcion - Descripción actualizada
 * @param {Date} parametro.fecha_registro - Fecha de registro actualizada (opcional)
 * @returns {Promise<Object>} Parámetro actualizado o null si no se encuentra
 */
async function updateParametro(codigo, parametro) {
  const query = `
    UPDATE public.parametro_directorio
    SET url = $1,
        descripcion = $2,
        fecha_registro = $3
    WHERE codigo = $4
    RETURNING codigo, url, descripcion, fecha_registro;
  `;
  const values = [
    parametro.url,
    parametro.descripcion,
    parametro.fecha_registro || new Date(),
    codigo
  ];
  
  try {
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error al actualizar parámetro:', error);
    throw error;
  }
}

/**
 * Elimina un parámetro por su código
 * @param {string} codigo - Código del parámetro a eliminar
 * @returns {Promise<Object>} Parámetro eliminado o null si no se encuentra
 */
async function deleteParametro(codigo) {
  const query = `
    DELETE FROM public.parametro_directorio
    WHERE codigo = $1
    RETURNING codigo, url, descripcion, fecha_registro;
  `;
  const values = [codigo];
  
  try {
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error al eliminar parámetro:', error);
    throw error;
  }
}

module.exports = {
  getParametrosGenerales,
  getParametroByCodigo,
  getParametrosByDescripcion,
  createParametro,
  updateParametro,
  deleteParametro
};
