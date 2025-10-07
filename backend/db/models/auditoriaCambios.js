const db = require('../config');

/**
 * Obtiene los cambios de predios desde la vista view_cambios_predios
 * con filtro por rango de fechas
 */
const obtenerCambiosPredios = async (params) => {
  const {
    fecha_inicio,
    fecha_fin,
    clave_catastral,
    usuario_actividad,
    accion_actividad,
    id_tipo_predio,
    page = 1,
    pageSize = 50,
    sortField = 'fecha_actividad',
    sortOrder = 'DESC'
  } = params;

  let baseQuery = `
    SELECT 
      clave_catastral, 
      fecha_actividad, 
      accion_actividad, 
      usuario_actividad, 
      indice_actividad, 
      fuente,
      id_tipo_predio
    FROM actividad.view_cambios_predios 
    WHERE 1=1
  `;
  
  const queryParams = [];

  // Filtro obligatorio por rango de fechas (incluir todo el día)
  if (fecha_inicio && fecha_fin) {
    queryParams.push(fecha_inicio + ' 00:00:00', fecha_fin + ' 23:59:59');
    baseQuery += ` AND fecha_actividad BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
    console.log(`🕐 Filtro de fechas: ${fecha_inicio} 00:00:00 hasta ${fecha_fin} 23:59:59`);
  } else if (fecha_inicio) {
    queryParams.push(fecha_inicio + ' 00:00:00');
    baseQuery += ` AND fecha_actividad >= $${queryParams.length}`;
    console.log(`🕐 Filtro fecha inicio: ${fecha_inicio} 00:00:00`);
  } else if (fecha_fin) {
    queryParams.push(fecha_fin + ' 23:59:59');
    baseQuery += ` AND fecha_actividad <= $${queryParams.length}`;
    console.log(`🕐 Filtro fecha fin: ${fecha_fin} 23:59:59`);
  }

  // Filtros opcionales
  if (clave_catastral && clave_catastral.trim() !== '') {
    queryParams.push(`%${clave_catastral.trim()}%`);
    baseQuery += ` AND clave_catastral ILIKE $${queryParams.length}`;
  }

  if (usuario_actividad && usuario_actividad.trim() !== '') {
    queryParams.push(`%${usuario_actividad.trim()}%`);
    baseQuery += ` AND usuario_actividad ILIKE $${queryParams.length}`;
  }

  if (accion_actividad && accion_actividad.trim() !== '') {
    queryParams.push(accion_actividad.trim());
    baseQuery += ` AND accion_actividad = $${queryParams.length}`;
  }

  if (id_tipo_predio && !isNaN(parseInt(id_tipo_predio))) {
    queryParams.push(parseInt(id_tipo_predio));
    baseQuery += ` AND id_tipo_predio = $${queryParams.length}`;
  }

  try {
    // Consulta para obtener el total de registros - construir desde cero para evitar problemas de formato
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM actividad.view_cambios_predios 
      WHERE 1=1
    `;
    
    // Agregar los mismos filtros que la consulta base
    let countParams = [];
    
    // Filtro obligatorio por rango de fechas (incluir todo el día)
    if (fecha_inicio && fecha_fin) {
      countParams.push(fecha_inicio + ' 00:00:00', fecha_fin + ' 23:59:59');
      countQuery += ` AND fecha_actividad BETWEEN $${countParams.length - 1} AND $${countParams.length}`;
    } else if (fecha_inicio) {
      countParams.push(fecha_inicio + ' 00:00:00');
      countQuery += ` AND fecha_actividad >= $${countParams.length}`;
    } else if (fecha_fin) {
      countParams.push(fecha_fin + ' 23:59:59');
      countQuery += ` AND fecha_actividad <= $${countParams.length}`;
    }

    // Filtros opcionales
    if (clave_catastral && clave_catastral.trim() !== '') {
      countParams.push(`%${clave_catastral.trim()}%`);
      countQuery += ` AND clave_catastral ILIKE $${countParams.length}`;
    }

    if (usuario_actividad && usuario_actividad.trim() !== '') {
      countParams.push(`%${usuario_actividad.trim()}%`);
      countQuery += ` AND usuario_actividad ILIKE $${countParams.length}`;
    }

    if (accion_actividad && accion_actividad.trim() !== '') {
      countParams.push(accion_actividad.trim());
      countQuery += ` AND accion_actividad = $${countParams.length}`;
    }

    // Filtro por tipo de predio
    if (id_tipo_predio && !isNaN(parseInt(id_tipo_predio))) {
      countParams.push(parseInt(id_tipo_predio));
      countQuery += ` AND id_tipo_predio = $${countParams.length}`;
    }
    
    const countResult = await db.query(countQuery, countParams);
    
    // Validar que el resultado existe
    if (!countResult || !countResult.rows || countResult.rows.length === 0) {
      console.log('⚠️ No se encontraron resultados en la consulta de conteo');
      return {
        data: [],
        pagination: {
          currentPage: parseInt(page),
          pageSize: parseInt(pageSize),
          totalItems: 0,
          totalPages: 0
        }
      };
    }
    
    const totalItems = parseInt(countResult.rows[0].total) || 0;

    // Validar campos de ordenación para evitar inyección SQL
    const validFields = [
      'clave_catastral', 
      'fecha_actividad', 
      'accion_actividad', 
      'usuario_actividad', 
      'indice_actividad',
      'fuente',
      'id_tipo_predio'
    ];
    
    const validatedSortField = validFields.includes(sortField) ? sortField : 'fecha_actividad';
    const validatedSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder : 'DESC';
    
    // Añadir ordenación y paginación
    const offset = (page - 1) * pageSize;
    const dataQuery = baseQuery + 
      ` ORDER BY ${validatedSortField} ${validatedSortOrder}` +
      ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    
    const paginationParams = [...queryParams, pageSize, offset];
    
    // Ejecutar consulta principal
    const result = await db.query(dataQuery, paginationParams);
    
    console.log('✅ Cambios encontrados:', result.rows?.length || 0, 'registros');
    
    return {
      items: result.rows || [],
      pagination: {
        total: totalItems,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(totalItems / pageSize)
      }
    };
  } catch (err) {
    console.error('❌ Error al consultar cambios de predios:', err);
    console.error('❌ Stack:', err.stack);
    console.error('❌ Query base:', baseQuery);
    console.error('❌ Parámetros:', queryParams);
    
    // Retornar estructura vacía en caso de error
    return {
      items: [],
      pagination: {
        total: 0,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: 0
      },
      error: err.message
    };
  }
};

