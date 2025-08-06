// routes/catalogoBarriosViasRoutes.js
const express = require('express');
const router = express.Router();
const catalogoBarriosViasModel = require('../db/models/catalogoBarriosVias');

// Obtener todos los barrios y vías
router.get('/catalogo_barrios_vias', async (req, res) => {
  try {
    const barriosVias = await catalogoBarriosViasModel.getAllBarriosVias();
    res.json(barriosVias);
  } catch (error) {
    console.error('Error al obtener barrios y vías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener solo los barrios
router.get('/catalogo_barrios', async (req, res) => {
  try {
    const barrios = await catalogoBarriosViasModel.getBarrios();
    res.json(barrios);
  } catch (error) {
    console.error('Error al obtener barrios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener calles de un barrio específico
router.get('/catalogo_calles_por_barrio/:id_barrio', async (req, res) => {
  const id_barrio = parseInt(req.params.id_barrio, 10);
  if (isNaN(id_barrio)) {
    return res.status(400).json({ error: 'El ID del barrio debe ser un número válido' });
  }

  try {
    const calles = await catalogoBarriosViasModel.getCallesByBarrio(id_barrio);
    res.json(calles);
  } catch (error) {
    console.error('Error al obtener calles por barrio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener barrios y vías por ID de barrio
router.get('/catalogo_barrios_vias/barrio/:id_barrio', async (req, res) => {
  const id_barrio = parseInt(req.params.id_barrio, 10);
  if (isNaN(id_barrio)) {
    return res.status(400).json({ error: 'El ID del barrio debe ser un número válido' });
  }

  try {
    const barriosVias = await catalogoBarriosViasModel.getBarriosViasByBarrio(id_barrio);
    res.json(barriosVias);
  } catch (error) {
    console.error('Error al obtener barrios y vías por barrio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener barrios y vías por ID de calle
router.get('/catalogo_barrios_vias/calle/:id_calle', async (req, res) => {
  const id_calle = parseInt(req.params.id_calle, 10);
  if (isNaN(id_calle)) {
    return res.status(400).json({ error: 'El ID de la calle debe ser un número válido' });
  }

  try {
    const barriosVias = await catalogoBarriosViasModel.getBarriosViasByCalle(id_calle);
    res.json(barriosVias);
  } catch (error) {
    console.error('Error al obtener barrios y vías por calle:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener un registro específico por ID
router.get('/catalogo_barrios_vias/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número válido' });
  }

  try {
    const barrioVia = await catalogoBarriosViasModel.getBarriosViasById(id);
    if (barrioVia) {
      res.json(barrioVia);
    } else {
      res.status(404).json({ error: 'Registro no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener barrio y vía por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear un nuevo barrio
router.post('/catalogo_barrios', async (req, res) => {
  const { nombre_barrio } = req.body;
  
  if (!nombre_barrio || nombre_barrio.trim() === '') {
    return res.status(400).json({ error: 'El nombre del barrio es obligatorio' });
  }

  try {
    const nuevoBarrio = await catalogoBarriosViasModel.insertBarrio(nombre_barrio.trim());
    res.status(201).json(nuevoBarrio);
  } catch (error) {
    console.error('Error al crear barrio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear una nueva calle en un barrio
router.post('/catalogo_calles', async (req, res) => {
  const { id_barrio, nombre_barrio, nombre_calle } = req.body;
  
  if (!id_barrio || !nombre_barrio || !nombre_calle || nombre_calle.trim() === '') {
    return res.status(400).json({ error: 'ID del barrio, nombre del barrio y nombre de la calle son obligatorios' });
  }

  try {
    const nuevaCalle = await catalogoBarriosViasModel.insertCalle(id_barrio, nombre_barrio, nombre_calle.trim());
    res.status(201).json(nuevaCalle);
  } catch (error) {
    console.error('Error al crear calle:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar un barrio
router.put('/catalogo_barrios/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { nombre_barrio } = req.body;
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número válido' });
  }
  
  if (!nombre_barrio || nombre_barrio.trim() === '') {
    return res.status(400).json({ error: 'El nombre del barrio es obligatorio' });
  }

  try {
    const barrioActualizado = await catalogoBarriosViasModel.updateBarrio(id, nombre_barrio.trim());
    if (barrioActualizado) {
      res.json(barrioActualizado);
    } else {
      res.status(404).json({ error: 'Barrio no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar barrio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar una calle
router.put('/catalogo_calles/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { nombre_calle } = req.body;
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número válido' });
  }
  
  if (!nombre_calle || nombre_calle.trim() === '') {
    return res.status(400).json({ error: 'El nombre de la calle es obligatorio' });
  }

  try {
    const calleActualizada = await catalogoBarriosViasModel.updateCalle(id, nombre_calle.trim());
    if (calleActualizada) {
      res.json(calleActualizada);
    } else {
      res.status(404).json({ error: 'Calle no encontrada' });
    }
  } catch (error) {
    console.error('Error al actualizar calle:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar nombre de barrio por id_barrio
router.put('/catalogo_barrios_by_id_barrio/:id_barrio', async (req, res) => {
  const id_barrio = parseInt(req.params.id_barrio, 10);
  const { nombre_barrio } = req.body;
  
  if (isNaN(id_barrio)) {
    return res.status(400).json({ error: 'El ID del barrio debe ser un número válido' });
  }
  
  if (!nombre_barrio || nombre_barrio.trim() === '') {
    return res.status(400).json({ error: 'El nombre del barrio es obligatorio' });
  }

  try {
    const barriosActualizados = await catalogoBarriosViasModel.updateBarrioByIdBarrio(id_barrio, nombre_barrio.trim());
    if (barriosActualizados && barriosActualizados.length > 0) {
      res.json({ 
        message: 'Barrio actualizado exitosamente', 
        registros_actualizados: barriosActualizados.length,
        barrios: barriosActualizados
      });
    } else {
      res.status(404).json({ error: 'Barrio no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar barrio por id_barrio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar un barrio o calle
router.delete('/catalogo_barrios_vias/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número válido' });
  }

  try {
    const eliminado = await catalogoBarriosViasModel.deleteBarrioVia(id);
    if (eliminado) {
      res.json({ message: 'Registro eliminado exitosamente', id: eliminado.id });
    } else {
      res.status(404).json({ error: 'Registro no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
