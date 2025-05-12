const express = require('express');
const router = express.Router();
const catastroCiudadanoModel = require('../db/models/catastroCiudadano');

// Obtener todos los registros de catastro_ciudadano (con filtros)
router.get('/recupera_ciudadano', async (req, res) => {
  try {
    const data = await catastroCiudadanoModel.obtieneDatosCiudadano(req.query);
    res.json(data);
  } catch (err) {
    console.error('Error al recuperar ciudadanos:', err);
    res.status(500).send('Server Error');
  }
});

// Obtener un ciudadano por ID
router.get('/recupera_ciudadano_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroCiudadanoModel.obtieneDatosCiudadanoById(id);
    res.json(data);
  } catch (err) {
    console.error('Error al recuperar ciudadano por ID:', err);
    res.status(500).send('Server Error');
  }
});

// Insertar un nuevo ciudadano
router.post('/inserta_ciudadano', async (req, res) => {
  try {
    const newRecord = await catastroCiudadanoModel.insertaCiudadano(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('Error al insertar ciudadano:', err);
    res.status(500).send('Server Error');
  }
});

// Actualizar ciudadano por ID
router.put('/actualiza_ciudadano/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroCiudadanoModel.actualizaCiudadanoByid(id, req.body);
    res.json(data);
  } catch (err) {
    console.error('Error al actualizar ciudadano:', err);
    res.status(500).send('Server Error');
  }
});

// Obtener ciudadanos para tenencia
router.get('/ciudadano_tenencia', async (req, res) => {
  try {
    const data = await catastroCiudadanoModel.recuperaCiudadanoTenencia();
    res.json(data);
  } catch (err) {
    console.error('Error al obtener ciudadanos para tenencia:', err);
    res.status(500).send('Server Error');
  }
});

// Eliminar ciudadano por ID
router.delete('/elimina_ciudadano_by_id/:id', async (req, res) => {
  try {
    const data = await catastroCiudadanoModel.eliminaCiudadanoById(req.params.id);
    res.json(data);
  } catch (err) {
    console.error('Error deleting ciudadano:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
