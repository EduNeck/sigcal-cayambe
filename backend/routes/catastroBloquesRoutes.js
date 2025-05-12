const express = require('express');
const router = express.Router();
const catastroBloquesModel = require('../db/models/catastroBloques');

// Insertar un nuevo bloque
router.post('/inserta_bloque', async (req, res) => {
  try {
    const newRecord = await catastroBloquesModel.insertCatastroBloques(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('❌ Error al insertar bloque:', err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un bloque por su ID
router.put('/actualiza_bloque_by_idBloque/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRecord = await catastroBloquesModel.updateCatastroBloques(id, req.body);
    res.json(updatedRecord);
  } catch (err) {
    console.error('❌ Error al actualizar bloque:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener un bloque por su ID
router.get('/bloque_by_idBloque/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroBloquesModel.getCatastroBloquesById(id);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener bloque por ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener bloque(s) por ID del predio
router.get('/bloque_by_idPredio/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroBloquesModel.getCatastroBloquesByIdPredio(id);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener bloque por ID de predio:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener vista completa de bloques por ID de predio
router.get('/vista_bloques_by_idPredio/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroBloquesModel.getCatastroVistaBloquesByIdPredio(id);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener vista de bloques:', err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un bloque por ID
router.post('/elimina_bloque_by_id/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID no proporcionado' });
  }

  try {
    const data = await catastroBloquesModel.deleteCatastroBloquesById(id);
    if (data) {
      res.json({ message: 'Bloque eliminado con éxito', data });
    } else {
      res.status(404).json({ error: 'Bloque no encontrado' });
    }
  } catch (err) {
    console.error('❌ Error al eliminar bloque:', err);
    res.status(500).json({ error: 'Error del servidor. Inténtalo de nuevo más tarde.' });
  }
});

module.exports = router;
