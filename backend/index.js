const express = require('express')
const cors = require('cors')
const pool = require('./db/config')  // archivo de conexión a PostgreSQL
require('dotenv').config()

const app = express()

// ========== Probar conexión a PostgreSQL ==========
console.log('🔄 Probando conexión a PostgreSQL...');
pool.query('SELECT NOW()')
  .then(res => console.log('✅ Conectado a PostgreSQL:', res.rows[0]))
  .catch(err => console.error('❌ Error de conexión a PostgreSQL:', err));

// ========== Configuración de CORS ==========
app.use(cors({
  origin: [
    'http://localhost',
    'http://localhost:5173',
    'http://172.27.224.1',
    'http://172.27.224.1:5173',
    'http://172.27.224.1:3001'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ========== Rutas de prueba ==========
app.get('/', (req, res) => {
  res.send('API SIGCAL funcionando');
});

app.get('/api/ping', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al conectar con PostgreSQL');
  }
});

// ========== Rutas del sistema ==========
app.use('/api', require('./routes/seguridadRoutes'));
app.use('/api', require('./routes/avaluosRoutes'));
app.use('/api', require('./routes/catalogoRoutes'));
app.use('/api', require('./routes/catalogoFotosRoutes'));
app.use('/api', require('./routes/catalogoProvinciaCantonRoutes'));
app.use('/api', require('./routes/catastroBloquesRoutes'));
app.use('/api', require('./routes/catastroCiudadanoRoutes'));
app.use('/api', require('./routes/catastroDocumentosRoutes'));
app.use('/api', require('./routes/catastroMejorasRoutes'));
app.use('/api', require('./routes/catastroPredioRoutes'));
app.use('/api', require('./routes/catastroTenenciaRoutes'));
app.use('/api', require('./routes/catastroViasRoutes'));
app.use('/api', require('./routes/certificadoCatastralRoutes'));
app.use('/api', require('./routes/certificadoLinderosRoutes'));
app.use('/api', require('./routes/geoConsultasRoutes'));
app.use('/api', require('./routes/parametrosGeneralesRoutes'));
app.use('/api', require('./routes/reporteFichaRoutes'));
app.use('/api', require('./routes/validacionesRoutes'));
app.use('/api', require('./routes/valoracionRoutes'));
app.use('/api', require('./routes/prediosAvaluoCompletoRoutes'));
app.use('/api', require('./routes/croquisRoutes'));

// ========== Middleware de logging ==========
app.use((req, res, next) => {
  console.log(`[BACKEND] ${req.method} ${req.originalUrl}`);
  next();
});

// ========== Iniciar servidor ==========
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend corriendo en http://0.0.0.0:${PORT}`);
});
