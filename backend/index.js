const express = require('express')
const cors = require('cors')
const pool = require('./db/config')
require('dotenv').config()

const app = express()

// Configuración de CORS
app.use(cors({
  origin: [
    'http://localhost:5173',               // entorno local
    'http://172.23.7.18:5173',             // IP interna del servidor 
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// Endpoint base de prueba
app.get('/', (req, res) => {
  res.send('API SIGCAL funcionando')
})

// Endpoint de prueba conexión
app.get('/api/ping', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Error al conectar con PostgreSQL')
  }
})

// Rutas del sistema
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

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[BACKEND] ${req.method} ${req.originalUrl}`);
  next();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`)
})
