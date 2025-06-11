// db/models/catastroPredio.js
const db = require('../config');

// Función para insertar un registro en la tabla `Catastro Predio`
const insertaIdentificacionPredio = async (data) => {
  const query = `
    INSERT INTO public.catastro_predio (id_tipo_predio, id_regimen_propiedad, clave_catastral_anterior, 
      clave_catastral, id_prov, id_can, id_par, cod_zon, cod_sec, cod_pol_man, cod_pred, cod_uni, cod_bloq, 
      id_tipo_piso, cod_piso, alicuota, area_terreno, area_comun_terreno, id_unidad_area, 
      area_individual_construida, area_comun_construida, eje_principal, eje_secundario, sector, digitador, 
      fecha_registro, direccion_principal
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 
      $20, $21, $22, $23, $24, $25, $26, $27
    )
    RETURNING id_predio;
  `;
  const values = [
    data.id_tipo_predio, data.id_regimen_propiedad, data.clave_catastral_anterior, data.clave_catastral,
    data.id_prov, data.id_can, data.id_par, data.cod_zon, data.cod_sec, data.cod_pol_man, 
    data.cod_pred, data.cod_uni, data.cod_bloq, data.id_tipo_piso, data.cod_piso, data.alicuota, 
    data.area_terreno, data.area_comun_terreno, data.id_unidad_area, data.area_individual_construida,
    data.area_comun_construida, data.eje_principal, data.eje_secundario, data.sector, data.digitador,
    data.fecha_registro, data.direccion_principal
  ];

  // Validar que los valores no sean vacíos para los campos que esperan enteros
  const integerFields = [
    'id_tipo_predio', 'id_regimen_propiedad', 'id_prov', 'id_can', 'id_par', 'cod_zon', 'cod_sec', 
    'cod_pol_man', 'cod_pred', 'cod_uni', 'cod_bloq', 'id_tipo_piso', 'cod_piso', 'id_unidad_area'
  ];

  for (const field of integerFields) {
    if (data[field] === undefined) {
      console.error(`Error: El campo ${field} no puede ser vacío, nulo o indefinido.`);
      throw new Error(`El campo ${field} no puede ser vacío, nulo o indefinido.`);
    }
  }

  try {
    console.log('Valores a insertar:', values);
    const result = await db.query(query, values);
    return result.rows[0].id_predio; // Devolver el id_predio directamente
  } catch (err) {
    let errorMessage = 'Error ejecutando la consulta';
    if (err.code) {
      switch (err.code) {
        case '23505': // unique_violation
          errorMessage = 'Error: Valor duplicado viola la restricción de unicidad';
          break;
        case '23503': // foreign_key_violation
          errorMessage = 'Error: Violación de clave foránea';
          break;
        case '23502': // not_null_violation
          errorMessage = `Error: Valor nulo en la columna ${err.column} viola la restricción not-null`;
          break;
        case '22P02': // invalid_text_representation
          errorMessage = 'Error: Sintaxis de entrada no válida para entero';
          break;
        default:
          errorMessage = `Error de base de datos: ${err.message}`;
      }
    } else {
      errorMessage = `Error ejecutando la consulta: ${err.stack}`;
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Función para actualizar un registro en la tabla `Catastro Predio`
const updateCatastroPredio = async (id, data) => {
    const query = `
      UPDATE public.catastro_predio
      SET id_tipo_predio = $1, id_regimen_propiedad = $2, clave_catastral_anterior = $3, clave_catastral = $4,
          id_prov = $5, id_can = $6, id_par = $7, cod_zon = $8, cod_sec = $9,
          cod_pol_man = $10, cod_pred = $11, cod_uni = $12, cod_bloq = $13, id_tipo_piso = $14, cod_piso = $15,
          alicuota = $16, area_terreno = $17, area_comun_terreno = $18, id_unidad_area = $19, area_individual_construida = $20,
          area_comun_construida = $21, eje_principal = $22, eje_secundario = $23, sector = $24, fecha_actualizacion = $25, actualizador = $26, direccion_principal = $27
      WHERE id_predio = $28
      RETURNING *;
    `;
    const values = [
      data.id_tipo_predio, data.id_regimen_propiedad, data.clave_catastral_anterior, data.clave_catastral,
      data.id_prov, data.id_can, data.id_par, data.cod_zon, data.cod_sec, data.cod_pol_man, 
      data.cod_pred, data.cod_uni, data.cod_bloq, data.id_tipo_piso, data.cod_piso, data.alicuota,
      data.area_terreno, data.area_comun_terreno, data.id_unidad_area, data.area_individual_construida,
      data.area_comun_construida, data.eje_principal, data.eje_secundario, data.sector, data.fecha_actualizacion, 
      data.actualizador, data.direccion_principal, id
    ];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para obtener un registro de la tabla `catastro_predio` basado en su ID
const getCatastroPredioById = async (id) => {
    const query = `
      SELECT * FROM public.catastro_predio WHERE id_predio = $1`;
    try {
        const result = await db.query(query, [id]);
        return result.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para obtener un registro de la tabla `catastro_predio` basado en el tipo de predio 
const getCatastroPredioByTipo = async (tipo) => {
  const query = `
    SELECT * FROM public.catastro_predio WHERE id_tipo_predio = $1`;
  try {
      const result = await db.query(query, [tipo]);
      return result.rows;
  } catch (err) {
      console.error('Error executing query', err.stack);
      throw err;
  }
};

// Función para actualizar un registro en la tabla `Caracteristicas Predio`
const updateCaracteristicasPredio = async (id, data) => {
  const query = `
    UPDATE public.catastro_predio SET
      id_uso_predio = $1, lote_conflicto = $2, obs_conflicto = $3, 
      id_forma_lote = $4, id_topografia = $5, id_localizacion_manzana = $6, permiso_construccion = $7, 
      num_permiso_construccion = $8, id_agua = $9, id_sanitarias = $10, id_energia_electrica = $11, 
      aceras = $12, bordillos = $13, alumbrado = $14, aseo_calles = $15, recoleccion_basura = $16, 
      id_eliminacion_basura = $17, transporte_urbano = $18, telefonia_fija = $19, telefonia_satelital = $20, 
      internet = $21, fecha_actualizacion = $22, actualizador = $23
    WHERE id_predio = $24
    RETURNING id_predio;
  `;
  const values = [
    data.id_uso_predio, data.lote_conflicto, data.obs_conflicto, data.id_forma_lote, data.id_topografia, 
    data.id_localizacion_manzana, data.permiso_construccion, data.num_permiso_construccion, data.id_agua, 
    data.id_sanitarias, data.id_energia_electrica, data.aceras, data.bordillos, data.alumbrado, data.aseo_calles, 
    data.recoleccion_basura, data.id_eliminacion_basura, data.transporte_urbano, data.telefonia_fija, 
    data.telefonia_satelital, data.internet, data.fecha_actualizacion, data.actualizador ,id
  ];

  // Validar que los valores no sean vacíos para los campos que esperan enteros
  const integerFields = [
    'id_uso_predio', 'id_forma_lote', 'id_topografia', 'id_localizacion_manzana', 'id_agua', 
    'id_sanitarias', 'id_energia_electrica', 'id_eliminacion_basura'
  ];

  for (const field of integerFields) {
    if (data[field] === undefined) {
      console.error(`Error: El campo ${field} no puede ser vacío, nulo o indefinido.`);
      return;
    }
  }

  try {
    const res = await db.query(query, values);
    return res.rows[0].id_predio;
  } catch (err) {
    console.error('Error al actualizar en caracteristicas_predio:', err);
    throw err;
  }
};

// Función para actualizar las observaciones en la tabla `Catastro Predio`
const updateObservaciones = async (id, data) => {
  const query = `
    UPDATE catastro_predio
    SET observaciones = $1,
        fecha_actualizacion = $2,
        actualizador = $3,
        nombre_informador = $4,
        digitador = $5,
        fecha_registro = $6,
        descripcion_lote = $7
    WHERE id_predio = $8
    RETURNING *;
  `;

  const values = [
    data.observaciones,
    new Date(data.fecha_actualizacion), // Ensure the date is passed as a valid timestamp
    data.actualizador,
    data.nombre_informador,
    data.digitador,
    new Date(data.fecha_registro), // Ensure the date is passed as a valid timestamp
    data.descripcion_lote,
    id
  ];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error updating observaciones:', err);
    throw err;
  }
};

// Función para eliminar un registro de la tabla de Fotos de Predio por id
const deleteCatastroPredio = async (id) => {
    const query = `
        DELETE FROM public.catastro_predio WHERE id_predio = $1 RETURNING *;
    `;
    const values = [id];

    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            console.warn(`⚠ No se encontró ningun predio con id: ${id}`);
            return null;
        }
        console.log(`✅ Predio con id: ${id} eliminada con éxito`);
        return result.rows[0];
    } catch (err) {
        console.error(`❌ Error al eliminar el predio con id: ${id}`, err.message);
        throw new Error('Error al eliminar el predio en la base de datos');
    }
};

// Función para recuperar el id_predio basado en la clave catastral
const recuperaIdPredioByClave = async (claveCatastral) => {
  const query = `
    SELECT id_predio
    FROM public.catastro_predio
    WHERE clave_catastral = $1;
  `;
  try {
    const result = await db.query(query, [claveCatastral]);
    return result.rows[0]?.id_predio || null; // Devuelve el id_predio o null si no se encuentra
  } catch (err) {
    console.error('Error ejecutando la consulta para recuperar id_predio por clave catastral:', err.stack);
    throw err;
  }
};

// Método para recuperar todas las claves catastrales
const recuperaClaves = async () => {
  const query = `
    SELECT clave_catastral, id_predio
    FROM public.catastro_predio ORDER BY clave_catastral asc;
  `;
  try {
    const result = await db.query(query);
    return result.rows; // Devuelve todas las claves catastrales
  } catch (err) {
    console.error('Error ejecutando la consulta para recuperar claves catastrales:', err.stack);
    throw err;
  }
};

// Función para actualizar las características rurales en la tabla `Catastro Predio`
const updateCaracteristicasRurales = async (id_predio, data) => {
  const query = `
    UPDATE public.catastro_predio SET
      agricultura_tecnificada = $1, agricultura_tradicional = $2, agricultura_subsistencia = $3, 
      agricultura_huerto_familiar = $4, pecuarios_bovino = $5, pecuarios_caprino = $6, pecuarios_porcino = $7,
      pecuarios_avicola = $8, pecuarios_otro = $9,pecuarios_intensivo = $10, pecuarios_extensivo = $11, 
      pecuarios_subsistencia = $12, forestal_madera = $13, forestal_pulpa = $14, forestal_lenya_carbon = $15,
      camaronera = $16, conservacion_reserva_natural = $17, conservacion_proteccion = $18, conservacion_otros = $19,
      comercio = $20, turismo = $21, industria = $22, mineria = $23, hidrocarburos = $24, social_educacion = $25, 
      social_salud = $26, social_culto = $27, social_cementerio = $28, social_recreacion = $29,social_espacio_publico = $30,social_casa_comunal = $31, infraestructura_especial = $32, infraestructura_otros = $33, id_ecosistema_relevante = $34,id_cobertura_principal = $35, rural_sin_aprovechamiento = $36, rural_no_utilizable = $37
    WHERE id_predio = $38
    RETURNING id_predio;
  `;

  const values = [
    data.agricultura_tecnificada, data.agricultura_tradicional, data.agricultura_subsistencia, data.agricultura_huerto_familiar,
    data.pecuarios_bovino, data.pecuarios_caprino, data.pecuarios_porcino, data.pecuarios_avicola, data.pecuarios_otro,
    data.pecuarios_intensivo, data.pecuarios_extensivo, data.pecuarios_subsistencia,
    data.forestal_madera, data.forestal_pulpa, data.forestal_lenya_carbon,
    data.camaronera,
    data.conservacion_reserva_natural, data.conservacion_proteccion, data.conservacion_otros,
    data.comercio, data.turismo, data.industria, data.mineria, data.hidrocarburos,
    data.social_educacion, data.social_salud, data.social_culto, data.social_cementerio, data.social_recreacion,
    data.social_espacio_publico, data.social_casa_comunal,
    data.infraestructura_especial, data.infraestructura_otros,
    data.id_ecosistema_relevante, data.id_cobertura_principal,
    data.rural_sin_aprovechamiento, data.rural_no_utilizable,
    id_predio
  ];

  try {
    const result = await db.query(query, values);
    return result.rows[0].id_predio;
  } catch (err) {
    console.error('Error al actualizar características rurales:', err);
    throw err;
  }
};

module.exports = {
  insertaIdentificacionPredio,
  updateCatastroPredio,
  getCatastroPredioById,
  getCatastroPredioByTipo,    
  updateCaracteristicasPredio,
  updateObservaciones,
  deleteCatastroPredio,
  recuperaIdPredioByClave,
  recuperaClaves,
  updateCaracteristicasRurales
};