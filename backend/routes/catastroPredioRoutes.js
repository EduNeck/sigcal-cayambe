const express = require('express');
const router = express.Router();
const catastroPredioModel = require('../db/models/catastroPredio');

// Ruta para insertar un registro en la tabla `catastro_predio`
router.post('/inserta_identificacion_predio', async (req, res) => {
  console.log('Solicitud recibida para insertar identificación de predio');
  console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));

  try {
    const newRecordId = await catastroPredioModel.insertaIdentificacionPredio(req.body);
    console.log('Nuevo registro insertado con ID:', newRecordId);
    res.status(201).json({ id: newRecordId });
  } catch (err) {
    console.error('Error inserting catastro_predio:', err);
    res.status(500).json({ error: err.message, detail: err.detail });
  }
});

// Ruta para actualizar un registro en la tabla `catastro_predio`
router.put('/actualiza_catastro_predio/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRecord = await catastroPredioModel.updateCatastroPredio(id, req.body);
    res.json(updatedRecord);
  } catch (err) {
    console.error('Error updating catastro_predio:', err);
    res.status(500).json({ error: err.message, detail: err.detail });
  }
});

// Ruta para obtener un predio por ID 
router.get('/catastro_predio_by_id/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const predio = await catastroPredioModel.getCatastroPredioById(id); 
    if (predio) {
      res.json(predio);
    } else {
      res.status(404).send('Predio not found');
    }
  } catch (error) {
    console.error('Error fetching predio:', error.message, error.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Ruta para obtener un predio por tipo de predio
router.get('/catastro_predio_by_tipo/:tipo', async (req, res) => {
  const tipo = req.params.tipo;
  try {
    const predio = await catastroPredioModel.getCatastroPredioByTipo(tipo);
    if (predio) {
      res.json(predio);
    } else {
      res.status(404).send('Predio not found');
    }
  } catch (error) {
    console.error('Error fetching predio:', error.message, error.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Ruta para actualizar características del predio
router.put('/catastro_actualiza_caracteristicas/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const idPredio = await catastroPredioModel.updateCaracteristicasPredio(id, data);
    res.status(200).json({ idPredio });
  } catch (error) {
    console.error('Error updating caracteristicas:', error.message, error.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Ruta para actualizar las observaciones de un predio
router.put('/actualiza_observaciones/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const idPredio = await catastroPredioModel.updateObservaciones(id, data);
    res.status(200).json({ idPredio });
  } catch (error) {
    console.error('Error updating observaciones:', error.message, error.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Ruta para eliminar un predio por ID
router.post('/elimina_predio_by_id/:id', async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'ID no proporcionado' });
  }

  try {
    const data = await catastroPredioModel.deleteCatastroPredio(id);

    if (data) {
      res.json({ message: 'Predio eliminado con éxito', data });
    } else {
      res.status(404).json({ error: 'Predio no encontrado' });
    }
  } catch (err) {
    console.error('Error eliminando catastro_predio:', err);
    res.status(500).json({ error: 'Error del servidor. Inténtalo de nuevo más tarde.' });
  }
});

// Ruta para obtener el id del predio `catastro_predio` basado en la clave catastral
router.get('/recupera_id_predio_by_clave/:clave', async (req, res) => {
  const { clave } = req.params;
  try {
    const idPredio = await catastroPredioModel.recuperaIdPredioByClave(clave);
    if (idPredio) {
      res.json({ id_predio: idPredio });
    } else {
      res.status(404).json({ error: 'Predio no encontrado' });
    }
  } catch (err) {
    console.error('Error al recuperar id_predio por clave catastral:', err);
    res.status(500).json({ error: 'Error al recuperar id_predio' });
  }
});

// Ruta para recuperar todas las claves catastrales
router.get('/claves_catastrales', async (req, res) => {
  try {
    const claves = await catastroPredioModel.recuperaClaves();
    res.json(claves);
  } catch (err) {
    console.error('Error al recuperar claves catastrales:', err);
    res.status(500).json({ error: 'Error al recuperar claves catastrales' });
  }
});

// Ruta para actualizar las características rurales de un predio
router.put('/actualiza_caracteristicas_rurales/:id', async (req, res) => {
  const id_predio = req.params.id;
  const data = req.body;

  try {
    const updatedId = await catastroPredioModel.updateCaracteristicasRurales(id_predio, data);
    res.status(200).json({ id_predio: updatedId });
  } catch (error) {
    console.error('Error al actualizar características rurales:', error.message);
    res.status(500).json({ error: 'Error al actualizar características rurales' });
  }
});

module.exports = router;
