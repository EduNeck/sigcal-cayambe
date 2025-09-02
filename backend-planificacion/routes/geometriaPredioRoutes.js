const express = require('express');
const router = express.Router();
const geometriaController = require('../controllers/geometriaController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   GET /api/geometria-predio/:claveCatastral
 * @desc    Obtener la geometría de un predio por su clave catastral
 * @access  Privado (requiere autenticación)
 */
router.get('/:claveCatastral', authenticateToken, geometriaController.obtenerGeometriaPorClaveCatastral);

module.exports = router;
