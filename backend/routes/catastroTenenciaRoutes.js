const express = require('express');
const router = express.Router();
const catastroTenencia = require('../db/models/catastroTenencia');

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
    const updatedRecord = await catastroTenencia.updateCatastroTenencia(id, req.body);
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
