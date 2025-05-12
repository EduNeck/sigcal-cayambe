const express = require('express');
const router = express.Router();
const catastroParroquiaModel = require('../db/models/catastroParroquia');

// Insertar una nueva parroquia
router.post('/inserta_parroquia', async (req, res) => {
  try {
    const newRecord = await catastroParroquiaModel.insertCatastroParroquia(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('❌ Error al insertar parroquia:', err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una parroquia por su ID
router.put('/actualiza_parroquia_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRecord = await catastroParroquiaModel.updateCatastroParroquia(id, req.body);
    res.json(updatedRecord);
  } catch (err) {
    console.error('❌ Error al actualizar parroquia:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener una parroquia por su ID
router.get('/parroquia_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroParroquiaModel.getCatastroParroquiaById(id);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener parroquia por ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una parroquia por ID
router.delete('/elimina_parroquia_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroParroquiaModel.deleteCatastroParroquiaById(id);
    if (data) {
      res.json({ message: 'Parroquia eliminada con éxito', data });
    } else {
      res.status(404).json({ error: 'Parroquia no encontrada' });
    }
  } catch (err) {
    console.error('❌ Error al eliminar parroquia:', err);
    res.status(500).json({ error: 'Error del servidor. Inténtalo de nuevo más tarde.' });
  }
});

module.exports = router;
