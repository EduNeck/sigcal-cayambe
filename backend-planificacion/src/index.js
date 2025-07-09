const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

// ... otras rutas ...

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`API Planificación corriendo en puerto ${PORT}`);
});
