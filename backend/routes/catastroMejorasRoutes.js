const express = require('express');
const router = express.Router();
const catastroViasModel = require('../db/models/catastroVias');
const catastroMejorasModel = require('../db/models/catastroMejoras');

// ========================= RUTAS VIAS =========================

// Ruta para insertar un registro en la tabla `catastro_vias`
router.post('/inserta_vias', async (req, res) => {
  try {
    const newRecord = await catastroViasModel.insertCatastroVias(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Ruta para actualizar un registro en la tabla `catastro_vias`
router.put('/actualiza_vias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroViasModel.updateCatastroVias(id, req.body);
    res.json(data);
  } catch (err) {
    console.error('Error updating catastro vias:', err);
    res.status(500).send('Server Error');
  }
});

// Ruta para obtener un registro de la tabla `catastro_vias` basado en su ID
router.get('/vias_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroViasModel.getCatastroViasById(id);
    res.json(data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Ruta para obtener un registro de la tabla `catastro_vias` basado en su ID (by idVias)
router.get('/vias_by_idVias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroViasModel.getCatastroViasByIdVias(id);
    res.json(data);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Ruta para obtener un registro de la vista `vista_vias_completa` basado en el ID del predio
router.get('/vista_vias_by_idPredio/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroViasModel.getCatastroVistaViasByPredio(id);
    res.json(data);
  } catch (err) {
    console.error('Error fetching catastro_vias:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para eliminar un registro de la tabla `catastro_vias` basado en su ID
router.post('/elimina_vias_by_id/:id', async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'ID no proporcionado' });
  }
  try {
    const data = await catastroViasModel.deleteCatastroViasByIdVias(id);
    if (data) {
      res.json({ message: 'Via eliminado con éxito', data });
    } else {
      res.status(404).json({ error: 'Via no encontrado' });
    }
  } catch (err) {
    console.error('Error eliminando Via:', err);
    res.status(500).json({ error: 'Error del servidor. Inténtalo de nuevo más tarde.' });
  }
});

// ========================= RUTAS MEJORAS =========================

// Ruta para insertar un registro en la tabla `catastro_mejoras`
router.post('/inserta_mejora', async (req, res) => {
  try {
    const newRecord = await catastroMejorasModel.insertaMejoras(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('Error inserting catastro_mejoras:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para actualizar un registro en la tabla `catastro_mejoras`
router.put('/actualiza_mejora/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRecord = await catastroMejorasModel.actualizaMejoras(id, req.body);
    res.json(updatedRecord);
  } catch (err) {
    console.error('Error updating catastro_mejoras:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para obtener un registro de la tabla `catastro_mejoras` basado en su ID
router.get('/mejora_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroMejorasModel.recuperaMejorasByIdMejoras(id);
    res.json(data);
  } catch (err) {
    console.error('Error fetching catastro_mejoras:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para obtener todos los registros de la tabla `catastro_mejoras` basado en el ID del predio
router.get('/mejoras_by_idPredio/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroMejorasModel.recuperaMejorasByIdPredio(id);
    res.json(data);
  } catch (err) {
    console.error('Error fetching catastro_mejoras:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para obtener todos los registros de la vista `vista_obras_mejoras` basado en el ID del predio
router.get('/vista_mejoras_by_idPredio/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroMejorasModel.recuperaVistaMejorasByIdPredio(id);
    res.json(data);
  } catch (err) {
    console.error('Error fetching catastro_mejoras:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para eliminar un registro de la tabla `Mejoras` basado en su ID
router.post('/elimina_mejora_by_id/:id', async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'ID no proporcionado' });
  }
  try {
    const data = await catastroMejorasModel.eliminaMejoras(id);
    if (data) {
      res.json({ message: 'Mejoras eliminado con éxito', data });
    } else {
      res.status(404).json({ error: 'Mejoras no encontrado' });
    }
  } catch (err) {
    console.error('Error eliminando Mejoras:', err);
    res.status(500).json({ error: 'Error del servidor. Inténtalo de nuevo más tarde.' });
  }
});

module.exports = router;