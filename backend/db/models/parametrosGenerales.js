const { pool } = require('../config');

// Consulta de parámetros generales (alias para consultarParametros)
async function getParametrosGenerales() {
  return await consultarParametros();
}

// Ingreso de parámetros
async function insertarParametro(parametro) {
  const query = `INSERT INTO public.parametro_directorio (codigo, url, descripcion, fecha_registro)
                 VALUES ($1, $2, $3, $4) RETURNING *`;
  const values = [parametro.codigo, parametro.url, parametro.descripcion, parametro.fecha_registro];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Modificación de parámetros
async function modificarParametro(codigo, parametro) {
  const query = `UPDATE public.parametro_directorio
                 SET url = $1, descripcion = $2, fecha_registro = $3
                 WHERE codigo = $4 RETURNING *`;
  const values = [parametro.url, parametro.descripcion, parametro.fecha_registro, codigo];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Eliminación de parámetros
async function eliminarParametro(codigo) {
  const query = `DELETE FROM public.parametro_directorio WHERE codigo = $1 RETURNING *`;
  const values = [codigo];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Consulta de parámetros
async function consultarParametros() {
  const query = `SELECT codigo, url, descripcion, fecha_registro FROM public.parametro_directorio`;
  const result = await pool.query(query);
  return result.rows;
}

async function consultarParametrosByDescripcion(descripcion) {
  const query = `
    SELECT codigo, url, descripcion, fecha_registro
    FROM public.parametro_directorio
    WHERE descripcion = $1;
  `;
  const values = [descripcion];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error ejecutando la consulta:', error);
    throw error;
  }
}

module.exports = {
  getParametrosGenerales,
  insertarParametro,
  modificarParametro,
  eliminarParametro,
  consultarParametros,
  consultarParametrosByDescripcion
};