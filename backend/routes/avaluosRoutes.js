const express = require('express');
const router = express.Router();
const avaluosModel = require('../db/models/avaluos');

// Ruta: Recuperar datos de patrimonio urbano
router.post('/patrimonio-urbano', async (req, res) => {
  const { clave_catastral, anio_proceso } = req.body;

  if (!clave_catastral || !anio_proceso) {
    return res.status(400).json({ error: 'Los parámetros clave_catastral y anio_proceso son requeridos.' });
  }

  try {
    const data = await avaluosModel.getPatrimonioUrbano(clave_catastral, anio_proceso);
    res.json(data);
  } catch (error) {
    console.error('Error al recuperar datos de patrimonio urbano:', error.message);
    res.status(500).json({ error: 'Error al recuperar datos de patrimonio urbano.' });
  }
});

module.exports = router;
