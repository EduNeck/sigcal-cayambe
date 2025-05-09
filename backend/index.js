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

const seguridadRoutes = require('./routes/seguridad');
app.use('/api', seguridadRoutes);


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`)
})
