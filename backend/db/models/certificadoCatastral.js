const db = require('../config'); // Configuración de la conexión a la base de datos
const CertificadoCatastral = require('../models/certificadoCatastral');

// Recuperar todos los registros
async function recuperaCertificado() {
  const query = `
    SELECT * 
    FROM valores_reportes.certificado_catastral
  `;
  const { rows } = await db.query(query);
  return rows;
}

// Recuperar un registro por ID
async function recuperaCertificadoById(id) {
  const query = `
    SELECT * 
    FROM valores_reportes.certificado_catastral
    WHERE id_certificado = $1
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
}

// Insertar un nuevo registro con valores por defecto si están vacíos o nulos
async function insertaCertificado(data) {
  const normalizar = (valor, tipo = 'texto') => {
    if (valor === undefined || valor === null || valor === '') {
      if (tipo === 'texto') return '';
      if (tipo === 'numero') return 0;
      if (tipo === 'booleano') return false;
      return null;
    }
    return valor;
  };

  const parseFecha = (fecha) => {
    return (fecha && !isNaN(new Date(fecha))) ? new Date(fecha) : null;
  };

  const maxQuery = `
    SELECT COUNT(*) AS max_numero
    FROM valores_reportes.certificado_catastral
    WHERE tipo_certificado = $1
  `;
  const { rows: maxRows } = await db.query(maxQuery, [normalizar(data.tipo_certificado)]);
  const maxNumero = parseInt(maxRows[0].max_numero || 0, 10) + 1;
  const anioActual = new Date().getFullYear();
  const nuevoNumeroSerie = `${maxNumero} - ${anioActual}`;

  const query = `
    INSERT INTO valores_reportes.certificado_catastral (
      tipo_predio, ph, clave_catastral, clave_anterior, parroquia, numero_documento, alicuota,
      porcentaje_participacion, area_suelo_porcentual, area_construcciones_porcentual, valor_suelo_porcentual,
      valor_construcciones_porcentual, valor_instalaciones_porcentual, valor_adicionales_porcentual,
      avaluo_predio_porcentual, anio_proceso, id_tenencia_propiedad, id_predio, propietario, fecha_proceso,
      nombre_canton, nombre_parroquia, direccion, tipo_tramite, propietario_nuevo, nuevo_documento,
      tipo_venta, cuantia, porcentaje_compra, valor_compra, observaciones, fecha_registro, usuario,
      tipo_certificado, numero_serie, fecha_adquisicion_anterior, valor_avaluo_anterior, sup_total_adquirida,
      sup_transfiere, fecha_pos_def, valor_avaluo_pos_def, valor_const_pos_def, valor_otros_pos_def
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
      $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38,
      $39, $40, $41, $42, $43
    ) RETURNING *
  `;

  const values = [
    normalizar(data.tipo_predio, 'numero'), normalizar(data.ph), normalizar(data.clave_catastral),
    normalizar(data.clave_anterior), normalizar(data.parroquia, 'numero'), normalizar(data.numero_documento),
    normalizar(data.alicuota, 'numero'), normalizar(data.porcentaje_participacion, 'numero'),
    normalizar(data.area_suelo_porcentual, 'numero'), normalizar(data.area_construcciones_porcentual, 'numero'),
    normalizar(data.valor_suelo_porcentual, 'numero'), normalizar(data.valor_construcciones_porcentual, 'numero'),
    normalizar(data.valor_instalaciones_porcentual, 'numero'), normalizar(data.valor_adicionales_porcentual, 'numero'),
    normalizar(data.avaluo_predio_porcentual, 'numero'), normalizar(data.anio_proceso, 'numero'),
    normalizar(data.id_tenencia_propiedad, 'numero'), normalizar(data.id_predio, 'numero'),
    normalizar(data.propietario), parseFecha(data.fecha_proceso), normalizar(data.nombre_canton),
    normalizar(data.nombre_parroquia), normalizar(data.direccion),
    (normalizar(data.tipo_tramite) || '').toString().replace(/[{}]/g, ''),
    normalizar(data.propietario_nuevo), normalizar(data.nuevo_documento),
    (normalizar(data.tipo_venta) || '').toString().replace(/[{}]/g, ''),
    normalizar(data.cuantia, 'numero'), normalizar(data.porcentaje_compra, 'numero'),
    normalizar(data.valor_compra, 'numero'), normalizar(data.observaciones),
    new Date(), normalizar(data.usuario), normalizar(data.tipo_certificado), nuevoNumeroSerie,
    parseFecha(data.fecha_adquisicion_anterior), normalizar(data.valor_avaluo_anterior, 'numero'),
    normalizar(data.sup_total_adquirida, 'numero'), normalizar(data.sup_transfiere, 'numero'),
    parseFecha(data.fecha_pos_def), normalizar(data.valor_avaluo_pos_def, 'numero'),
    normalizar(data.valor_const_pos_def, 'numero'), normalizar(data.valor_otros_pos_def, 'numero')
  ];

  try {
    console.log('Valores a insertar:', values);
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    let errorMessage = 'Error ejecutando la consulta';
    if (err.code) {
      switch (err.code) {
        case '23505':
          errorMessage = 'Error: Valor duplicado viola la restricción de unicidad';
          break;
        case '23503':
          errorMessage = `Error: Violación de clave foránea (${err.detail})`;
          break;
        case '23502':
          errorMessage = `Error: Valor nulo en la columna '${err.column}' viola la restricción NOT NULL`;
          break;
        case '22P02':
          errorMessage = 'Error: Sintaxis de entrada no válida (esperaba número y recibió texto)';
          break;
        default:
          errorMessage = `Error de base de datos: ${err.message}`;
      }
    } else {
      errorMessage = `Error ejecutando la consulta: ${err.stack}`;
    }

    console.error('==== ERROR INSERTANDO CERTIFICADO ====');
    console.error('Mensaje de error:', errorMessage);
    console.error('Datos recibidos que causaron el error:', data);
    throw new Error(errorMessage);
  }
}

// Modificar un registro existente
async function actualizaCertificado(id, data) {
  const query = `
    UPDATE valores_reportes.certificado_catastral
    SET 
      tipo_predio = $1, ph = $2, clave_catastral = $3, clave_anterior = $4, parroquia = $5,
      numero_documento = $6, alicuota = $7, porcentaje_participacion = $8, area_suelo_porcentual = $9,
      area_construcciones_porcentual = $10, valor_suelo_porcentual = $11, 
      valor_construcciones_porcentual = $12, valor_instalaciones_porcentual = $13, 
      valor_adicionales_porcentual = $14, avaluo_predio_porcentual = $15, 
      anio_proceso = $16, id_tenencia_propiedad = $17, id_predio = $18, propietario = $19, 
      fecha_proceso = $20, propietario_nuevo = $21, nuevo_documento = $22, tipo_tramite = $23, 
      tipo_venta = $24, cuantia = $25, porcentaje_compra = $26, valor_compra = $27, fecha_registro = $28,
      usuario = $29, codigo_qr = $30, numero_serie = $31, observaciones = $32, lindero_norte = $33,
      lindero_sur = $34, lindero_este = $35, lindero_oeste = $36, nombre_parroquia = $37, 
      direccion = $38, fecha_adquisicion_anterior = $39, valor_avaluo_anterior = $40, sup_total_adquirida = $41, 
      sup_transfiere = $42, fecha_pos_def = $43, valor_avaluo_pos_def = $44, valor_const_pos_def = $45, valor_otros_pos_def = $46
    WHERE id_certificado = $47
    RETURNING *
  `;
  const values = [
    data.tipo_predio, data.ph, data.clave_catastral, data.clave_anterior, data.parroquia, 
    data.numero_documento, data.alicuota, data.porcentaje_participacion, data.area_suelo_porcentual, 
    data.area_construcciones_porcentual, data.valor_suelo_porcentual, data.valor_construcciones_porcentual, 
    data.valor_instalaciones_porcentual, data.valor_adicionales_porcentual, data.avaluo_predio_porcentual, 
    data.anio_proceso, data.id_tenencia_propiedad, data.id_predio, data.propietario, data.fecha_proceso, 
    data.propietario_nuevo, data.nuevo_documento, data.tipo_tramite, data.tipo_venta, data.cuantia, 
    data.porcentaje_compra, data.valor_compra, data.fecha_registro, data.usuario, data.codigo_qr, 
    data.numero_serie, data.observaciones, data.lindero_norte, data.lindero_sur, data.lindero_este, 
    data.lindero_oeste, data.nombre_parroquia, data.direccion, data.fecha_adquisicion_anterior,
    data.valor_avaluo_anterior, data.sup_total_adquirida, data.sup_transfiere, data.fecha_pos_def,
    data.valor_avaluo_pos_def, data.valor_const_pos_def, data.valor_otros_pos_def, id
  ];
  const { rows } = await db.query(query, values);
  return rows[0];
}

// Eliminar un registro
async function eliminaCertificado(id) {
  const query = `
    DELETE FROM valores_reportes.certificado_catastral
    WHERE id_certificado = $1
  `;
  await db.query(query, [id]);
  return { message: 'Certificado eliminado correctamente' };
}

// Servicio para obtener datos completos de certificado catastral por clave catastral
async function getCertificadoCatastralDetallePorClave(claveCatastral) {
  const query = `
    SELECT 
      p.id_predio, 
      p.clave_catastral, 
      p.clave_catastral_anterior, 
      p.id_tipo_predio,
      t.id_tenencia, 
      ROUND(t.porcentaje_participacion::numeric,2) AS porcentaje_participacion,
      c.nombres, 
      c.numero_documento, 
      ROUND(v.area_suelo_porcentual::numeric, 2) AS area_suelo_porcentual,
      ROUND(v.area_construcciones_porcentual::numeric, 2) AS area_construcciones_porcentual, 
      ROUND(v.valor_suelo_porcentual::numeric, 2) AS valor_suelo_porcentual, 
      ROUND(v.valor_construcciones_porcentual::numeric, 2) AS valor_construcciones_porcentual, 
      ROUND(v.valor_adicionales_porcentual::numeric, 2) AS valor_adicionales_porcentual,
      ROUND(v.avaluo_predio_porcentual::numeric, 2) AS avaluo_predio_porcentual, 
      v.parroquia, 
      r.descripcion AS nombre_parroquia,     
      ROUND(v.alicuota::numeric, 2) AS alicuota
    FROM 
      public.catastro_predio p 
    LEFT JOIN 
      public.catastro_tenencia t ON p.id_predio = t.id_predio
    LEFT JOIN 
      public.catastro_ciudadano c ON c.id_ciudadano = t.id_propietario
    LEFT JOIN 
      valores_reportes.vista_patrimonio_urbano v ON v.id_predio = p.id_predio
      AND t.id_tenencia = v.id_tenencia_propiedad
    LEFT JOIN 
      public.catastro_parroquia r ON r.id_par = v.parroquia
    WHERE 
      p.clave_catastral = $1
  `;
  const { rows } = await db.query(query, [claveCatastral]);
  return rows;
}

module.exports = {
  recuperaCertificado,
  recuperaCertificadoById,
  insertaCertificado,
  actualizaCertificado,
  eliminaCertificado,
  getCertificadoCatastralDetallePorClave,
};

