const express = require('express');
const router = express.Router();
const catastroCiudadanoModel = require('../db/models/catastroCiudadano');

// Insertar un nuevo ciudadano
router.post('/inserta_ciudadano', async (req, res) => {
  try {
    const newRecord = await catastroCiudadanoModel.insertCatastroCiudadano(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('❌ Error al insertar ciudadano:', err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un ciudadano por su ID
router.put('/actualiza_ciudadano_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRecord = await catastroCiudadanoModel.updateCatastroCiudadano(id, req.body);
    res.json(updatedRecord);
  } catch (err) {
    console.error('❌ Error al actualizar ciudadano:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener un ciudadano por su ID
router.get('/ciudadano_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroCiudadanoModel.getCatastroCiudadanoById(id);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener ciudadano por ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un ciudadano por ID
router.delete('/elimina_ciudadano_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroCiudadanoModel.deleteCatastroCiudadanoById(id);
    if (data) {
      res.json({ message: 'Ciudadano eliminado con éxito', data });
    } else {
      res.status(404).json({ error: 'Ciudadano no encontrado' });
    }
  } catch (err) {
    console.error('❌ Error al eliminar ciudadano:', err);
    res.status(500).json({ error: 'Error del servidor. Inténtalo de nuevo más tarde.' });
  }
});

module.exports = router;
