const express = require('express');
const router = express.Router();
const catalogoDominiosModel = require('../db/models/catalogoDominios');

// GET /api/catalogo_dominios
router.get('/catalogo_dominios', async (req, res) => {
  try {
    const dominios = await catalogoDominiosModel.catalogoDominios();
    res.json(dominios);
  } catch (error) {
    console.error('Error en /catalogo_dominios:', error);
    res.status(500).json({ error: 'Error al obtener los dominios del catálogo' });
  }
});

module.exports = router;
