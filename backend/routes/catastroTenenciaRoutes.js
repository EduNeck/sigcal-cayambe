const express = require('express');
const router = express.Router();
const catastroTenenciaModel = require('../db/models/catastroTenencia');


// Insertar una nueva tenencia
router.post('/inserta_tenencia', async (req, res) => {
  try {
    const newRecord = await catastroTenenciaModel.insertCatastroTenencia(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('❌ Error al insertar tenencia:', err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar una tenencia por su ID
router.put('/actualiza_tenencia_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRecord = await catastroTenenciaModel.updateCatastroTenencia(id, req.body);
    res.json(updatedRecord);
  } catch (err) {
    console.error('❌ Error al actualizar tenencia:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener una tenencia por su ID
router.get('/tenencia_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroTenenciaModel.getCatastroTenenciaById(id);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener tenencia por ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar una tenencia por ID
router.delete('/elimina_tenencia_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroTenenciaModel.deleteCatastroTenenciaById(id);
    if (data) {
      res.json({ message: 'Tenencia eliminada con éxito', data });
    } else {
      res.status(404).json({ error: 'Tenencia no encontrada' });
    }
  } catch (err) {
    console.error('❌ Error al eliminar tenencia:', err);
    res.status(500).json({ error: 'Error del servidor. Inténtalo de nuevo más tarde.' });
  }
});

module.exports = router;
