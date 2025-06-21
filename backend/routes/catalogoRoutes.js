// routes/catalogo.js
const express = require('express');
const router = express.Router();
const catalogoModel = require('../db/models/catalogo');
const catastroParroquia = require('../db/models/catastroParroquia');
const catalogoProvinciaCantonModel = require('../db/models/catalogoProvinciaCanton');

// Obtener descripción por ID
router.get('/catalogo/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número válido' });
  }

  try {
    const descripcion = await catalogoModel.getDescripcionById(id);
    if (descripcion) {
      res.json(descripcion);
    } else {
      res.status(404).json({ error: 'Descripción no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener la descripción por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener descripción por ID y Tipo
router.get('/catalogo/:id/:tipo', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tipo = parseInt(req.params.tipo, 10);

  if (isNaN(id) || isNaN(tipo)) {
    return res.status(400).json({ error: 'El ID y el Tipo deben ser números válidos' });
  }

  try {
    const descripcion = await catalogoModel.getCatalogoByTipoAtributo(id, tipo);
    if (descripcion) {
      res.json(descripcion);
    } else {
      res.status(404).json({ error: 'Descripción no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener la descripción por ID y tipo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los registros por tipo de atributo (query param)
router.get('/catalogo', async (req, res) => {
  const { id_tipo_atributo } = req.query;
  try {
    const data = await catalogoModel.getCatalogoByTipoAtributo(id_tipo_atributo);
    res.json(data);
  } catch (error) {
    console.error('Error al obtener el catálogo por tipo de atributo:', error);
    res.status(500).send('Server Error');
  }
});

// Obtener todas las parroquias
router.get('/catastro_parroquia', async (req, res) => {
  try {
    const parroquias = await catastroParroquia.getAllCatastroParroquia();
    res.json(parroquias);
  } catch (err) {
    console.error('Error al obtener las parroquias:', err);
    res.status(500).send('Server Error');
  }
});

// Obtener todas las provincias
router.get('/catalogo_provincia', async (req, res) => {
  try {
    const provincias = await catalogoProvinciaCantonModel.getProvincias();
    res.json(provincias);
  } catch (err) {
    console.error('Error al obtener las provincias:', err);
    res.status(500).send('Server Error');
  }
});

// Obtener cantones por ID de provincia
router.get('/catalogo_cantonByProvincia/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const cantones = await catalogoProvinciaCantonModel.getCantonesByProvincia(id);
    res.json(cantones);
  } catch (err) {
    console.error('Error al obtener los cantones:', err);
    res.status(500).send('Server Error');
  }
});

// Obtener descripción de catastro_catalogo por ID
router.get('/catalogo_descripcion/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número válido' });
  }
  try {
    const descripcion = await catalogoModel.getDescripcionById(id);
    if (descripcion) {
      res.json(descripcion);
    } else {
      res.status(404).json({ error: 'Descripción no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener la descripción por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/catalogo_dominios
router.get('/catalogo_dominios', async (req, res) => {
  try {
    const dominios = await catalogoModel.getCatalogoDominio(); // Usar el método correcto
    res.json(dominios);
  } catch (error) {
    console.error('Error en /catalogo_dominios:', error);
    res.status(500).json({ error: 'Error al obtener los dominios del catálogo' });
  }
});

// PUT /api/catalogo_dominios/:id
router.put('/actualiza_catalogo_dominios/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const updated = await catalogoModel.updateCatalogoDominio(id, data);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Dominio no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el dominio:', error);
    res.status(500).json({ error: 'Error al actualizar el dominio' });
  }
});

// Obtener id y descripcion de catastro_tipo_atributo por ID
router.get('/tipo_atributo', async (req, res) => {
  try {
    const result = await catalogoModel.getTipoAtributo();
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Tipo de atributo no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener tipo_atributo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
