// backend/routes/catastroDocumentos.js
const express = require('express');
const router = express.Router();
const model = require('../db/models/catastroDocumentos');

// Crear
router.post('/inserta_documento', async (req, res) => {
  try {
    if (!req.body.documento) return res.status(400).json({ error: 'Falta documento (base64)' });
    if (!req.body.id_predio) return res.status(400).json({ error: 'Falta id_predio' });

    const id = await model.insertaDocumento(req.body);
    res.status(201).json({ id_documentos: id });
  } catch (err) {
    console.error('❌ Error al insertar documento:', err);
    res.status(500).json({ error: 'Error al insertar documento' });
  }
});

// Actualizar
router.put('/actualiza_documento_by_id/:id', async (req, res) => {
  try {
    const updated = await model.actualizaDocumento(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'No encontrado' });
    res.json(updated);
  } catch (err) {
    console.error('❌ Error al actualizar documento:', err);
    res.status(500).json({ error: 'Error al actualizar documento' });
  }
});

// Obtener por ID (con base64)
router.get('/documento_by_id/:id', async (req, res) => {
  try {
    const data = await model.obtieneDocumentoById(req.params.id);
    if (!data) return res.status(404).json({ error: 'No encontrado' });
    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener documento por ID:', err);
    res.status(500).json({ error: 'Error al obtener documento' });
  }
});

// Eliminar
router.delete('/elimina_documento_by_id/:id', async (req, res) => {
  try {
    const data = await model.eliminaDocumento(req.params.id);
    if (!data) return res.status(404).json({ error: 'Documento no encontrado' });
    res.json({ message: 'Documento eliminado con éxito', data });
  } catch (err) {
    console.error('❌ Error al eliminar documento:', err);
    res.status(500).json({ error: 'Error al eliminar documento' });
  }
});

// Listado liviano (sin campo documento)
router.get('/obtiene_documentos', async (_req, res) => {
  try {
    const data = await model.obtieneDocumentosLite();
    res.json(data);
  } catch (err) {
    console.error('❌ Error al listar documentos:', err);
    res.status(500).json({ error: 'Error al listar documentos' });
  }
});

// Descarga binaria por ID
router.get('/documento/:id/download', async (req, res) => {
  try {
    const q = `
      SELECT nombre, tipo, documento
      FROM public.catastro_documentos
      WHERE id_documentos = $1
    `;
    const db = require('../db/config');
    const r = await db.query(q, [req.params.id]);
    if (!r.rowCount) return res.status(404).send('No encontrado');

    const { nombre, tipo, documento } = r.rows[0];
    if (!documento) return res.status(404).send('Documento vacío');

    const buf = Buffer.from(documento);
    res.setHeader('Content-Type', tipo || 'application/octet-stream');
    res.setHeader('Content-Length', buf.length);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(nombre || 'documento')}"`);
    res.send(buf);
  } catch (err) {
    console.error('❌ Error al descargar documento:', err);
    res.status(500).send('Error al descargar');
  }
});

module.exports = router;
