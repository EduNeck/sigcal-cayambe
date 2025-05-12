const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const catalogoFotosModel = require('../db/models/catalogoFotos');

// Insertar nueva foto en catalogo_fotos
router.post('/inserta_foto', upload.single('foto'), async (req, res) => {
  try {
    const { descripcion, principal, id_predio } = req.body;
    const fotoBuffer = req.file ? req.file.buffer : null;

    if (!fotoBuffer) {
      return res.status(400).json({ error: 'No se recibió una imagen válida' });
    }

    const result = await catalogoFotosModel.insertFotoPredio(descripcion, fotoBuffer, principal, id_predio);
    res.json({ message: 'Foto guardada correctamente', id_foto: result.id_foto });

  } catch (error) {
    console.error('❌ Error al insertar foto:', error);
    res.status(500).json({ error: 'Error al insertar la foto' });
  }
});

// Actualizar una foto existente
router.put('/actualiza_foto/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRecord = await catalogoFotosModel.updateFotoPredio(id, req.body);
    res.json(updatedRecord);
  } catch (err) {
    console.error('Error al actualizar foto:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener foto por ID
router.get('/foto_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catalogoFotosModel.getFotoPredioById(id);
    res.json(data);
  } catch (err) {
    console.error('Error al obtener la foto por ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las fotos por ID de predio
router.get('/fotos_by_idPredio/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catalogoFotosModel.getFotoPredioByIdPredio(id);
    res.json(data);
  } catch (err) {
    console.error('Error al obtener fotos por ID de predio:', err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar foto por ID
router.post('/elimina_foto_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catalogoFotosModel.deleteFotoPredioById(id);
    res.json(data);
  } catch (err) {
    console.error('Error al eliminar la foto:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
