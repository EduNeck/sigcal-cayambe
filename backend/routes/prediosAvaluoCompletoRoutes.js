const express = require('express');
const router = express.Router();
const { getPrediosAvaluoCompleto } = require('../db/models/prediosAvaluoCompleto');

// GET /api/predios-avaluo?campo1=valor1&campo2=valor2...
router.get('/predios-avaluo', async (req, res) => {
  try {
    const filters = req.query;
    const result = await getPrediosAvaluoCompleto(filters);
    res.json(result);
  } catch (error) {
    console.error('Error al consultar vista_predio_avaluo_completo:', error);
    res.status(500).json({ error: 'Error al consultar vista_predio_avaluo_completo' });
  }
});

module.exports = router;