/**
 * Obtiene las acciones disponibles para filtrado
 */
const obtenerAccionesDisponibles = async () => {
  try {
    const query = `
      SELECT DISTINCT accion_actividad 
      FROM actividad.view_cambios_predios 
      WHERE accion_actividad IS NOT NULL 
      ORDER BY accion_actividad
    `;
    
    const result = await db.query(query);
    
    if (!result || !result.rows) {
      return [];
    }
    
    return result.rows.map(row => row.accion_actividad);
  } catch (err) {
    console.error('❌ Error al obtener acciones disponibles:', err);
    console.error('❌ Stack:', err.stack);
    return [];
  }
};

/**
 * Obtiene estadísticas básicas de cambios por período
 */
const obtenerEstadisticasCambios = async (fecha_inicio, fecha_fin, id_tipo_predio = null) => {
  try {
    let query = `
      SELECT 
        accion_actividad,
        COUNT(*) as total_cambios,
        COUNT(DISTINCT clave_catastral) as predios_afectados,
        COUNT(DISTINCT usuario_actividad) as usuarios_involucrados
      FROM actividad.view_cambios_predios 
      WHERE fecha_actividad BETWEEN $1 AND $2
    `;
    
    const params = [fecha_inicio + ' 00:00:00', fecha_fin + ' 23:59:59'];
    console.log(`📊 Estadísticas: ${fecha_inicio} 00:00:00 hasta ${fecha_fin} 23:59:59, tipo: ${id_tipo_predio || 'todos'}`);
    
    // Agregar filtro por tipo de predio si se proporciona
    if (id_tipo_predio && !isNaN(parseInt(id_tipo_predio))) {
      query += ` AND id_tipo_predio = $${params.length + 1}`;
      params.push(parseInt(id_tipo_predio));
    }
    
    query += `
      GROUP BY accion_actividad
      ORDER BY total_cambios DESC
    `;
    
    const result = await db.query(query, params);
    
    if (!result || !result.rows) {
      return [];
    }
    
    return result.rows;
  } catch (err) {
    console.error('❌ Error al obtener estadísticas de cambios:', err);
    console.error('❌ Stack:', err.stack);
    console.error('❌ Query:', query);
    console.error('❌ Parámetros:', params);
    return [];
  }
};

/**
 * ========================================
 * FUNCIONES PARA CAMBIOS GEOGRÁFICOS
 * ========================================
 */

