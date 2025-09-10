/**
 * Controlador para la gestión de Informes de Compatibilidad de Uso de Suelo (ICUS)
 */
const { execQuery, execQueryOne } = require('../db/config');

/**
 * Crear un nuevo ICUS
 */
const crearIcus = async (req, res) => {
  try {
    console.log('📝 Controller: Creando nuevo ICUS');
    console.log('📄 Datos recibidos:', req.body);

    // Obtener los datos del cuerpo de la petición
    const {
      // Campos originales
      clave_catastral,
      propietario,
      fecha,
      id_suelo,
      uso_suelo,
      id_actividad,
      actividad,
      id_tipologia,
      tipologia,
      compatibilidad,
      tipo_compatibilidad,
      usuario,
      estado = 'ACTIVO',
      
      // Campos adicionales
      numero_documento,
      clave_anterior,
      derechos_acciones,
      ph,
      area_construccion,
      area_escritura,
      area_gis,
      frente,
      id_par,
      nombre_parroquia,
      sector,
      resultado_informe,
      id_uso_suelo,
      notas,
      id_predio,
      geometria
    } = req.body;

    // Validar campos requeridos
    if (!clave_catastral || !propietario || !fecha) {
      console.log('❌ Error: Campos requeridos básicos no proporcionados');
      return res.status(400).json({
        success: false,
        message: 'Campos clave_catastral, propietario y fecha son obligatorios para crear un ICUS'
      });
    }

    // Validar el formato de la fecha
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha)) {
      console.log('❌ Error: Formato de fecha inválido');
      return res.status(400).json({
        success: false,
        message: 'El formato de fecha debe ser YYYY-MM-DD'
      });
    }

    // Consulta SQL para insertar un nuevo ICUS
    const query = `
      INSERT INTO icus (
        clave_catastral, propietario, fecha, id_suelo, uso_suelo,
        id_actividad, actividad, id_tipologia, tipologia,
        compatibilidad, tipo_compatibilidad, usuario, estado,
        
        numero_documento, clave_anterior, derechos_acciones, ph,
        area_construccion, area_escritura, area_gis, frente,
        id_par, nombre_parroquia, sector, resultado_informe,
        id_uso_suelo, notas, id_predio, geometria
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28
      )
      RETURNING id
    `;

    const params = [
      clave_catastral,
      propietario,
      fecha,
      id_suelo || '',
      uso_suelo || '',
      id_actividad || '',
      actividad || '',
      id_tipologia || '',
      tipologia || '',
      compatibilidad || '',
      tipo_compatibilidad,
      usuario || 'sistema',
      estado,
      
      numero_documento || null,
      clave_anterior || null,
      derechos_acciones || null,
      ph || null,
      area_construccion || null,
      area_escritura || null,
      area_gis || null,
      frente || null,
      id_par || null,
      nombre_parroquia || null,
      sector || null,
      resultado_informe || null,
      id_uso_suelo || null,
      notas || null,
      id_predio || null,
      geometria || null
    ];

    // Ejecutar la consulta
    const result = await execQuery(query, params);

    // En PostgreSQL, RETURNING devuelve los datos insertados
    const insertId = result[0]?.id;
    
    console.log('✅ ICUS creado correctamente, ID:', insertId);

    // Consulta para obtener el ICUS recién creado
    const icusCreado = await execQueryOne(`SELECT * FROM icus WHERE id = $1`, [insertId]);

    // Responder con éxito usando el formato esperado por el frontend
    res.status(201).json({
      success: true,
      message: 'ICUS creado correctamente',
      data: icusCreado
    });

  } catch (error) {
    console.error('❌ Error al crear ICUS:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear ICUS',
      error: error.message
    });
  }
};

/**
 * Obtener un ICUS por su ID
 */
const obtenerIcusPorId = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🔍 Controller: Buscando ICUS con ID: ${id}`);

    // Validar ID
    if (!id || isNaN(parseInt(id))) {
      console.log('❌ Error: ID inválido');
      return res.status(400).json({
        success: false,
        message: 'ID de ICUS inválido'
      });
    }

    // Consulta SQL
    const query = 'SELECT * FROM icus WHERE id = $1';
    const icus = await execQueryOne(query, [id]);

    // Verificar si se encontró el ICUS
    if (!icus) {
      console.log(`❌ No se encontró ICUS con ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: `No se encontró ICUS con ID: ${id}`
      });
    }

    console.log('✅ ICUS encontrado');

    // Responder con éxito
    res.json({
      success: true,
      data: icus
    });

  } catch (error) {
    console.error('❌ Error al obtener ICUS por ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ICUS por ID',
      error: error.message
    });
  }
};

