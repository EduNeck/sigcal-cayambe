const express = require('express');
const router = express.Router();
const avaluosModel = require('../db/models/avaluos');

// Ruta: Recuperar datos de patrimonio certificado
router.get('/patrimonio-certificado', async (req, res) => {
  const { clave_catastral, anio_proceso, tipo_predio } = req.query;

  if (!clave_catastral || !anio_proceso || !tipo_predio) {
    return res.status(400).json({ error: 'Los parámetros clave_catastral, anio_proceso y tipo_predio son requeridos.' });
  }

  try {
    const data = await avaluosModel.recuperaPatrimonioCertificado(clave_catastral, anio_proceso, tipo_predio);
    res.json(data);
  } catch (error) {
    console.error('Error al recuperar datos de patrimonio urbano:', error.message);
    res.status(500).json({ error: 'Error al recuperar datos de patrimonio urbano.' });
  }
});

module.exports = router;
