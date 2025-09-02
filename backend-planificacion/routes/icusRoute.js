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

// GET - Buscar ICUS por criterios avanzados
router.get('/buscar', async (req, res) => {
  try {
    const { 
      clavesCatastrales, 
      id_actividad,
      page, 
      limit 
    } = req.query;
    
    console.log('Parámetros recibidos en /icus/buscar:', req.query);
    
    // Parsear el array de claves catastrales si viene como string
    let clavesCatastralesArray = clavesCatastrales;
    if (typeof clavesCatastrales === 'string') {
      try {
        clavesCatastralesArray = JSON.parse(clavesCatastrales);
      } catch (e) {
        clavesCatastralesArray = clavesCatastrales ? [clavesCatastrales] : [];
      }
    }
    
    const criterios = {
      clavesCatastrales: clavesCatastralesArray,
      id_actividad,
      page,
      limit
    };
    
    const result = await IcusModel.buscarIcus(criterios);
    res.json(result);
  } catch (error) {
    console.error('Error al buscar ICUS:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor', 
      error: error.message 
    });
  }
});

module.exports = router;
