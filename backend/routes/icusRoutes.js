/**
 * Rutas para la gestión de Informes de Compatibilidad de Uso de Suelo (ICUS)
 */
const express = require('express');
const router = express.Router();
const icusController = require('../controllers/icusController');

/**
 * @route POST /api/icus/crearIcus
 * @description Crear un nuevo ICUS
 * @access Public (debería ser privado en producción)
 */
router.post('/crearIcus', icusController.crearIcus);

/**
 * @route GET /api/icus/recuperarIcus/:id
 * @description Obtener un ICUS por su ID
 * @access Public (debería ser privado en producción)
 */
router.get('/recuperarIcus/:id', icusController.obtenerIcusPorId);

/**
 * @route GET /api/icus/recuperarIcus
 * @description Obtener todos los ICUS con paginación y búsqueda
 * @access Public (debería ser privado en producción)
 */
router.get('/recuperarIcus', icusController.obtenerIcus);

/**
 * @route PUT /api/icus/actualizarIcus/:id
 * @description Actualizar un ICUS existente
 * @access Public (debería ser privado en producción)
 */
router.put('/actualizarIcus/:id', icusController.actualizarIcus);

/**
 * @route DELETE /api/icus/eliminarIcus/:id
 * @description Eliminar un ICUS
 * @access Public (debería ser privado en producción)
 */
router.delete('/eliminarIcus/:id', icusController.eliminarIcus);

/**
 * @route GET /api/icus/buscar
 * @description Buscar ICUS por diversos criterios
 * @access Public (debería ser privado en producción)
 */
router.get('/buscar', icusController.buscarIcus);

module.exports = router;
