const express = require('express');
const axios = require('axios');
const router = express.Router();

// URL del backend principal 
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000/api';

// Endpoint para consultar el bounding box de un predio por clave catastral
router.get('/bbox-predio/:codCat', async (req, res) => {
  try {
    const codCat = req.params.codCat;
    console.log(`Consultando bbox para predio con clave: ${codCat}`);
    
    // Hacemos la consulta al backend principal como proxy
    const response = await axios.get(`${BACKEND_URL}/bbox_predio/${codCat}`);
    
    // Devolvemos los mismos datos que nos envía el backend principal
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener bbox del predio:', error.message);
    
    // Si hay error de conexión con el backend principal, devolvemos coordenadas simuladas
    // para que al menos se muestre un área por defecto
    res.json({
      xmin: 803000,
      ymin: 10000000,
      xmax: 803100,
      ymax: 10000100,
      error: "Coordenadas simuladas - No se pudo conectar con el backend principal"
    });
  }
});

// Endpoint para consultar el área de un predio
router.get('/area-predio/:codCat', async (req, res) => {
  try {
    const codCat = req.params.codCat;
    
    // Hacemos la consulta al backend principal
    const response = await axios.get(`${BACKEND_URL}/geo_consultas/area_predio/${codCat}`);
    
    // Devolvemos los datos
    res.json(response.data);
  } catch (error) {
    console.error('Error al obtener área del predio:', error.message);
    res.status(500).json({ 
      error: 'Error al obtener área del predio',
      area: 0 
    });
  }
});

module.exports = router;
