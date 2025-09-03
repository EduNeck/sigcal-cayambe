const express = require('express');
const router = express.Router();
const compatibilidadController = require('../controllers/compatibilidadController');
const { authenticateToken } = require('../middleware/auth');

// Ruta pública para obtener compatibilidad por tipología y uso (no requiere autenticación)
router.get('/tipologia-uso/resultado', compatibilidadController.obtenerCompatibilidadPorTipologiaYUso);

// Aplicar middleware de autenticación JWT al resto de las rutas
router.use(authenticateToken);

/**
 * @route GET /api/compatibilidades
 * @desc Obtener todas las compatibilidades
 * @access Private
 */
router.get('/', compatibilidadController.obtenerCompatibilidades);

// Esta ruta ya está definida antes del middleware de autenticación

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
