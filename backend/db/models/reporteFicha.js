// db/models/reporteFicha.js
const db = require('../config');

// Función para obtener los registros de la tabla `listado_predios` con filtros
const obtieneDatosPredio = async (params) => {
  const { clave_catastral, clave_catastral_anterior, numero_documento, nombres, id_regimen_propiedad, tipo_predio } = params;

  let query = 'SELECT * FROM reporte_ficha.listado_predios WHERE 1=1';
  const queryParams = [];

  if (clave_catastral) {
    queryParams.push(`%${clave_catastral}%`);
    query += ` AND clave_catastral ILIKE $${queryParams.length}`;
  }
  if (clave_catastral_anterior) {
    queryParams.push(`%${clave_catastral_anterior}%`);
    query += ` AND clave_catastral_anterior ILIKE $${queryParams.length}`;
  }
  if (numero_documento) {
    queryParams.push(numero_documento);
    query += ` AND numero_documento = $${queryParams.length}`;
  }
  if (nombres) {
    queryParams.push(`%${nombres}%`);
    query += ` AND nombres ILIKE $${queryParams.length}`;
  }
  if (id_regimen_propiedad) {
    queryParams.push(id_regimen_propiedad);
    query += ` AND id_regimen_propiedad = $${queryParams.length}`;
  }
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
  const query = `
    SELECT id_predio, id_tenencia, presenta_escritura, asentamiento_de_hecho, conflicto, forma_propiedad, fallecida, numero_documento, nombres, telefono, email, id_conyuge, conyuge, tipo_persona, personeria, tipo_docuemnto, estado_civil, porcentaje_participacion, numero_notaria, fecha_inscripcion, area_registro, unidad, provincia, canton, fecha_escritura, requiere_perfeccionamiento, anios_posesion, numero_registro, fecha_registro, digitador, id_prop_anterior, propietario_anterior, folio, repertorio, provincia_protocolizacion, canton_protocolizacion, clave, validado, obs_registro, parroquia, clave_anterior, lindero_norte, lindero_sur, lindero_este, lindero_oeste, sector, tipo_predio, tipo_predio_desc, regimen_propiedad
    FROM reporte_ficha.ficha_tenencia
    WHERE id_predio = $1;
  `;

  try {
    const result = await db.query(query, [id_predio]);
    return result.rows;
  } catch (err) {
    console.error('Error ejecutando la consulta para obtener tenencia:', err.stack);
    throw err;
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
const obtienePatrimonioPorId = async(id_predio) =>{
  const query = `
    SELECT
        tipo_predio,
        ph,
        clave_catastral,
        clave_anterior,
        parroquia,
        numero_documento,
        ROUND(alicuota, 2) AS alicuota,
        ROUND(porcentaje_participacion, 2) AS porcentaje_participacion,
        ROUND(area_suelo_porcentual, 2) AS area_suelo_porcentual,
        ROUND(area_construcciones_porcentual, 2) AS area_construcciones_porcentual,
        ROUND(valor_suelo_porcentual, 2) AS valor_suelo_porcentual,
        ROUND(valor_construcciones_porcentual, 2) AS valor_construcciones_porcentual,
        ROUND(valor_instalaciones_porcentual, 2) AS valor_instalaciones_porcentual,
        ROUND(valor_adicionales_porcentual, 2) AS valor_adicionales_porcentual,
        ROUND(avaluo_predio_porcentual, 2) AS avaluo_predio_porcentual,
        anio_proceso,
        id_tenencia_propiedad,
        id_predio,
        propietario,
        fecha_proceso
    FROM valores_reportes.vista_patrimonio_urbano
    WHERE anio_proceso = (
      SELECT MAX(anio_proceso)
      FROM valores_reportes.vista_patrimonio_urbano
    ) AND id_predio = $1;
  `;

  try {
    const result = await db.query(query, [id_predio]);
    return result.rows[0];
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
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