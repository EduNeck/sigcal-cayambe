const express = require('express');
const router = express.Router();
const catastroPredioModel = require('../db/models/catastroPredio');


// Insertar un nuevo predio
router.post('/inserta_predio', async (req, res) => {
  try {
    const newRecord = await catastroPredioModel.insertCatastroPredio(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('❌ Error al insertar predio:', err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un predio por su ID
router.put('/actualiza_predio_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRecord = await catastroPredioModel.updateCatastroPredio(id, req.body);
    res.json(updatedRecord);
  } catch (err) {
    console.error('❌ Error al actualizar predio:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener un predio por su ID
router.get('/predio_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroPredioModel.getCatastroPredioById(id);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener predio por ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un predio por ID
router.delete('/elimina_predio_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroPredioModel.deleteCatastroPredioById(id);
    if (data) {
      res.json({ message: 'Predio eliminado con éxito', data });
    } else {
      res.status(404).json({ error: 'Predio no encontrado' });
    }
  } catch (err) {
    console.error('❌ Error al eliminar predio:', err);
    res.status(500).json({ error: 'Error del servidor. Inténtalo de nuevo más tarde.' });
  }
});

module.exports = router;
