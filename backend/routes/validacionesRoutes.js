const express = require('express');
const router = express.Router();
const validacionesModel = require('../db/models/validaciones');


// Validar datos
router.post('/valida_datos', async (req, res) => {
  try {
    const validation = await validacionesModel.validateData(req.body);
    res.status(200).json(validation);
  } catch (err) {
    console.error('❌ Error en validación de datos:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
