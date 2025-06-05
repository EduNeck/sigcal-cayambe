const express = require('express');
const router = express.Router();
const { getCertificadoLinderosByClave, updateGeoLinderosByClave } = require('../db/models/certificadoLinderos');

// GET /api/certificado-linderos/:clave
router.get('/certificado-linderos/:clave', async (req, res) => {
  try {
    const clave = req.params.clave;
    const result = await getCertificadoLinderosByClave(clave);
    res.json(result);
  } catch (error) {
    console.error('Error al consultar certificado_linderos:', error);
    res.status(500).json({ error: 'Error al consultar certificado_linderos' });
  }
});

// PUT /api/actualiza-linderos/:clave
router.put('/actualiza-linderos/:clave', async (req, res) => {
  try {
    const clave = req.params.clave;
    const data = { ...req.body, clave };
    const result = await updateGeoLinderosByClave(data);
    res.json(result);
  } catch (error) {
    console.error('Error al actualizar geo_linderos:', error);
    res.status(500).json({ error: 'Error al actualizar geo_linderos' });
  }
});

module.exports = router;
