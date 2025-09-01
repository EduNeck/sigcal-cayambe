const express = require('express');
const router = express.Router();
const irmController = require('../controllers/irmController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   POST /api/planificacion/irm
 * @desc    Crear un nuevo IRM
 * @access  Privado (requiere autenticación)
 */
router.post('/', authenticateToken, irmController.createIRM);

/**
 * @route   GET /api/planificacion/irm/:id
 * @desc    Obtener un IRM por su ID
 * @access  Privado (requiere autenticación)
 */
router.get('/:id', authenticateToken, irmController.getIRMById);

/**
 * @route   GET /api/planificacion/irm
 * @desc    Listar IRMs con paginación y filtros
 * @access  Privado (requiere autenticación)
 */
router.get('/', authenticateToken, irmController.listIRMs);

/**
 * @route   PUT /api/planificacion/irm/:id
 * @desc    Actualizar un IRM existente
 * @access  Privado (requiere autenticación)
 */
router.put('/:id', authenticateToken, irmController.updateIRM);

/**
 * @route   DELETE /api/planificacion/irm/:id
 * @desc    Eliminar un IRM existente
 * @access  Privado (requiere autenticación)
 */
router.delete('/:id', authenticateToken, irmController.deleteIRM);

module.exports = router;
