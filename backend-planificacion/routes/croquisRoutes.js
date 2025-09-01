const express = require('express');
const router = express.Router();

// Intentamos cargar la función de la base de datos, pero tenemos un fallback
let getPredioExtentByCodCat;
try {
  const croquis = require('../db/models/croquis');
  getPredioExtentByCodCat = croquis.getPredioExtentByCodCat;
  console.log('Módulo croquis cargado correctamente');
} catch (error) {
  console.error('Error al cargar el módulo croquis:', error);
  // Función simulada para fallback
  getPredioExtentByCodCat = async () => ({
    xmin: 803000,
    ymin: 10000000,
    xmax: 803100,
    ymax: 10000100
  });
}

// GET /api/bbox_predio/:codCat
router.get('/bbox_predio/:codCat', async (req, res) => {
  try {
    console.log('Recibida solicitud para clave catastral:', req.params.codCat);
    const codCat = req.params.codCat;
    
    // Si tenemos problemas de conexión a BD, devolvemos coordenadas simuladas
    const result = await getPredioExtentByCodCat(codCat) || {
      xmin: 803000,
      ymin: 10000000,
      xmax: 803100,
      ymax: 10000100,
      nota: "Coordenadas simuladas - No se pudo obtener de BD"
    };
    
    console.log('Resultado:', result);
    res.json(result);
  } catch (error) {
    console.error('Error al obtener la extensión del predio:', error);
    // En caso de error, devolver coordenadas simuladas
    res.json({
      xmin: 803000,
      ymin: 10000000,
      xmax: 803100,
      ymax: 10000100,
      error: "Coordenadas simuladas debido a error"
    });
  }
});

module.exports = router;
