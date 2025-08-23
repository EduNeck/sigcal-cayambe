const dotenv = require('dotenv');
const { Pool } = require('pg');

// Cargar variables de entorno
dotenv.config();

// Crear el pool de conexiones
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'sigcalcayambe',
  port: process.env.PGPORT || 5432,
});

// Evento: Conexión exitosa
pool.on('connect', () => {
  console.log('[DB-PLANIFICACIÓN] Conectado correctamente a PostgreSQL');
});

// Evento: Error en el cliente (idle)
pool.on('error', (err) => {
  console.error('[DB-PLANIFICACIÓN] Error inesperado en cliente idle:', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
