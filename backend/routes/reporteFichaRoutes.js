const express = require('express');
const router = express.Router();
const reporteFichaModel = require('../db/models/reporteFicha');

// Obtener listado general de predios
router.get('/ficha_predio', async (req, res) => {
  try {
    console.log('📥 Query recibida:', req.query);  // <-- importante
    const data = await reporteFichaModel.obtieneDatosPredio(req.query);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener listado de predios:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});


// Obtener patrimonio urbano por ID de predio
router.get('/patrimonio-urbano/:id_predio', async (req, res) => {
  const { id_predio } = req.params;
  try {
    const data = await reporteFichaModel.obtienePatrimonioPorId(id_predio);
    data
      ? res.json(data)
      : res.status(404).json({ error: 'Ficha predio no encontrada' });
  } catch (err) {
    console.error('❌ Error al obtener patrimonio urbano:', err);
    res.status(500).json({ error: 'Error al obtener ficha_predio' });
  }
});

// Obtener ficha_predio por ID
router.get('/ficha_predio/:id_predio', async (req, res) => {
  const { id_predio } = req.params;
  try {
    const data = await reporteFichaModel.obtieneFichaPredioPorId(id_predio);
    data
      ? res.json(data)
      : res.status(404).json({ error: 'Ficha predio no encontrada' });
  } catch (err) {
    console.error('❌ Error al obtener ficha_predio:', err);
    res.status(500).json({ error: 'Error al obtener ficha_predio' });
  }
});

// Obtener ficha de tenencia por ID de predio
router.get('/ficha_tenencia/:id_predio', async (req, res) => {
  const { id_predio } = req.params;
  try {
    const data = await reporteFichaModel.obtieneFichaTenenciaPorId(id_predio);
    data.length > 0
      ? res.json(data)
      : res.status(404).json({ error: 'Tenencia no encontrada' });
  } catch (err) {
    console.error('❌ Error al obtener tenencia:', err);
    res.status(500).json({ error: 'Error al obtener tenencia' });
  }
});

// Obtener ficha de bloques por ID de bloque
router.get('/ficha_bloques/:id_bloques', async (req, res) => {
  const { id_bloques } = req.params;
  try {
    const data = await reporteFichaModel.obtieneFichaBloquesPorId(id_bloques);
    data
      ? res.json(data)
      : res.status(404).json({ error: 'Bloques no encontrados' });
  } catch (err) {
    console.error('❌ Error al obtener bloques:', err);
    res.status(500).json({ error: 'Error al obtener bloques' });
  }
});

// Obtener ficha de vías por ID de vías
router.get('/ficha_vias/:id_vias', async (req, res) => {
  const { id_vias } = req.params;
  try {
    const data = await reporteFichaModel.obtieneFichaViasPorId(id_vias);
    data
      ? res.json(data)
      : res.status(404).json({ error: 'Vías no encontradas' });
  } catch (err) {
    console.error('❌ Error al obtener vías:', err);
    res.status(500).json({ error: 'Error al obtener vías' });
  }
});

// Obtener ficha de mejoras por ID de mejoras
router.get('/ficha_mejoras/:id_mejoras', async (req, res) => {
  const { id_mejoras } = req.params;
  try {
    const data = await reporteFichaModel.obtieneFichaMejorasPorId(id_mejoras);
    data
      ? res.json(data)
      : res.status(404).json({ error: 'Mejoras no encontradas' });
  } catch (err) {
    console.error('❌ Error al obtener mejoras:', err);
    res.status(500).json({ error: 'Error al obtener mejoras' });
  }
});

// Obtener datos del visor del predio por ID
router.get('/datos_visor_predio/:id_predio', async (req, res) => {
  const { id_predio } = req.params;
  try {
    const data = await reporteFichaModel.obtieneDatosVisorPredio(id_predio);
    data
      ? res.json(data)
      : res.status(404).json({ error: 'Datos del visor no encontrados' });
  } catch (err) {
    console.error('❌ Error al obtener visor del predio:', err);
    res.status(500).json({ error: 'Error al obtener visor del predio' });
  }
});

module.exports = router;
