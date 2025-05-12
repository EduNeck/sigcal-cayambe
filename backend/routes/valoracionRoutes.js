const express = require('express');
const router = express.Router();
const valoracionModel = require('../db/models/valoracion');


// Calcular valoración
router.post('/calcula_valoracion', async (req, res) => {
  try {
    const result = await valoracionModel.calculateValoracion(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error al calcular valoración:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
