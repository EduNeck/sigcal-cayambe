const express = require('express');
const router = express.Router();
const catastroTenencia = require('../db/models/catastroTenencia');

// Función para convertir diferentes tipos de valores a booleanos
function convertirABoolean(valor) {
  // Comprobar el tipo y valor para manejar todos los posibles casos
  if (valor === true || valor === 1 || valor === '1' || 
      valor === 'true' || valor === 'TRUE' || 
      valor === 't' || valor === 'T' || 
      valor === 'si' || valor === 'SI' || 
      valor === 's' || valor === 'S' || 
      valor === 'yes' || valor === 'YES' || 
      valor === 'y' || valor === 'Y') {
    return true;
  } else {
    return false;
  }
}

// Insertar nuevo registro en catastro_tenencia
router.post('/inserta_tenencia', async (req, res) => {
  try {
    const newRecordId = await catastroTenencia.insertCatastroTenencia(req.body);
    res.status(201).json(newRecordId);
  } catch (err) {
    console.error('Error inserting catastro_tenencia:', err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un registro de catastro_tenencia por ID
router.put('/actualiza_tenencia/:id', async (req, res) => {
  const { id } = req.params;
  try {
    console.log('[BACKEND] PUT /actualiza_tenencia/:id - Datos recibidos:', JSON.stringify(req.body, null, 2));
    
    // Procesar campos booleanos para asegurar que sean valores booleanos correctos
    const datosProcesados = {
      ...req.body,
      permite_ingreso: convertirABoolean(req.body.permite_ingreso),
      presenta_escritura: convertirABoolean(req.body.presenta_escritura),
      asentamiento_de_hecho: convertirABoolean(req.body.asentamiento_de_hecho),
      conflicto: convertirABoolean(req.body.conflicto)
    };
    
    console.log('[BACKEND] Datos procesados para actualizar:', JSON.stringify(datosProcesados, null, 2));
    
    const updatedRecord = await catastroTenencia.updateCatastroTenencia(id, datosProcesados);
    res.json(updatedRecord);
  } catch (err) {
    console.error('Error updating catastro_tenencia:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener un registro de catastro_tenencia por ID
router.get('/tenencia_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const tenencia = await catastroTenencia.getCatastroTenenciaById(id);
    if (tenencia) {
      res.json(tenencia);
    } else {
      res.status(404).send('Tenencia not found');
    }
  } catch (error) {
    console.error('Error fetching tenencia:', error.message, error.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Obtener todas las tenencias de un predio por ID de predio
router.get('/tenencia_by_predio/:predio', async (req, res) => {
  const predio = req.params.predio;
  try {
    const tenencias = await catastroTenencia.getListadoTenenciaByPredio(predio);
    if (tenencias) {
      res.json(tenencias);
    } else {
      res.status(404).send('Tenencia not found');
    }
  } catch (error) {
    console.error('Error fetching tenencia:', error.message, error.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Eliminar una tenencia por ID
router.delete('/elimina_tenencia_by_id/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID no proporcionado' });
  }

  try {
    const data = await catastroTenencia.deleteCatastroTenencia(id);
    if (data) {
      res.json({ message: 'Tenencia eliminada con éxito', data });
    } else {
      res.status(404).json({ error: 'Tenencia no encontrada' });
    }
  } catch (err) {
    console.error('Error eliminando tenencia:', err);
    res.status(500).json({ error: 'Error del servidor. Inténtalo de nuevo más tarde.' });
  }
});

router.post('/inserta_varias_tenencias', async (req, res) => {
  try {
    const resultado = await catastroTenencia.insertMultiplesTenenciasBasicas(req.body);
    res.status(201).json({ message: 'Tenencias insertadas correctamente', ids: resultado });
  } catch (err) {
    console.error('Error insertando múltiples tenencias:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Obtener el porcentaje acumulado de participación por predio
router.get('/porcentaje_acumulado_predio/:id_predio', async (req, res) => {
  const { id_predio } = req.params;
  const { id_tenencia_excluir } = req.query;
  
  try {
    const porcentajeAcumulado = await catastroTenencia.getPorcentajeAcumuladoByPredio(
      id_predio, 
      id_tenencia_excluir || null
    );
    res.json({ porcentaje_acumulado: porcentajeAcumulado });
  } catch (err) {
    console.error('Error al obtener porcentaje acumulado:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