/**
 * Obtiene cambios geográficos con filtros y paginación
 */
const obtenerCambiosGeograficos = async (params) => {
  const {
    fecha_inicio,
    fecha_fin,
    clave_catastral,
    usuario_actividad,
    accion_actividad,
    id_tipo_predio,
    page = 1,
    pageSize = 50,
    sortField = 'fecha_actividad',
    sortOrder = 'DESC'
  } = params;

  let baseQuery = `
    SELECT 
      clave_catastral, 
      fecha_actividad, 
      accion_actividad, 
      usuario_actividad, 
      indice_actividad, 
      fuente,
      id_tipo_predio
    FROM actividad.view_cambios_geo 
    WHERE 1=1
  `;
  
  const queryParams = [];

  // Filtro obligatorio por rango de fechas (incluir todo el día)
  if (fecha_inicio && fecha_fin) {
    queryParams.push(fecha_inicio + ' 00:00:00', fecha_fin + ' 23:59:59');
    baseQuery += ` AND fecha_actividad BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
    console.log(`🕐 Filtro fechas geográficas: ${fecha_inicio} 00:00:00 hasta ${fecha_fin} 23:59:59`);
  } else if (fecha_inicio) {
    queryParams.push(fecha_inicio + ' 00:00:00');
    baseQuery += ` AND fecha_actividad >= $${queryParams.length}`;
    console.log(`🕐 Filtro fecha inicio geográfica: ${fecha_inicio} 00:00:00`);
  } else if (fecha_fin) {
    queryParams.push(fecha_fin + ' 23:59:59');
    baseQuery += ` AND fecha_actividad <= $${queryParams.length}`;
    console.log(`🕐 Filtro fecha fin geográfica: ${fecha_fin} 23:59:59`);
  }

  // Filtros opcionales
  if (clave_catastral && clave_catastral.trim() !== '') {
    queryParams.push(`%${clave_catastral.trim()}%`);
    baseQuery += ` AND clave_catastral ILIKE $${queryParams.length}`;
  }

  if (usuario_actividad && usuario_actividad.trim() !== '') {
    queryParams.push(`%${usuario_actividad.trim()}%`);
    baseQuery += ` AND usuario_actividad ILIKE $${queryParams.length}`;
  }

  if (accion_actividad && accion_actividad.trim() !== '') {
    queryParams.push(accion_actividad.trim());
    baseQuery += ` AND accion_actividad = $${queryParams.length}`;
  }

  // Filtro por tipo de predio
  if (id_tipo_predio && !isNaN(parseInt(id_tipo_predio))) {
    queryParams.push(parseInt(id_tipo_predio));
    baseQuery += ` AND id_tipo_predio = $${queryParams.length}`;
  }

  try {
    // Consulta para obtener el total de registros
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM actividad.view_cambios_geo 
      WHERE 1=1
    `;
    
    // Agregar los mismos filtros que la consulta base
    let countParams = [];
    
    // Filtro obligatorio por rango de fechas (incluir todo el día)
    if (fecha_inicio && fecha_fin) {
      countParams.push(fecha_inicio + ' 00:00:00', fecha_fin + ' 23:59:59');
      countQuery += ` AND fecha_actividad BETWEEN $${countParams.length - 1} AND $${countParams.length}`;
    } else if (fecha_inicio) {
      countParams.push(fecha_inicio + ' 00:00:00');
      countQuery += ` AND fecha_actividad >= $${countParams.length}`;
    } else if (fecha_fin) {
      countParams.push(fecha_fin + ' 23:59:59');
      countQuery += ` AND fecha_actividad <= $${countParams.length}`;
    }

    // Filtros opcionales
    if (clave_catastral && clave_catastral.trim() !== '') {
      countParams.push(`%${clave_catastral.trim()}%`);
      countQuery += ` AND clave_catastral ILIKE $${countParams.length}`;
    }

    if (usuario_actividad && usuario_actividad.trim() !== '') {
      countParams.push(`%${usuario_actividad.trim()}%`);
      countQuery += ` AND usuario_actividad ILIKE $${countParams.length}`;
    }

    if (accion_actividad && accion_actividad.trim() !== '') {
      countParams.push(accion_actividad.trim());
      countQuery += ` AND accion_actividad = $${countParams.length}`;
    }

    // Filtro por tipo de predio
    if (id_tipo_predio && !isNaN(parseInt(id_tipo_predio))) {
      countParams.push(parseInt(id_tipo_predio));
      countQuery += ` AND id_tipo_predio = $${countParams.length}`;
    }

    const countResult = await db.query(countQuery, countParams);
    
    // Validar que el resultado existe
    if (!countResult || !countResult.rows || countResult.rows.length === 0) {
      console.log('⚠️ No se encontraron resultados en la consulta de conteo geográfica');
      return {
        items: [],
        pagination: {
          total: 0,
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          totalPages: 0
        }
      };
    }
    
    const totalItems = parseInt(countResult.rows[0].total) || 0;

    // Validar campos de ordenación para evitar inyección SQL
    const validFields = [
      'clave_catastral', 
      'fecha_actividad', 
      'accion_actividad', 
      'usuario_actividad', 
      'indice_actividad',
      'fuente',
      'id_tipo_predio'
    ];
    
    const validatedSortField = validFields.includes(sortField) ? sortField : 'fecha_actividad';
    const validatedSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) ? sortOrder : 'DESC';
    
    // Añadir ordenación y paginación
    const offset = (page - 1) * pageSize;
    const dataQuery = baseQuery + 
      ` ORDER BY ${validatedSortField} ${validatedSortOrder}` +
      ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    
    const paginationParams = [...queryParams, pageSize, offset];
    
    // Ejecutar consulta principal
    const result = await db.query(dataQuery, paginationParams);
    
    console.log('✅ Cambios geográficos encontrados:', result.rows?.length || 0, 'registros');
    
    return {
      items: result.rows || [],
      pagination: {
        total: totalItems,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(totalItems / pageSize)
      }
    };
  } catch (err) {
    console.error('❌ Error al consultar cambios geográficos:', err);
    console.error('❌ Stack:', err.stack);
    console.error('❌ Query base:', baseQuery);
    console.error('❌ Parámetros:', queryParams);
    
    // Retornar estructura vacía en caso de error
    return {
      items: [],
      pagination: {
        total: 0,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: 0
      },
      error: err.message
    };
  }
};

