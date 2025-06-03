const express = require('express');
const router = express.Router();
const { getCertificadoLinderosByClave } = require('../db/models/certificadoLinderos');

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

module.exports = router;
