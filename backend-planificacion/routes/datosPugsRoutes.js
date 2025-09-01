const express = require('express');
const router = express.Router();
const DatosPugsModel = require('../db/models/DatosPugsModel');

/**
 * @route GET /api/datos-pugs/:codCat
 * @desc Obtener datos PUGS por clave catastral
 * @access Public
 */
router.get('/:codCat', async (req, res) => {
  try {
    const { codCat } = req.params;
    
    // Validar que se proporcione una clave catastral
    if (!codCat) {
      return res.status(400).json({ 
        success: false, 
        error: 'Se requiere una clave catastral' 
      });
    }

    console.log(`Consultando datos PUGS para clave catastral: ${codCat}`);
    
    // Obtener datos PUGS
    const datosPugs = await DatosPugsModel.obtenerDatosPugsPorCodCat(codCat);
    
    if (datosPugs.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontraron datos PUGS para la clave catastral: ${codCat}`
      });
    }

    return res.status(200).json({
      success: true,
      data: datosPugs
    });
  } catch (error) {
    console.error('Error al obtener datos PUGS:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener datos PUGS',
      message: error.message
    });
  }
});

module.exports = router;
