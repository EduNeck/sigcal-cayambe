const express = require('express');
const router = express.Router();
const geoLinderosModel = require('../db/models/geoLinderos');

// Ruta para insertar un registro en la tabla `geo_linderos`
router.post('/inserta_geo_lindero', async (req, res) => {
  console.log('Solicitud recibida para insertar geo_lindero');
  console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));

  try {
    const newRecordId = await geoLinderosModel.insertaGeoLindero(req.body);
    console.log('Nuevo geo_lindero insertado con ID:', newRecordId);
    res.status(201).json({ id: newRecordId });
  } catch (err) {
    console.error('Error inserting geo_lindero:', err);
    res.status(500).json({ error: err.message, detail: err.detail });
  }
});

// Ruta para actualizar un registro en la tabla `geo_linderos`
router.put('/actualiza_geo_lindero/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Solicitud recibida para actualizar geo_lindero ID: ${id}`);
  console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));

  try {
    const updatedRecord = await geoLinderosModel.updateGeoLindero(id, req.body);
    console.log('Geo_lindero actualizado:', updatedRecord);
    res.json(updatedRecord);
  } catch (err) {
    console.error('Error updating geo_lindero:', err);
    res.status(500).json({ error: err.message, detail: err.detail });
  }
});

// Ruta para obtener todos los geo_linderos
router.get('/geo_linderos', async (req, res) => {
  console.log('Solicitud recibida para obtener todos los geo_linderos');

  try {
    const linderos = await geoLinderosModel.getGeoLinderos();
    console.log(`Se encontraron ${linderos.length} geo_linderos`);
    res.json(linderos);
  } catch (err) {
    console.error('Error fetching geo_linderos:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para obtener un geo_lindero por ID
router.get('/geo_lindero_by_id/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Solicitud recibida para obtener geo_lindero por ID: ${id}`);

  try {
    const lindero = await geoLinderosModel.getGeoLinderoById(id);
    if (lindero) {
      console.log('Geo_lindero encontrado:', lindero);
      res.json(lindero);
    } else {
      res.status(404).json({ error: 'Geo_lindero no encontrado' });
    }
  } catch (err) {
    console.error('Error fetching geo_lindero by ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para obtener geo_linderos por clave catastral
router.get('/geo_linderos_by_clave/:clave_catastral', async (req, res) => {
  const { clave_catastral } = req.params;
  console.log(`Solicitud recibida para obtener geo_linderos por clave catastral: ${clave_catastral}`);

  try {
    const linderos = await geoLinderosModel.getGeoLinderosByClave(clave_catastral);
    console.log(`Se encontraron ${linderos.length} geo_linderos para la clave catastral: ${clave_catastral}`);
    res.json(linderos);
  } catch (err) {
    console.error('Error fetching geo_linderos by clave catastral:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para obtener geo_linderos por tipo
router.get('/geo_linderos_by_tipo/:tipo', async (req, res) => {
  const { tipo } = req.params;
  console.log(`Solicitud recibida para obtener geo_linderos por tipo: ${tipo}`);

  try {
    const linderos = await geoLinderosModel.getGeoLinderosByTipo(tipo);
    console.log(`Se encontraron ${linderos.length} geo_linderos para el tipo: ${tipo}`);
    res.json(linderos);
  } catch (err) {
    console.error('Error fetching geo_linderos by tipo:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para obtener geo_linderos por tipo
router.get('/geo_linderos_by_tipo/:tipo', async (req, res) => {
  const { tipo } = req.params;
  console.log(`Solicitud recibida para obtener geo_linderos por tipo: ${tipo}`);

  try {
    const linderos = await geoLinderosModel.getGeoLinderosByTipo(tipo);
    console.log(`Se encontraron ${linderos.length} geo_linderos para el tipo: ${tipo}`);
    res.json(linderos);
  } catch (err) {
    console.error('Error fetching geo_linderos by tipo:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para eliminar un geo_lindero por ID
router.delete('/elimina_geo_lindero/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Solicitud recibida para eliminar geo_lindero ID: ${id}`);

  try {
    const deletedRecord = await geoLinderosModel.deleteGeoLindero(id);
    if (deletedRecord) {
      console.log('Geo_lindero eliminado:', deletedRecord);
      res.json({ message: 'Geo_lindero eliminado exitosamente', id: deletedRecord.id });
    } else {
      res.status(404).json({ error: 'Geo_lindero no encontrado' });
    }
  } catch (err) {
    console.error('Error deleting geo_lindero:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para eliminar geo_linderos por clave
router.delete('/elimina_geo_linderos_by_clave/:clave', async (req, res) => {
  const { clave } = req.params;
  console.log(`Solicitud recibida para eliminar geo_linderos por clave: ${clave}`);

  try {
    const deletedRecords = await geoLinderosModel.deleteGeoLinderosByClave(clave);
    console.log(`${deletedRecords.length} geo_linderos eliminados para la clave: ${clave}`);
    res.json({ 
      message: 'Geo_linderos eliminados exitosamente', 
      count: deletedRecords.length,
      ids: deletedRecords.map(record => record.id)
    });
  } catch (err) {
    console.error('Error deleting geo_linderos by clave:', err);
    res.status(500).json({ error: err.message });
  }
});

// Ruta para obtener estadísticas de geo_linderos
router.get('/geo_linderos_stats', async (req, res) => {
  console.log('Solicitud recibida para obtener estadísticas de geo_linderos');

  try {
    const stats = await geoLinderosModel.getGeoLinderosStats();
    console.log('Estadísticas de geo_linderos:', stats);
    res.json(stats);
  } catch (err) {
    console.error('Error fetching geo_linderos stats:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
