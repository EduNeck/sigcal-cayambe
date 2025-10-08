const express = require('express');
const router = express.Router();
const auditoriaCambios = require('../db/models/auditoriaCambios');

/**
 * @route GET /api/auditoria/cambios-predios
 * @desc Obtener cambios de predios con filtros
 * @access Public (solo lectura)
 * @params {string} fecha_inicio - Fecha de inicio (YYYY-MM-DD)
 * @params {string} fecha_fin - Fecha de fin (YYYY-MM-DD)
 * @params {string} clave_catastral - Filtro por clave catastral (opcional)
 * @params {string} usuario_actividad - Filtro por usuario (opcional)
 * @params {string} accion_actividad - Filtro por acción (opcional)
 * @params {number} id_tipo_predio - Filtro por tipo de predio: 1=Urbano, 2=Rural (opcional)
 * @params {number} page - Número de página (opcional, default: 1)
 * @params {number} pageSize - Tamaño de página (opcional, default: 50)
 * @params {string} sortField - Campo de ordenación (opcional, default: fecha_actividad)
 * @params {string} sortOrder - Orden ASC/DESC (opcional, default: DESC)
 */

router.get('/cambios-predios', async (req, res) => {
  try {
    console.log('🔍 Consultando cambios de predios:', req.query);
    
    const result = await auditoriaCambios.obtenerCambiosPredios(req.query);
    
    res.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
      message: `Se encontraron ${result.pagination.total} registros de cambios`
    });
  } catch (error) {
    console.error('❌ Error al consultar cambios de predios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al consultar los cambios de predios',
      error: error.message
    });
  }
});

/**
 * @route GET /api/auditoria/acciones-disponibles
 * @desc Obtener lista de acciones disponibles para filtrado
 * @access Public (solo lectura)
 */
router.get('/acciones-disponibles', async (req, res) => {
  try {
    console.log('🔍 Obteniendo acciones disponibles');
    
    const acciones = await auditoriaCambios.obtenerAccionesDisponibles();
    
    res.json({
      success: true,
      data: acciones,
      message: `Se encontraron ${acciones.length} tipos de acciones`
    });
  } catch (error) {
    console.error('❌ Error al obtener acciones disponibles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las acciones disponibles',
      error: error.message
    });
  }
});

/**
 * @route GET /api/auditoria/estadisticas-cambios
 * @desc Obtener estadísticas de cambios por período
 * @access Public (solo lectura)
 * @params {string} fecha_inicio - Fecha de inicio (YYYY-MM-DD) - Obligatorio
 * @params {string} fecha_fin - Fecha de fin (YYYY-MM-DD) - Obligatorio
 */
router.get('/estadisticas-cambios', async (req, res) => {
  try {
    console.log('📊 Obteniendo estadísticas de cambios:', req.query);
    
    const { fecha_inicio, fecha_fin, id_tipo_predio } = req.query;
    
    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Los parámetros fecha_inicio y fecha_fin son obligatorios'
      });
    }
    
    const estadisticas = await auditoriaCambios.obtenerEstadisticasCambios(
      fecha_inicio, 
      fecha_fin,
      id_tipo_predio
    );
    
    res.json({
      success: true,
      data: estadisticas,
      periodo: { fecha_inicio, fecha_fin, id_tipo_predio },
      message: `Estadísticas generadas para el período ${fecha_inicio} - ${fecha_fin}${id_tipo_predio ? ` (Tipo: ${id_tipo_predio})` : ''}`
    });
  } catch (error) {
    console.error('❌ Error al generar estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar las estadísticas de cambios',
      error: error.message
    });
  }
});

// ========================================
// RUTAS PARA CAMBIOS GEOGRÁFICOS
// ========================================

// Obtener cambios geográficos con filtros y paginación
router.get('/cambios-geograficos', async (req, res) => {
  try {
    console.log('🗺️ Consultando cambios geográficos:', req.query);
    
    const cambios = await auditoriaCambios.obtenerCambiosGeograficos(req.query);
    
    res.json({
      success: true,
      data: cambios.items,
      pagination: cambios.pagination,
      message: `Se encontraron ${cambios.pagination.total} registros de cambios geográficos`
    });
  } catch (error) {
    console.error('❌ Error al consultar cambios geográficos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los cambios geográficos',
      error: error.message
    });
  }
});

// Obtener acciones disponibles para cambios geográficos
router.get('/acciones-geograficas-disponibles', async (req, res) => {
  try {
    console.log('🗺️ Obteniendo acciones geográficas disponibles');
    
    const acciones = await auditoriaCambios.obtenerAccionesGeograficasDisponibles();
    
    res.json({
      success: true,
      data: acciones,
      message: `Se encontraron ${acciones.length} tipos de acciones geográficas`
    });
  } catch (error) {
    console.error('❌ Error al obtener acciones geográficas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las acciones geográficas disponibles',
      error: error.message
    });
  }
});

