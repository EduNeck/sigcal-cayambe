const express = require('express');
const axios = require('axios');
const router = express.Router();
const parametrosGeneralesModel = require('../db/models/parametrosGenerales');

router.post('/consulta-rp', async (req, res) => {
  const { clave_catastral } = req.body;

  if (!clave_catastral || clave_catastral.length < 10) {
    return res.status(400).json({ status: 'ERROR', message: 'Clave catastral inválida o vacía' });
  }

  try {
    const urlParam = await parametrosGeneralesModel.consultarParametrosByDescripcion('url_sw_registro');
    const apiKeyParam = await parametrosGeneralesModel.consultarParametrosByDescripcion('T-Api-Id');

    const url = urlParam?.[0]?.url;
    const apiKey = apiKeyParam?.[0]?.url;

    if (!url || !apiKey) {
      return res.status(500).json({ status: 'ERROR', message: 'No se encontró configuración del WS' });
    }

    const formData = new URLSearchParams();
    formData.append('clave_catastral', clave_catastral);

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'T-Api-Id': apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('❌ Error al consultar el WS Registro Propiedad:', error.message);
    res.status(500).json({ status: 'ERROR', message: 'Error al consumir el Web Service' });
  }
});

module.exports = router;
