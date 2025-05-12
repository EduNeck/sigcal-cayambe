const express = require('express')
const cors = require('cors')
const pool = require('./db/config')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API SIGCAL funcionando')
})

app.get('/api/ping', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Error al conectar con PostgreSQL')
  }
})

// Importar las rutas

const seguridadRoutes = require('./routes/seguridadRoutes');
app.use('/api', seguridadRoutes);

const avaluosRoutes = require('./routes/avaluosRoutes');
app.use('/api', avaluosRoutes);

const catalogoRoutes = require('./routes/catalogoRoutes');
app.use('/api', catalogoRoutes);

const catalogoFotosRoutes = require('./routes/catalogoFotosRoutes');
app.use('/api', catalogoFotosRoutes);

const catalogoProvinciaCantonRoutes = require('./routes/catalogoProvinciaCantonRoutes');
app.use('/api', catalogoProvinciaCantonRoutes);

const catastroBloquesRoutes = require('./routes/catastroBloquesRoutes');
app.use('/api', catastroBloquesRoutes);

const catastroCiudadanoRoutes = require('./routes/catastroCiudadanoRoutes');
app.use('/api', catastroCiudadanoRoutes);

const catastroDocumentosRoutes = require('./routes/catastroDocumentosRoutes');
app.use('/api', catastroDocumentosRoutes);

const catastroMejorasRoutes = require('./routes/catastroMejorasRoutes');
app.use('/api', catastroMejorasRoutes);

const catastroPredioRoutes = require('./routes/catastroPredioRoutes');
app.use('/api', catastroPredioRoutes);

const catastroTenenciaRoutes = require('./routes/catastroTenenciaRoutes');
app.use('/api', catastroTenenciaRoutes);

const catastroViasRoutes = require('./routes/catastroViasRoutes');
app.use('/api', catastroViasRoutes);

const certificadoCatastralRoutes = require('./routes/certificadoCatastralRoutes');
app.use('/api', certificadoCatastralRoutes);

const geoConsultasRoutes = require('./routes/geoConsultasRoutes');
app.use('/api', geoConsultasRoutes);

const parametrosGeneralesRoutes = require('./routes/parametrosGeneralesRoutes');
app.use('/api', parametrosGeneralesRoutes);

const reporteFichaRoutes = require('./routes/reporteFichaRoutes');
app.use('/api', reporteFichaRoutes);

const validacionesRoutes = require('./routes/validacionesRoutes');
app.use('/api', validacionesRoutes);

const valoracionRoutes = require('./routes/valoracionRoutes');
app.use('/api', valoracionRoutes);

app.use((req, res, next) => {
  console.log(`[BACKEND] ${req.method} ${req.originalUrl}`);
  next();
});

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`)
})
