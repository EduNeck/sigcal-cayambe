const express = require('express');
const router = express.Router();
const IcusModel = require('../db/models/IcusModel');

// GET - Obtener todos los ICUS con paginación
router.get('/recuperarIcus', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const result = await IcusModel.recuperaIcus(page, limit, search);
    res.json(result);
  } catch (error) {
    console.error('Error al obtener ICUS:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// GET - Obtener un ICUS por ID
router.get('/recuperarIcus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const icus = await IcusModel.recuperaIcusById(id);

    if (!icus) {
      return res.status(404).json({ message: 'ICUS no encontrado' });
    }
    
    res.json(icus);
  } catch (error) {
    console.error('Error al obtener ICUS:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// POST - Crear un nuevo ICUS
router.post('/crearIcus', async (req, res) => {
  try {
    const result = await IcusModel.crearIcus(req.body);

    res.status(201).json({
      message: 'ICUS creado exitosamente',
      id: result.id,
      geometria_geojson: result?.geometria_geojson
    });
  } catch (error) {
    console.error('Error al crear ICUS:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// PUT - Actualizar un ICUS existente
router.put('/actualizarIcus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await IcusModel.actualizarIcus(id, req.body);

    if (!result) {
      return res.status(404).json({ message: 'ICUS no encontrado' });
    }
    
    res.json({
      message: 'ICUS actualizado exitosamente',
      id: result.id,
      geometria_geojson: result?.geometria_geojson
    });
  } catch (error) {
    console.error('Error al actualizar ICUS:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// DELETE - Eliminar un ICUS
router.delete('/eliminarIcus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await IcusModel.eliminarIcus(id);

    if (!deleted) {
      return res.status(404).json({ message: 'ICUS no encontrado' });
    }
    
    res.json({ message: 'ICUS eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar ICUS:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

module.exports = router;