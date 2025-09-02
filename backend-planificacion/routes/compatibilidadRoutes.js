const express = require('express');
const router = express.Router();
const compatibilidadController = require('../controllers/compatibilidadController');
const { authenticateToken } = require('../middleware/auth');

// Aplicar middleware de autenticación JWT a todas las rutas
router.use(authenticateToken);

/**
 * @route GET /api/compatibilidades
 * @desc Obtener todas las compatibilidades
 * @access Private
 */
router.get('/', compatibilidadController.obtenerCompatibilidades);

/**
 * @route GET /api/compatibilidades/:id
 * @desc Obtener una compatibilidad por su ID
 * @access Private
 */
router.get('/:id', compatibilidadController.obtenerCompatibilidadPorId);

/**
 * @route POST /api/compatibilidades
 * @desc Crear una nueva compatibilidad
 * @access Private
 */
router.post('/', compatibilidadController.crearCompatibilidad);

/**
 * @route PUT /api/compatibilidades/:id
 * @desc Actualizar una compatibilidad existente
 * @access Private
 */
router.put('/:id', compatibilidadController.actualizarCompatibilidad);

/**
 * @route DELETE /api/compatibilidades/:id
 * @desc Eliminar una compatibilidad
 * @access Private
 */
router.delete('/:id', compatibilidadController.eliminarCompatibilidad);

module.exports = router;
