const express = require('express');
const router = express.Router();
const geoConsultasModel = require('../db/models/geoConsultas');


// Realizar una consulta geográfica
router.post('/consulta_geografica', async (req, res) => {
  try {
    const result = await geoConsultasModel.performGeoQuery(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error en consulta geográfica:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
