const express = require('express');
const router = express.Router();
const geoConsultasModel = require('../db/models/geoConsultas');

// Ruta para obtener el área de un predio a partir de su clave catastral
router.get('/geo_consultas/area_predio/:codCat', async (req, res) => {
  const codCat = req.params.codCat;

  // Validar clave catastral
  if (!codCat || typeof codCat !== 'string') {
    return res.status(400).json({ error: 'Clave catastral inválida o no proporcionada' });
  }

  try {
    const data = await geoConsultasModel.getAreaPredio(codCat);

    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Área del predio no encontrada' });
    }
  } catch (err) {
    console.error('❌ Error al recuperar área de predio:', err);
    res.status(500).json({ error: 'Error interno del servidor al consultar área de predio' });
  }
});

// Ruta para obtener el área de un bloque
router.get('/geo_consultas/area_bloque/:codCat/:numBloq/:numPiso/:codUni/:tipoPiso/:tipoZona', async (req, res) => {
  const { codCat, numBloq, numPiso, codUni, tipoPiso, tipoZona } = req.params;

  // Validar parámetros requeridos
  if (!codCat || !numBloq || !numPiso || !codUni || !tipoPiso || !tipoZona) {
    return res.status(400).json({ error: 'Todos los parámetros son requeridos: codCat, numBloq, numPiso, codUni, tipoPiso, tipoZona' });
  }

  try {
    const data = await geoConsultasModel.getAreaBloque(codCat, numBloq, numPiso, codUni, tipoPiso, tipoZona);

    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Área del bloque no encontrada' });
    }
  } catch (err) {
    console.error('❌ Error al recuperar área de bloque:', err);
    res.status(500).json({ error: 'Error interno del servidor al consultar área de bloque' });
  }
});

module.exports = router;
