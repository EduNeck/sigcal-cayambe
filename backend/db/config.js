const dotenv = require('dotenv');
const { Pool } = require('pg');

// Cargar variables de entorno
dotenv.config();

// Crear el pool de conexiones
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Evento: Conexión exitosa
pool.on('connect', () => {
  console.log('[DB] Conectado correctamente a PostgreSQL');
});

// Evento: Error en el cliente (idle)
pool.on('error', (err) => {
  console.error('[DB] Error inesperado en cliente idle:', err);
  process.exit(-1);
});

/**
 * Ejecutar una consulta SQL
 * @param {string} query - Consulta SQL a ejecutar
 * @param {Array} params - Parámetros para la consulta
 * @returns {Promise<Array>} - Promesa que se resuelve con los resultados de la consulta
 */
const execQuery = async (query, params) => {
  try {
    const res = await pool.query(query, params);
    return res.rows;
  } catch (error) {
    console.error('[DB] Error al ejecutar consulta:', error);
    throw error;
  }
};

/**
 * Ejecutar una consulta SQL y obtener solo el primer resultado
 * @param {string} query - Consulta SQL a ejecutar
 * @param {Array} params - Parámetros para la consulta
 * @returns {Promise<Object|null>} - Promesa que se resuelve con el primer resultado o null
 */
const execQueryOne = async (query, params) => {
  try {
    const res = await pool.query(query, params);
    return res.rows[0] || null;
  } catch (error) {
    console.error('[DB] Error al ejecutar consulta para un resultado:', error);
    throw error;
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  execQuery,
  execQueryOne
};