/**
 * Obtener todos los ICUS con paginación y búsqueda
 */
const obtenerIcus = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    console.log('🔍 Controller: Listando ICUS con parámetros:', { page, limit, search });

    // Calcular el offset para la paginación
    const offset = (page - 1) * limit;
    
    // Construir la condición de búsqueda si es necesario
    let whereCondition = '';
    let params = [];

    if (search) {
      whereCondition = `
        WHERE clave_catastral LIKE ? 
        OR propietario LIKE ? 
        OR uso_suelo LIKE ? 
        OR actividad LIKE ?
      `;
      const searchParam = `%${search}%`;
      params = [searchParam, searchParam, searchParam, searchParam];
    }

    // Consulta para obtener los ICUS
    const query = `
      SELECT * 
      FROM icus 
      ${whereCondition}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `;

    // Añadir parámetros de paginación
    params.push(parseInt(limit), parseInt(offset));

    // Consulta para contar el total de registros
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM icus 
      ${whereCondition}
    `;

    // Ejecutar ambas consultas
    const [icus, countResult] = await Promise.all([
      execQuery(query, params),
      execQueryOne(countQuery, search ? params.slice(0, 4) : [])
    ]);

    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    console.log(`✅ Se encontraron ${icus.length} ICUS de un total de ${total}`);

    // Responder con éxito
    res.json({
      success: true,
      data: icus,
      pagination: {
        total,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener lista de ICUS:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener lista de ICUS',
      error: error.message
    });
  }
};

/**
 * Actualizar un ICUS existente
 */
const actualizarIcus = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🔄 Controller: Actualizando ICUS con ID: ${id}`);
    console.log('📄 Datos de actualización:', req.body);

    // Validar ID
    if (!id || isNaN(parseInt(id))) {
      console.log('❌ Error: ID inválido');
      return res.status(400).json({
        success: false,
        message: 'ID de ICUS inválido'
      });
    }

    // Verificar si el ICUS existe
    const checkQuery = 'SELECT id FROM icus WHERE id = $1';
    const icusExistente = await execQueryOne(checkQuery, [id]);

    if (!icusExistente) {
      console.log(`❌ No se encontró ICUS con ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: `No se encontró ICUS con ID: ${id}`
      });
    }

    // Obtener los campos a actualizar
    const {
      // Campos originales
      clave_catastral,
      propietario,
      fecha,
      id_suelo,
      uso_suelo,
      id_actividad,
      actividad,
      id_tipologia,
      tipologia,
      compatibilidad,
      tipo_compatibilidad,
      usuario,
      estado,
      
      // Campos adicionales
      numero_documento,
      clave_anterior,
      derechos_acciones,
      ph,
      area_construccion,
      area_escritura,
      area_gis,
      frente,
      id_par,
      nombre_parroquia,
      sector,
      resultado_informe,
      id_uso_suelo,
      notas,
      id_predio,
      geometria
    } = req.body;

    // Construir la consulta dinámica para actualizar solo los campos proporcionados
    let updateFields = [];
    let params = [];

    // Añadir solo los campos proporcionados
    // Campos originales
    if (clave_catastral !== undefined) { updateFields.push('clave_catastral = $' + (params.length + 1)); params.push(clave_catastral); }
    if (propietario !== undefined) { updateFields.push('propietario = $' + (params.length + 1)); params.push(propietario); }
    if (fecha !== undefined) { updateFields.push('fecha = $' + (params.length + 1)); params.push(fecha); }
    if (id_suelo !== undefined) { updateFields.push('id_suelo = $' + (params.length + 1)); params.push(id_suelo); }
    if (uso_suelo !== undefined) { updateFields.push('uso_suelo = $' + (params.length + 1)); params.push(uso_suelo); }
    if (id_actividad !== undefined) { updateFields.push('id_actividad = $' + (params.length + 1)); params.push(id_actividad); }
    if (actividad !== undefined) { updateFields.push('actividad = $' + (params.length + 1)); params.push(actividad); }
    if (id_tipologia !== undefined) { updateFields.push('id_tipologia = $' + (params.length + 1)); params.push(id_tipologia); }
    if (tipologia !== undefined) { updateFields.push('tipologia = $' + (params.length + 1)); params.push(tipologia); }
    if (compatibilidad !== undefined) { updateFields.push('compatibilidad = $' + (params.length + 1)); params.push(compatibilidad); }
    if (tipo_compatibilidad !== undefined) { updateFields.push('tipo_compatibilidad = $' + (params.length + 1)); params.push(tipo_compatibilidad); }
    if (usuario !== undefined) { updateFields.push('usuario = $' + (params.length + 1)); params.push(usuario); }
    if (estado !== undefined) { updateFields.push('estado = $' + (params.length + 1)); params.push(estado); }
    
    // Campos adicionales
    if (numero_documento !== undefined) { updateFields.push('numero_documento = $' + (params.length + 1)); params.push(numero_documento); }
    if (clave_anterior !== undefined) { updateFields.push('clave_anterior = $' + (params.length + 1)); params.push(clave_anterior); }
    if (derechos_acciones !== undefined) { updateFields.push('derechos_acciones = $' + (params.length + 1)); params.push(derechos_acciones); }
    if (ph !== undefined) { updateFields.push('ph = $' + (params.length + 1)); params.push(ph); }
    if (area_construccion !== undefined) { updateFields.push('area_construccion = $' + (params.length + 1)); params.push(area_construccion); }
    if (area_escritura !== undefined) { updateFields.push('area_escritura = $' + (params.length + 1)); params.push(area_escritura); }
    if (area_gis !== undefined) { updateFields.push('area_gis = $' + (params.length + 1)); params.push(area_gis); }
    if (frente !== undefined) { updateFields.push('frente = $' + (params.length + 1)); params.push(frente); }
    if (id_par !== undefined) { updateFields.push('id_par = $' + (params.length + 1)); params.push(id_par); }
    if (nombre_parroquia !== undefined) { updateFields.push('nombre_parroquia = $' + (params.length + 1)); params.push(nombre_parroquia); }
    if (sector !== undefined) { updateFields.push('sector = $' + (params.length + 1)); params.push(sector); }
    if (resultado_informe !== undefined) { updateFields.push('resultado_informe = $' + (params.length + 1)); params.push(resultado_informe); }
    if (id_uso_suelo !== undefined) { updateFields.push('id_uso_suelo = $' + (params.length + 1)); params.push(id_uso_suelo); }
    if (notas !== undefined) { updateFields.push('notas = $' + (params.length + 1)); params.push(notas); }
    if (id_predio !== undefined) { updateFields.push('id_predio = $' + (params.length + 1)); params.push(id_predio); }
    if (geometria !== undefined) { updateFields.push('geometria = $' + (params.length + 1)); params.push(geometria); }

    // Verificar si hay campos para actualizar
    if (updateFields.length === 0) {
      console.log('⚠️ No hay campos para actualizar');
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron campos para actualizar'
      });
    }

    // Añadir fecha de actualización
    updateFields.push('updated_at = NOW()');

    // Consulta SQL
    const query = `
      UPDATE icus 
      SET ${updateFields.join(', ')}
      WHERE id = $${params.length + 1}
    `;

    // Añadir el ID a los parámetros
    params.push(id);

    // Ejecutar la consulta
    await execQuery(query, params);

    console.log(`✅ ICUS con ID ${id} actualizado correctamente`);

    // Obtener el ICUS actualizado
    const icusActualizado = await execQueryOne('SELECT * FROM icus WHERE id = $1', [id]);

    // Responder con éxito
    res.json({
      success: true,
      message: `ICUS con ID ${id} actualizado correctamente`,
      data: icusActualizado
    });

  } catch (error) {
    console.error('❌ Error al actualizar ICUS:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar ICUS',
      error: error.message
    });
  }
};

/**
 * Eliminar un ICUS
 */
const eliminarIcus = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🗑️ Controller: Eliminando ICUS con ID: ${id}`);

    // Validar ID
    if (!id || isNaN(parseInt(id))) {
      console.log('❌ Error: ID inválido');
      return res.status(400).json({
        success: false,
        message: 'ID de ICUS inválido'
      });
    }

    // Verificar si el ICUS existe
    const checkQuery = 'SELECT id FROM icus WHERE id = $1';
    const icusExistente = await execQueryOne(checkQuery, [id]);

    if (!icusExistente) {
      console.log(`❌ No se encontró ICUS con ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: `No se encontró ICUS con ID: ${id}`
      });
    }

    // Consulta SQL para eliminar el ICUS
    const query = 'DELETE FROM icus WHERE id = $1';
    await execQuery(query, [id]);

    console.log(`✅ ICUS con ID ${id} eliminado correctamente`);

    // Responder con éxito
    res.json({
      success: true,
      message: `ICUS con ID ${id} eliminado correctamente`,
      data: { id }
    });

  } catch (error) {
    console.error('❌ Error al eliminar ICUS:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar ICUS',
      error: error.message
    });
  }
};

/**
 * Buscar ICUS por diversos criterios
 */
const buscarIcus = async (req, res) => {
  try {
    console.log('🔍 Controller: Buscando ICUS por criterios');
    console.log('📄 Criterios de búsqueda:', req.query);

    // Extraer parámetros de búsqueda
    const { 
      clave_catastral, 
      propietario, 
      fecha_inicio, 
      fecha_fin,
      id_suelo,
      id_actividad,
      id_tipologia,
      compatibilidad,
      // Parámetros adicionales
      numero_documento,
      clave_anterior,
      sector,
      id_par,
      nombre_parroquia,
      id_uso_suelo,
      id_predio
    } = req.query;

    // Construir consulta dinámica
    let whereConditions = [];
    let params = [];

    // Añadir condiciones según los parámetros proporcionados
    if (clave_catastral) {
      whereConditions.push(`clave_catastral LIKE $${params.length + 1}`);
      params.push(`%${clave_catastral}%`);
    }
    
    if (propietario) {
      whereConditions.push(`propietario LIKE $${params.length + 1}`);
      params.push(`%${propietario}%`);
    }
    
    if (fecha_inicio && fecha_fin) {
      whereConditions.push(`fecha BETWEEN $${params.length + 1} AND $${params.length + 2}`);
      params.push(fecha_inicio, fecha_fin);
    } else if (fecha_inicio) {
      whereConditions.push(`fecha >= $${params.length + 1}`);
      params.push(fecha_inicio);
    } else if (fecha_fin) {
      whereConditions.push(`fecha <= $${params.length + 1}`);
      params.push(fecha_fin);
    }
    
    if (id_suelo) {
      whereConditions.push(`id_suelo = $${params.length + 1}`);
      params.push(id_suelo);
    }
    
    if (id_actividad) {
      whereConditions.push(`id_actividad = $${params.length + 1}`);
      params.push(id_actividad);
    }
    
    if (id_tipologia) {
      whereConditions.push(`id_tipologia = $${params.length + 1}`);
      params.push(id_tipologia);
    }
    
    if (compatibilidad) {
      whereConditions.push(`compatibilidad LIKE $${params.length + 1}`);
      params.push(`%${compatibilidad}%`);
    }
    
    // Condiciones adicionales para los nuevos campos
    if (numero_documento) {
      whereConditions.push(`numero_documento LIKE $${params.length + 1}`);
      params.push(`%${numero_documento}%`);
    }
    
    if (clave_anterior) {
      whereConditions.push(`clave_anterior LIKE $${params.length + 1}`);
      params.push(`%${clave_anterior}%`);
    }
    
    if (sector) {
      whereConditions.push(`sector LIKE $${params.length + 1}`);
      params.push(`%${sector}%`);
    }
    
    if (id_par) {
      whereConditions.push(`id_par = $${params.length + 1}`);
      params.push(id_par);
    }
    
    if (nombre_parroquia) {
      whereConditions.push(`nombre_parroquia LIKE $${params.length + 1}`);
      params.push(`%${nombre_parroquia}%`);
    }
    
    if (id_uso_suelo) {
      whereConditions.push(`id_uso_suelo = $${params.length + 1}`);
      params.push(id_uso_suelo);
    }
    
    if (id_predio) {
      whereConditions.push(`id_predio = $${params.length + 1}`);
      params.push(id_predio);
    }
    
    // Añadir condición por defecto para obtener solo ICUS activos
    whereConditions.push("(estado = 'ACTIVO' OR estado IS NULL)");
    
    // Construir la cláusula WHERE completa
    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';
    
    // Consulta SQL
    const query = `
      SELECT * 
      FROM icus 
      ${whereClause}
      ORDER BY id DESC
    `;
    
    console.log('Consulta SQL:', query);
    console.log('Parámetros:', params);
    
    // Ejecutar la consulta
    const resultados = await execQuery(query, params);
    
    console.log(`✅ Se encontraron ${resultados.length} ICUS`);
    
    // Responder con éxito
    res.json({
      success: true,
      data: resultados
    });
    
  } catch (error) {
    console.error('❌ Error al buscar ICUS por criterios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar ICUS por criterios',
      error: error.message
    });
  }
};

module.exports = {
  crearIcus,
  obtenerIcusPorId,
  obtenerIcus,
  actualizarIcus,
  eliminarIcus,
  buscarIcus
};
