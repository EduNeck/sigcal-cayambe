// db/models/reporteFicha.js
const db = require('../config');

// Función para obtener los registros de la tabla `listado_predios` con filtros
const obtieneDatosPredio = async (params) => {
  const {
    clave_catastral,
    clave_catastral_anterior,
    numero_documento,
    nombres,
    id_regimen_propiedad,
    tipo_predio
  } = params;

  let query = 'SELECT * FROM reporte_ficha.listado_predios WHERE 1=1';
  const queryParams = [];

  // Solo aplica filtros si tienen contenido
  if (clave_catastral && clave_catastral.trim() !== '') {
    queryParams.push(`%${clave_catastral.trim()}%`);
    query += ` AND clave_catastral ILIKE $${queryParams.length}`;
  }

  if (clave_catastral_anterior && clave_catastral_anterior.trim() !== '') {
    queryParams.push(`%${clave_catastral_anterior.trim()}%`);
    query += ` AND clave_catastral_anterior ILIKE $${queryParams.length}`;
  }

  if (numero_documento && numero_documento.trim() !== '') {
    queryParams.push(numero_documento.trim());
    query += ` AND documento_propietario = $${queryParams.length}`;
  }

  if (nombres && nombres.trim() !== '') {
    // Dividir el texto de búsqueda en palabras individuales y eliminar palabras vacías
    const palabras = nombres.trim().split(/\s+/).filter(palabra => palabra.length > 0);
    
    if (palabras.length > 0) {
      // Iniciar un grupo de condiciones
      query += ' AND (';
      
      // Crear una condición ILIKE para cada palabra
      palabras.forEach((palabra, index) => {
        if (index > 0) {
          query += ' AND '; // Todas las palabras deben estar presentes (operador AND)
        }
        queryParams.push(`%${palabra}%`);
        query += `propietario ILIKE $${queryParams.length}`;
      });
      
      // Cerrar el grupo de condiciones
      query += ')';
    }
  }

  if (id_regimen_propiedad && id_regimen_propiedad.trim() !== '') {
    queryParams.push(id_regimen_propiedad.trim());
    query += ` AND id_regimen_propiedad = $${queryParams.length}`;
  }

  // tipo_predio siempre debe estar presente
  if (tipo_predio) {
    queryParams.push(tipo_predio);
    query += ` AND tipo_predio = $${queryParams.length}`;
  }

  query += ' ORDER BY id_predio ASC;';

  try {
    const result = await db.query(query, queryParams);
    return result.rows;
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
};


// Función para obtener la ficha del predio por su ID
const obtieneFichaPredioPorId = async (id_predio) => {
  const query = `
    SELECT id_predio, clave_catastral, clave_catastral_anterior, tipo_predio, regimen_propiedad, alicuota, 
      area_terreno, area_comun_terreno, unidad, area_individual_construida, area_comun_construida, eje_principal, 
      eje_secundario, sector, porcentaje_cobertura_principal, porcentaje_cobertura_secundaria, tiene_medidor_agua, 
      tiene_medidor_energia, uso, forma, localizacion, cobertura_natural, ecosistema_relevante, disponibilidad_riego, 
      cobertura_principal, cobertura_secundaria, agua, sanitarias, energia, transporte_urbano, eliminacion_basura, 
      telefonia_fija, telefonia_movil, telefonia_satelital, internet, id_actualizador, actualizador, nombre_informador, 
      observaciones, digitador, fecha_registro, num_medidores_agua, num_medidores_energia, documento_propietario, 
      propietario, fecha_fiscalizacion, id_fiscalizador, fiscalizador, fecha_actualizacion, foto, tipo_persona, 
      personeria, topografia, condicion_ocupacion, recolec_aguas_lluvia, nombre_canton, nombre_parroquia
    FROM reporte_ficha.ficha_predio
    WHERE id_predio = $1;
  `;

  try {
    const result = await db.query(query, [id_predio]);
    return result.rows[0];
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
};

// Función para obtener la tenencia del predio por su ID
const obtieneFichaTenenciaPorId = async (id_predio) => {
  try {
    // Verificar primero si existe la tabla/vista
    const checkQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'reporte_ficha' 
        AND table_name = 'ficha_tenencia'
      );
    `;
    
    const checkResult = await db.query(checkQuery);
    
    if (!checkResult.rows[0].exists) {
      console.warn('La tabla/vista reporte_ficha.ficha_tenencia no existe en la base de datos');
      return [];
    }
    
    // Obtener las columnas disponibles en la tabla
    const columnsQuery = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'reporte_ficha' 
      AND table_name = 'ficha_tenencia';
    `;
    
    const columnsResult = await db.query(columnsQuery);
    const columns = columnsResult.rows.map(row => row.column_name).join(', ');
    
    if (!columns) {
      console.warn('No se encontraron columnas en la tabla reporte_ficha.ficha_tenencia');
      return [];
    }
    
    // Construir la consulta dinámica con las columnas disponibles
    const query = `
      SELECT ${columns}
      FROM reporte_ficha.ficha_tenencia
      WHERE id_predio = $1;
    `;

    const result = await db.query(query, [id_predio]);
    return result.rows;
  } catch (err) {
    console.error('Error ejecutando la consulta para obtener tenencia:', err.stack);
    // En vez de lanzar un error, retornamos un arreglo vacío
    return [];
  }
};

// Función para obtener la ficha de bloques por su ID
const obtieneFichaBloquesPorId = async (id_predio) => {
  const query = `
    SELECT id_bloques, id_predio, cod_uni, cod_bloq, cod_piso, tipo_piso, condicion, estado, condicion_patrimonial, ocupacion, anio_construccion, anio_restauracion, area_construida, instalaciones_especiales, estructura, paredes, cubierta, acabados, revestimiento_paredes, revestimiento_cubierta, marco_ventanas, vidrios, puertas, permiso, fecha_registro, digitador, clave, tipo_predio
    FROM reporte_ficha.ficha_bloque
    WHERE id_predio = $1;
  `;

  try {
    const result = await db.query(query, [id_predio]);
    return result.rows;
  } catch (err) {
    console.error('Error ejecutando la consulta para obtener bloques:', err.stack);
    throw err;
  }
};

// Función para obtener la ficha de vías por su ID
const obtieneFichaViasPorId = async (id_predio) => {
  const query = `
    SELECT id_predio, id_vias, via_principal, via_secundaria, nombre_via, longitud, aceras_bordillos, tipo_via, material_via, fecha_registro, digitador, clave
    FROM reporte_ficha.ficha_vias
    WHERE id_predio = $1;
  `;

  try {
    const result = await db.query(query, [id_predio]);
    return result.rows;
  } catch (err) {
    console.error('Error ejecutando la consulta para obtener vias:', err.stack);
    throw err;
  }
};

// Función para obtener la ficha de mejoras por su ID
const obtieneFichaMejorasPorId = async (id_predio) => {
  const query = `
    SELECT id_predio, id_mejoras, tipo, material, area, estado, fecha_registro, digitador, clave
    FROM reporte_ficha.ficha_mejoras
    WHERE id_predio = $1;
  `;

  try {
    const result = await db.query(query, [id_predio]);
    return result.rows;
  } catch (err) {
    console.error('Error ejecutando la consulta para obtener ficha de mejoras:', err.stack);
    throw err;
  }
};

// Método para obtener los datos de la vista patrimonio urbano con filtro por id_predio
const obtienePatrimonioPorId = async(id_predio) => {
  try {
    // Verificar primero si existe la vista
    const checkQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'valores_reportes' 
        AND table_name = 'vista_patrimonio_urbano'
      );
    `;
    
    const checkResult = await db.query(checkQuery);
    
    if (!checkResult.rows[0].exists) {
      console.warn('La tabla/vista valores_reportes.vista_patrimonio_urbano no existe en la base de datos');
      return null;
    }
    
    // Intenta obtener el año máximo, o usa un valor predeterminado (2024) si no hay datos
    const anioMaxQuery = `
      SELECT COALESCE(MAX(anio_proceso), 2024) as max_anio
      FROM valores_reportes.vista_patrimonio_urbano;
    `;
    
    const anioMaxResult = await db.query(anioMaxQuery);
    const anioMax = anioMaxResult.rows[0]?.max_anio || 2024;
    
    const query = `
      SELECT
          tipo_predio,
          ph,
          clave_catastral,
          clave_anterior,
          parroquia,
          numero_documento,
          ROUND(COALESCE(alicuota, 0), 2) AS alicuota,
          ROUND(COALESCE(porcentaje_participacion, 0), 2) AS porcentaje_participacion,
          ROUND(COALESCE(area_suelo_porcentual, 0), 2) AS area_suelo_porcentual,
          ROUND(COALESCE(area_construcciones_porcentual, 0), 2) AS area_construcciones_porcentual,
          ROUND(COALESCE(valor_suelo_porcentual, 0), 2) AS valor_suelo_porcentual,
          ROUND(COALESCE(valor_construcciones_porcentual, 0), 2) AS valor_construcciones_porcentual,
          ROUND(COALESCE(valor_instalaciones_porcentual, 0), 2) AS valor_instalaciones_porcentual,
          ROUND(COALESCE(valor_adicionales_porcentual, 0), 2) AS valor_adicionales_porcentual,
          ROUND(COALESCE(avaluo_predio_porcentual, 0), 2) AS avaluo_predio_porcentual,
          anio_proceso,
          id_tenencia_propiedad,
          id_predio,
          propietario,
          fecha_proceso
      FROM valores_reportes.vista_patrimonio_urbano
      WHERE anio_proceso = ${anioMax} AND id_predio = $1;
    `;

    const result = await db.query(query, [id_predio]);
    return result.rows[0] || {
      // Valores predeterminados si no se encuentra el registro
      tipo_predio: null,
      ph: null,
      clave_catastral: null,
      clave_anterior: null,
      parroquia: null,
      numero_documento: null,
      alicuota: 0,
      porcentaje_participacion: 0,
      area_suelo_porcentual: 0,
      area_construcciones_porcentual: 0,
      valor_suelo_porcentual: 0,
      valor_construcciones_porcentual: 0,
      valor_instalaciones_porcentual: 0,
      valor_adicionales_porcentual: 0,
      avaluo_predio_porcentual: 0,
      anio_proceso: anioMax,
      id_tenencia_propiedad: null,
      id_predio: id_predio,
      propietario: null,
      fecha_proceso: null
    };
  } catch (err) {
    console.error('Error al ejecutar consulta de patrimonio urbano:', err.stack);
    // En vez de lanzar error, retornamos un objeto con valores predeterminados
    return {
      area_suelo_porcentual: 0,
      area_construcciones_porcentual: 0,
      valor_suelo_porcentual: 0,
      valor_construcciones_porcentual: 0,
      valor_instalaciones_porcentual: 0,
      valor_adicionales_porcentual: 0,
      avaluo_predio_porcentual: 0,
      id_predio: id_predio
    };
  }
}

// Función para obtener los datos del visor del predio por su ID
const obtieneDatosVisorPredio = async (id_predio) => {
  const query = `
    SELECT
      p.id_predio,
      p.clave_catastral,
      p.clave_catastral_anterior,
      p.tipo_predio,
      p.regimen_propiedad,
      p.alicuota,
      p.sector,
      p.eje_principal,
      p.eje_secundario,
      p.uso,
      p.agua,
      p.sanitarias,
      p.energia,
      p.foto,
      CASE 
        WHEN v.anio_val > 0 THEN v.anio_val
        ELSE 0 
      END AS anio_valoracion,
      ROUND(v.area_grafica, 2) AS area_grafica,
      ROUND(v.valor_suelo, 2) AS valor_suelo,
      ROUND(v.area_construida, 2) AS area_construida,
      ROUND(v.valor_construcciones, 2) AS valor_construcciones,
      ROUND(v.valor_adicionales, 2) AS valor_adicionales,
      ROUND(v.valor_predio, 2) AS valor_predio
    FROM
      reporte_ficha.ficha_predio p
    LEFT JOIN valoracion.val_total v ON p.id_predio = v.id_predio
    WHERE 
      p.id_predio = $1;
  `;

  try {
    const result = await db.query(query, [id_predio]);
    return result.rows[0];
  } catch (err) {
    console.error('Error ejecutando la consulta para obtener datos del visor del predio:', err.stack);
    throw err;
  }
};

module.exports = {
  obtieneDatosPredio,
  obtieneFichaPredioPorId,
  obtieneFichaTenenciaPorId,
  obtieneFichaBloquesPorId,
  obtieneFichaViasPorId,
  obtieneFichaMejorasPorId,
  obtienePatrimonioPorId,  
  obtieneDatosVisorPredio,
};