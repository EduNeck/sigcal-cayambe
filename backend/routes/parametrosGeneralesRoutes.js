const express = require('express');
const router = express.Router();
const parametrosGeneralesModel = require('../db/models/parametrosGenerales');

/**
 * @route   GET /api/parametros
 * @desc    Obtener todos los parámetros generales
 * @access  Public
 */
router.get('/parametros', async (req, res) => {
  try {
    const parametros = await parametrosGeneralesModel.getParametrosGenerales();
    res.json(parametros);
  } catch (error) {
    console.error('❌ Error al obtener parámetros generales:', error);
    res.status(500).json({ error: 'Error al obtener parámetros generales' });
  }
});

/**
 * @route   GET /api/parametros/codigo/:codigo
 * @desc    Obtener un parámetro específico por su código
 * @access  Public
 */
router.get('/parametros/codigo/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    const parametro = await parametrosGeneralesModel.getParametroByCodigo(codigo);
    
    if (!parametro) {
      return res.status(404).json({ error: `No se encontró parámetro con código: ${codigo}` });
    }
    
    res.json(parametro);
  } catch (error) {
    console.error(`❌ Error al obtener parámetro con código ${req.params.codigo}:`, error);
    res.status(500).json({ error: 'Error al obtener el parámetro' });
  }
});

/**
 * @route   GET /api/parametros/descripcion/:descripcion
 * @desc    Buscar parámetros por descripción
 * @access  Public
 */
router.get('/parametros/descripcion/:descripcion', async (req, res) => {
  try {
    const { descripcion } = req.params;
    const parametros = await parametrosGeneralesModel.getParametrosByDescripcion(descripcion);
    res.json(parametros);
  } catch (error) {
    console.error(`❌ Error al buscar parámetros con descripción ${req.params.descripcion}:`, error);
    res.status(500).json({ error: 'Error al buscar parámetros por descripción' });
  }
});

/**
 * @route   POST /api/parametros
 * @desc    Crear un nuevo parámetro
 * @access  Public
 */
router.post('/parametros', async (req, res) => {
  try {
    const { codigo, url, descripcion, fecha_registro } = req.body;
    
    // Validación básica
    if (!codigo || !url || !descripcion) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos',
        required: ['codigo', 'url', 'descripcion'] 
      });
    }
    
    // Verificar si ya existe un parámetro con el mismo código
    const existente = await parametrosGeneralesModel.getParametroByCodigo(codigo);
    if (existente) {
      return res.status(409).json({ 
        error: `Ya existe un parámetro con el código: ${codigo}` 
      });
    }
    
    const nuevoParametro = await parametrosGeneralesModel.createParametro({
      codigo,
      url,
      descripcion,
      fecha_registro
    });
    
    res.status(201).json(nuevoParametro);
  } catch (error) {
    console.error('❌ Error al crear parámetro:', error);
    res.status(500).json({ error: 'Error al crear el parámetro' });
  }
});

/**
 * @route   PUT /api/parametros/:codigo
 * @desc    Actualizar un parámetro existente
 * @access  Public
 */
router.put('/parametros/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    const { url, descripcion, fecha_registro } = req.body;
    
    // Validación básica
    if (!url && !descripcion) {
      return res.status(400).json({ 
        error: 'Se requiere al menos un campo para actualizar',
        updatable: ['url', 'descripcion', 'fecha_registro'] 
      });
    }
    
    // Verificar si el parámetro existe
    const existente = await parametrosGeneralesModel.getParametroByCodigo(codigo);
    if (!existente) {
      return res.status(404).json({ 
        error: `No se encontró parámetro con código: ${codigo}` 
      });
    }
    
    const parametroActualizado = await parametrosGeneralesModel.updateParametro(codigo, {
      url: url || existente.url,
      descripcion: descripcion || existente.descripcion,
      fecha_registro: fecha_registro || existente.fecha_registro
    });
    
    res.json(parametroActualizado);
  } catch (error) {
    console.error(`❌ Error al actualizar parámetro ${req.params.codigo}:`, error);
    res.status(500).json({ error: 'Error al actualizar el parámetro' });
  }
});

/**
 * @route   DELETE /api/parametros/:codigo
 * @desc    Eliminar un parámetro
 * @access  Public
 */
router.delete('/parametros/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    
    const parametroEliminado = await parametrosGeneralesModel.deleteParametro(codigo);
    
    if (!parametroEliminado) {
      return res.status(404).json({ 
        error: `No se encontró parámetro con código: ${codigo}` 
      });
    }
    
    res.json({
      message: `Parámetro con código ${codigo} eliminado exitosamente`,
      parametro: parametroEliminado
    });
  } catch (error) {
    console.error(`❌ Error al eliminar parámetro ${req.params.codigo}:`, error);
    res.status(500).json({ error: 'Error al eliminar el parámetro' });
  }
});

module.exports = router;