/**
 * Obtiene las acciones disponibles para filtrado geográfico
 */
const obtenerAccionesGeograficasDisponibles = async () => {
  try {
    const query = `
      SELECT DISTINCT accion_actividad 
      FROM actividad.view_cambios_geo 
      WHERE accion_actividad IS NOT NULL 
      ORDER BY accion_actividad
    `;
    
    const result = await db.query(query);
    
    if (!result || !result.rows) {
      return [];
    }
    
    return result.rows.map(row => row.accion_actividad);
  } catch (err) {
    console.error('❌ Error al obtener acciones geográficas disponibles:', err);
    console.error('❌ Stack:', err.stack);
    return [];
  }
};

/**
 * Obtiene estadísticas básicas de cambios geográficos por período
 */
const obtenerEstadisticasCambiosGeograficos = async (fecha_inicio, fecha_fin, id_tipo_predio = null) => {
  try {
    let query = `
      SELECT 
        accion_actividad,
        COUNT(*) as total_cambios,
        COUNT(DISTINCT clave_catastral) as predios_afectados,
        COUNT(DISTINCT usuario_actividad) as usuarios_involucrados
      FROM actividad.view_cambios_geo 
      WHERE fecha_actividad BETWEEN $1 AND $2
    `;
    
    const params = [fecha_inicio + ' 00:00:00', fecha_fin + ' 23:59:59'];
    console.log(`📊 Estadísticas geográficas: ${fecha_inicio} 00:00:00 hasta ${fecha_fin} 23:59:59, tipo: ${id_tipo_predio || 'todos'}`);
    
    // Agregar filtro por tipo de predio si se proporciona
    if (id_tipo_predio && !isNaN(parseInt(id_tipo_predio))) {
      query += ` AND id_tipo_predio = $${params.length + 1}`;
      params.push(parseInt(id_tipo_predio));
    }
    
    query += `
      GROUP BY accion_actividad
      ORDER BY total_cambios DESC
    `;
    
    const result = await db.query(query, params);
    
    if (!result || !result.rows) {
      return [];
    }
    
    return result.rows;
  } catch (err) {
    console.error('❌ Error al obtener estadísticas de cambios geográficos:', err);
    console.error('❌ Stack:', err.stack);
    console.error('❌ Query:', query);
    console.error('❌ Parámetros:', params);
    return [];
  }
};

module.exports = {
  obtenerCambiosPredios,
  obtenerAccionesDisponibles,
  obtenerEstadisticasCambios,
  obtenerCambiosGeograficos,
  obtenerAccionesGeograficasDisponibles,
  obtenerEstadisticasCambiosGeograficos
};