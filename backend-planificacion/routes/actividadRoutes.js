const express = require('express');
const router = express.Router();
const actividadController = require('../controllers/actividadController');
const { authenticateToken } = require('../middleware/auth');

// Aplicar middleware de autenticación JWT a todas las rutas
router.use(authenticateToken);

/**
 * @route GET /api/actividades
 * @desc Obtener todas las actividades
 * @access Private
 */
router.get('/', actividadController.obtenerActividades);

/**
 * @route GET /api/actividades/:id
 * @desc Obtener una actividad por su ID
 * @access Private
 */
router.get('/:id', actividadController.obtenerActividadPorId);

/**
 * @route POST /api/actividades
 * @desc Crear una nueva actividad
 * @access Private
 */
router.post('/', actividadController.crearActividad);

/**
 * @route PUT /api/actividades/:id
 * @desc Actualizar una actividad existente
 * @access Private
 */
router.put('/:id', actividadController.actualizarActividad);

/**
 * @route DELETE /api/actividades/:id
 * @desc Eliminar una actividad
 * @access Private
 */
router.delete('/:id', actividadController.eliminarActividad);

module.exports = router;
