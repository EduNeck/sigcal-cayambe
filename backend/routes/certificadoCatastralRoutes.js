const express = require('express');
const router = express.Router();
const certificadoCatastralModel = require('../db/models/certificadoCatastral');


// Recuperar todos los certificados
router.get('/certificados', async (req, res) => {
  try {
    const data = await certificadoCatastralModel.recuperaCertificado();
    res.json(data);
  } catch (err) {
    console.error('❌ Error al recuperar certificados:', err);
    res.status(500).json({ error: err.message });
  }
});

// Recuperar un certificado por ID
router.get('/certificado_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await certificadoCatastralModel.recuperaCertificadoById(id);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener certificado por ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Insertar un nuevo certificado
router.post('/genera_certificado', async (req, res) => {
  try {
    const newRecord = await certificadoCatastralModel.insertaCertificado(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('❌ Error al generar certificado:', err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un certificado existente
router.put('/actualiza_certificado/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await certificadoCatastralModel.actualizaCertificado(id, req.body);
    res.json(updated);
  } catch (err) {
    console.error('❌ Error al actualizar certificado:', err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un certificado
router.delete('/elimina_certificado/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await certificadoCatastralModel.eliminaCertificado(id);
    res.json(result);
  } catch (err) {
    console.error('❌ Error al eliminar certificado:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener datos completos de certificado catastral por clave catastral
router.get('/certificado_detalle_by_clave/:clave', async (req, res) => {
  const { clave } = req.params;
  try {
    const data = await certificadoCatastralModel.getCertificadoCatastralDetallePorClave(clave);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener detalle de certificado por clave catastral:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
