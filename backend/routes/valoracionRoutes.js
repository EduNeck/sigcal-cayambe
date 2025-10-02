// routes/valoracionRoutes.js
const express = require('express');
const router = express.Router();
const valoracionModel = require('../db/models/valoracion'); // ajusta la ruta según tu estructura

// Obtener todos los registros de la tabla `valoracion_suelo_cal`
router.get('/valoracion_suelo_cal', async (req, res) => {
  try {
    const data = await valoracionModel.getAllValSueloCal();
    res.json(data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Obtener todos los registros de la tabla `valoracion_mejoras_cal`
router.get('/valoracion_mejoras_cal', async (req, res) => {
  try {
    const data = await valoracionModel.getAllValMejorasCal();
    res.json(data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Obtener todos los registros de la tabla `predio_resultado_urb`
router.get('/predio_resultado_urb', async (req, res) => {
  try {
    const data = await valoracionModel.getAllPredioResultadoUrb();
    res.json(data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Obtener todos los registros de la tabla `valores_patrimonio_urb`
router.get('/valores_patrimonio_urb', async (req, res) => {
  try {
    const data = await valoracionModel.getAllValoresPatrimonio();
    res.json(data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Obtener todos los registros de la tabla `valores_tipologia_urb`
router.get('/valores_tipologia_urb', async (req, res) => {
  try {
    const data = await valoracionModel.getAllTipologiaUrb();
    res.json(data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Obtener todos los registros de la tabla `factor_tamaño_urb`
router.get('/factor_tamanio_urb', async (req, res) => {
  try {
    const data = await valoracionModel.getAllFactorTamanioUrb();
    res.json(data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Obtener todos los registros de la tabla `val_fito_corvini`
router.get('/fitto_corvini', async (req, res) => {
  try {
    const data = await valoracionModel.getAllFittoCorvini();
    res.json(data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Obtener todos los registros de la tabla `valores_comerciales_peritaje`
router.get('/valoresComercialesPeritaje', async (req, res) => {
  try {
    const data = await valoracionModel.getAllValoresComercialesPeritaje();
    res.json(data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Ejecutar la valoración
router.post('/ejecuta_valoracion', async (req, res) => {
  const { pr_anio, var_tipo, pr_clave, var_usuario } = req.body;
  try {
    await valoracionModel.ejecutaValoracion(pr_anio, var_tipo, pr_clave, var_usuario);
    res.json({ message: 'Valoración ejecutada correctamente' });
  } catch (err) {
    console.error('Error ejecutando valoración:', err);
    res.status(500).json({ error: 'Error ejecutando valoración' });
  }
});

// Obtener certificado catastral geográfico
router.post('/certificado_catastral_geografico', async (req, res) => {
  const { codigo } = req.body;
  try {
    const data = await valoracionModel.certificadoCatastralGeografico(codigo);
    res.json(data);
  } catch (err) {
    console.error('Error fetching certificado catastral geográfico:', err);
    res.status(500).json({ error: 'Error fetching certificado catastral geográfico' });
  }
});

// Insertar certificado catastral
router.put('/inserta-certificado-catastral', async (req, res) => {
  const { tipo, anio, clave, usuario, codigo } = req.body;
  try {
    const data = await valoracionModel.insertaCertificadoCatastral(tipo, anio, clave, usuario, codigo);
    res.json(data);
  } catch (err) {
    console.error('Error inserting certificado catastral:', err);
    res.status(500).json({ error: 'Error inserting certificado catastral' });
  }
});

// Obtener valoración por clave catastral
router.get('/valoracion-por-clave/:claveCatastral', async (req, res) => {
  const { claveCatastral } = req.params;
  try {
    const data = await valoracionModel.getValoracionByClave(claveCatastral);
    if (data && data.length > 0) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'No se encontraron valoraciones para la clave catastral proporcionada' });
    }
  } catch (err) {
    console.error('Error al obtener valoración por clave catastral:', err);
    res.status(500).json({ error: 'Error al consultar la valoración por clave catastral' });
  }
});

module.exports = router;
