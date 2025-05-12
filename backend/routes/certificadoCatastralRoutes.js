const express = require('express');
const router = express.Router();
const certificadoCatastralModel = require('../db/models/certificadoCatastral');


// Generar un nuevo certificado
router.post('/genera_certificado', async (req, res) => {
  try {
    const newRecord = await certificadoCatastralModel.generateCertificado(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('❌ Error al generar certificado:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener un certificado por su ID
router.get('/certificado_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await certificadoCatastralModel.getCertificadoById(id);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener certificado por ID:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