// Obtener estadísticas de cambios geográficos
router.get('/estadisticas-cambios-geograficos', async (req, res) => {
  try {
    console.log('📊 Obteniendo estadísticas de cambios geográficos:', req.query);
    
    const { fecha_inicio, fecha_fin, id_tipo_predio } = req.query;
    
    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Los parámetros fecha_inicio y fecha_fin son obligatorios'
      });
    }
    
    const estadisticas = await auditoriaCambios.obtenerEstadisticasCambiosGeograficos(
      fecha_inicio, 
      fecha_fin,
      id_tipo_predio
    );
    
    res.json({
      success: true,
      data: estadisticas,
      periodo: { fecha_inicio, fecha_fin, id_tipo_predio },
      message: `Estadísticas geográficas generadas para el período ${fecha_inicio} - ${fecha_fin}${id_tipo_predio ? ` (Tipo: ${id_tipo_predio})` : ''}`
    });
  } catch (error) {
    console.error('❌ Error al generar estadísticas geográficas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar las estadísticas de cambios geográficos',
      error: error.message
    });
  }
});

// ========================================
// RUTAS PARA CAMBIOS TOTALES (PREDIOS + GEOGRÁFICOS)
// ========================================

/**
 * @route GET /api/auditoria/cambios-total
 * @desc Obtener todos los cambios (predios + geográficos) desde view_cambios_total
 * @access Public (solo lectura)
 * @params {string} fecha_inicio - Fecha de inicio (YYYY-MM-DD)
 * @params {string} fecha_fin - Fecha de fin (YYYY-MM-DD)
 * @params {string} clave_catastral - Filtro por clave catastral (opcional)
 * @params {string} usuario_actividad - Filtro por usuario (opcional)
 * @params {string} accion_actividad - Filtro por acción (opcional)
 * @params {number} id_tipo_predio - Filtro por tipo de predio: 1=Urbano, 2=Rural (opcional)
 * @params {number} page - Número de página (opcional, default: 1)
 * @params {number} pageSize - Tamaño de página (opcional, default: 50)
 * @params {string} sortField - Campo de ordenación (opcional, default: fecha_actividad)
 * @params {string} sortOrder - Orden ASC/DESC (opcional, default: DESC)
 */
router.get('/cambios-total', async (req, res) => {
  try {
    console.log('🔍 Consultando cambios totales (predios + geográficos):', req.query);
    
    const result = await auditoriaCambios.obtenerCambiosTotal(req.query);
    
    res.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
      message: `Se encontraron ${result.pagination.total} registros de cambios totales`
    });
  } catch (error) {
    console.error('❌ Error al consultar cambios totales:', error);
    res.status(500).json({
      success: false,
      message: 'Error al consultar los cambios totales',
      error: error.message
    });
  }
});

/**
 * @route GET /api/auditoria/acciones-totales-disponibles
 * @desc Obtener lista de acciones disponibles desde la vista total
 * @access Public (solo lectura)
 */
router.get('/acciones-totales-disponibles', async (req, res) => {
  try {
    console.log('🔍 Obteniendo acciones totales disponibles');
    
    const acciones = await auditoriaCambios.obtenerAccionesTotalesDisponibles();
    
    res.json({
      success: true,
      data: acciones,
      message: `Se encontraron ${acciones.length} tipos de acciones totales`
    });
  } catch (error) {
    console.error('❌ Error al obtener acciones totales disponibles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las acciones totales disponibles',
      error: error.message
    });
  }
});

/**
 * @route GET /api/auditoria/estadisticas-cambios-total
 * @desc Obtener estadísticas de todos los cambios por período
 * @access Public (solo lectura)
 * @params {string} fecha_inicio - Fecha de inicio (YYYY-MM-DD) - Obligatorio
 * @params {string} fecha_fin - Fecha de fin (YYYY-MM-DD) - Obligatorio
 * @params {number} id_tipo_predio - Filtro por tipo de predio (opcional)
 */
router.get('/estadisticas-cambios-total', async (req, res) => {
  try {
    console.log('📊 Obteniendo estadísticas de cambios totales:', req.query);
    
    const { fecha_inicio, fecha_fin, id_tipo_predio } = req.query;
    
    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        success: false,
        message: 'Los parámetros fecha_inicio y fecha_fin son obligatorios'
      });
    }
    
    const estadisticas = await auditoriaCambios.obtenerEstadisticasCambiosTotal(
      fecha_inicio, 
      fecha_fin,
      id_tipo_predio
    );
    
    res.json({
      success: true,
      data: estadisticas,
      periodo: { fecha_inicio, fecha_fin, id_tipo_predio },
      message: `Estadísticas totales generadas para el período ${fecha_inicio} - ${fecha_fin}${id_tipo_predio ? ` (Tipo: ${id_tipo_predio})` : ''}`
    });
  } catch (error) {
    console.error('❌ Error al generar estadísticas totales:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar las estadísticas de cambios totales',
      error: error.message
    });
  }
});

module.exports = router;