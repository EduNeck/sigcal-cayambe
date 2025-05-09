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



module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
