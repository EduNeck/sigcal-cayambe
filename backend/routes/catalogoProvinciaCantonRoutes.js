const express = require('express');
const router = express.Router();

const catalogoProvinciaCantonModel = require('../db/models/catalogoProvinciaCanton');

// Obtener todas las provincias
router.get('/catalogo_provincia', async (req, res) => {
  try {
    const data = await catalogoProvinciaCantonModel.getProvincias();
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener provincias:', err);
    res.status(500).send('Error al obtener provincias');
  }
});

// Obtener todos los cantones por ID de provincia
router.get('/catalogo_cantonByProvincia/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catalogoProvinciaCantonModel.getCantonesByProvincia(id);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener cantones:', err);
    res.status(500).send('Error al obtener cantones');
  }
});

module.exports = router;
