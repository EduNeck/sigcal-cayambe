const express = require('express');
const router = express.Router();
const catastroViasModel = require('../db/models/catastroVias');


// Insertar una nueva vía
router.post('/inserta_via', async (req, res) => {
  try {
    const newRecord = await catastroViasModel.insertCatastroVias(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('❌ Error al insertar vía:', err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una vía por su ID
router.put('/actualiza_via_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRecord = await catastroViasModel.updateCatastroVias(id, req.body);
    res.json(updatedRecord);
  } catch (err) {
    console.error('❌ Error al actualizar vía:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener una vía por su ID
router.get('/via_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroViasModel.getCatastroViasById(id);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener vía por ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una vía por ID
router.delete('/elimina_via_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroViasModel.deleteCatastroViasById(id);
    if (data) {
      res.json({ message: 'Vía eliminada con éxito', data });
    } else {
      res.status(404).json({ error: 'Vía no encontrada' });
    }
  } catch (err) {
    console.error('❌ Error al eliminar vía:', err);
    res.status(500).json({ error: 'Error del servidor. Inténtalo de nuevo más tarde.' });
  }
});

module.exports = router;
