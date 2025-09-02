const express = require('express');
const router = express.Router();
const tipologiaController = require('../controllers/tipologiaController');
const { authenticateToken } = require('../middleware/auth');

// Aplicar middleware de autenticación JWT a todas las rutas
router.use(authenticateToken);

/**
 * @route GET /api/tipologias
 * @desc Obtener todas las tipologías
 * @access Private
 */
router.get('/', tipologiaController.obtenerTipologias);

/**
 * @route GET /api/tipologias/:id
 * @desc Obtener una tipología por su ID
 * @access Private
 */
router.get('/:id', tipologiaController.obtenerTipologiaPorId);

/**
 * @route POST /api/tipologias
 * @desc Crear una nueva tipología
 * @access Private
 */
router.post('/', tipologiaController.crearTipologia);

/**
 * @route PUT /api/tipologias/:id
 * @desc Actualizar una tipología existente
 * @access Private
 */
router.put('/:id', tipologiaController.actualizarTipologia);

/**
 * @route DELETE /api/tipologias/:id
 * @desc Eliminar una tipología
 * @access Private
 */
router.delete('/:id', tipologiaController.eliminarTipologia);

module.exports = router;
