const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/consulta-rp', async (req, res) => {
  let { op, param } = req.body;

  console.log('🟡 Parámetros recibidos:', { op, param });

  op = Number(op);
  param = (param || '').trim();

  if (![1, 2, 3].includes(op) || !param) {
    console.warn('🔴 Parámetros inválidos:', { op, param });
    return res.status(400).json({ status: 'ERROR', message: 'Clave catastral inválida o vacía' });
  }

  try {
    const url = 'https://api.ac.rpcayambe.gob.ec/api/WsAvalCat.php';

    const formData = new URLSearchParams();
    formData.append('op', op);
    formData.append('param', param);

    const { data } = await axios.post(url, formData, {
      headers: {
        'T-Api-Id': '3231a5ad-2d24-4dc2-b0f3-a791a8ff5eee',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    res.json(data);
  } catch (error) {
    console.error('❌ Error en WS Registro Propiedad:', error.message);
    res.status(500).json({ status: 'ERROR', message: 'Error al consultar el WS' });
  }
});


module.exports = router;
