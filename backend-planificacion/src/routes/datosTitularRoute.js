const express = require('express');
const router = express.Router();
const DatosTitularModel = require('../db/models/DatosTitularModel');

// POST - Búsqueda avanzada por múltiples parámetros - sin paginación ni conteo
router.post('/busquedaAvanzada', async (req, res) => {
  try {
    const { claveCatastral, nombres, numeroDocumento } = req.body;
    
    const result = await DatosTitularModel.busquedaAvanzada(
      { claveCatastral, nombres, numeroDocumento }
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error en búsqueda avanzada de datos de titulares:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

module.exports = router;
