const express = require('express');
const router = express.Router();
const { getPredioExtentByCodCat } = require('../db/models/croquis');

// GET /api/bbox_predio/:codCat
router.get('/bbox_predio/:codCat', async (req, res) => {
  try {
    const codCat = req.params.codCat;
    const result = await getPredioExtentByCodCat(codCat);
    res.json(result);
  } catch (error) {
    console.error('Error al obtener la extensión del predio:', error);
    res.status(500).json({ error: 'Error al obtener la extensión del predio' });
  }
});

module.exports = router;
