const express = require('express');
const axios = require('axios');
const router = express.Router();

// Endpoint simple para comparar (igual al directo pero más simple)
router.post('/consulta-rp', async (req, res) => {
  const { op, param } = req.body;
  
  console.log('🟪 SIMPLE - Parámetros:', { op, param });
  
  try {
    const formData = new URLSearchParams();
    formData.append('op', op);
    formData.append('param', param);
    
    const response = await axios.post('https://api.ac.rpcayambe.gob.ec/api/WsAvalCat.php', formData, {
      headers: {
        'T-Api-Id': '3231a5ad-2d24-4dc2-b0f3-a791a8ff5eee',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('🟪 SIMPLE - Response data:', response.data);
    res.json(response.data);
    
  } catch (error) {
    console.error('🟪 SIMPLE - Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
