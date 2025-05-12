const express = require('express');
const router = express.Router();
const parametrosGeneralesModel = require('../db/models/parametrosGenerales');


// Obtener parámetros generales
router.get('/parametros_generales', async (req, res) => {
  try {
    const data = await parametrosGeneralesModel.getParametrosGenerales();
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener parámetros generales:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
