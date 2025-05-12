const express = require('express');
const router = express.Router();
const catastroMejorasModel = require('../db/models/catastroMejoras');

// Insertar una nueva mejora
router.post('/inserta_mejora', async (req, res) => {
  try {
    const newRecord = await catastroMejorasModel.insertCatastroMejoras(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('❌ Error al insertar mejora:', err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una mejora por su ID
router.put('/actualiza_mejora_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRecord = await catastroMejorasModel.updateCatastroMejoras(id, req.body);
    res.json(updatedRecord);
  } catch (err) {
    console.error('❌ Error al actualizar mejora:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener una mejora por su ID
router.get('/mejora_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroMejorasModel.getCatastroMejorasById(id);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener mejora por ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una mejora por ID
router.delete('/elimina_mejora_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroMejorasModel.deleteCatastroMejorasById(id);
    if (data) {
      res.json({ message: 'Mejora eliminada con éxito', data });
    } else {
      res.status(404).json({ error: 'Mejora no encontrada' });
    }
  } catch (err) {
    console.error('❌ Error al eliminar mejora:', err);
    res.status(500).json({ error: 'Error del servidor. Inténtalo de nuevo más tarde.' });
  }
});

module.exports = router;
