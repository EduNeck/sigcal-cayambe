const express = require('express');
const cors = require('cors');
const pool = require('./src/db/config');  // Importamos la configuración de la BD
require('dotenv').config();

const app = express();

// ========== Probar conexión a PostgreSQL ==========
console.log('🔄 Probando conexión a PostgreSQL (Planificación)...');
pool.query('SELECT NOW()')
  .then(res => console.log('✅ Conectado a PostgreSQL (Planificación):', res.rows[0]))
  .catch(err => console.error('❌ Error de conexión a PostgreSQL (Planificación):', err));

// ========== Configuración de CORS ==========
// Para manejar el preflight de forma más permisiva
app.use((req, res, next) => {
  // Permitir cualquier origen en desarrollo - SOLO PARA DESARROLLO
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Responder OK a las solicitudes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Aplicamos la configuración de cors() después del middleware personalizado
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      // URLs de desarrollo
      'http://localhost',
      'http://localhost:5173',
      'http://localhost:3001',
      'http://localhost:4001',
      // URLs de red local
      'http://192.168.3.3',
      'http://192.168.3.3:5173',
      'http://192.168.3.3:3001',
      'http://192.168.3.3:4001',
      // URLs de producción
      'http://172.23.7.55:8090',
      'http://172.23.7.55:3001',
      'http://172.23.7.55:4001',
      'http://servidor-produccion',
      'http://servidor-produccion:5173',
      'http://servidor-produccion:3001',
      'http://servidor-produccion:4001',
      // Dominio real de producción
      'https://sigcal.cayambe.gob.ec'
    ];
    
    // Durante desarrollo, permitir solicitudes sin origin (como Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origen bloqueado por CORS:', origin);
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========== Middleware de logging ==========
app.use((req, res, next) => {
  console.log(`[BACKEND-PLANIFICACIÓN] ${req.method} ${req.originalUrl}`);
  next();
});

// ========== Rutas de prueba ==========
app.get('/', (req, res) => {
  res.send('API Planificación SIGCAL funcionando');
});

app.get('/api/ping', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al conectar con PostgreSQL (Planificación)');
  }
});

// ========== Rutas del sistema ==========
// Importamos las rutas desde la carpeta src
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/icus', require('./src/routes/icusRoute'));

// ========== Iniciar servidor ==========
const PORT = process.env.PORT || 4001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend-Planificación corriendo en http://0.0.0.0:${PORT}`);
});
