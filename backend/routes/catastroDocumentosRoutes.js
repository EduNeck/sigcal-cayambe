const express = require('express');
const router = express.Router();
const catastroDocumentosModel = require('../db/models/catastroDocumentos');

// Insertar un nuevo documento
router.post('/inserta_documento', async (req, res) => {
  try {
    const newRecord = await catastroDocumentosModel.insertaDocumento(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('❌ Error al insertar documento:', err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un documento por su ID
router.put('/actualiza_documento_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRecord = await catastroDocumentosModel.actualizaDocumento(id, req.body);
    res.json(updatedRecord);
  } catch (err) {
    console.error('❌ Error al actualizar documento:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener un documento por su ID
router.get('/documento_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroDocumentosModel.obtieneDocumentoById(id);
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener documento por ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un documento por ID
router.delete('/elimina_documento_by_id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await catastroDocumentosModel.eliminaDocumento(id);
    if (data) {
      res.json({ message: 'Documento eliminado con éxito', data });
    } else {
      res.status(404).json({ error: 'Documento no encontrado' });
    }
  } catch (err) {
    console.error('❌ Error al eliminar documento:', err);
    res.status(500).json({ error: 'Error del servidor. Inténtalo de nuevo más tarde.' });
  }
});

// Obtener todos los documentos
router.get('/obtiene_documentos', async (req, res) => {
  try {
    const data = await catastroDocumentosModel.obtieneDocumentos();
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener documentos:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
