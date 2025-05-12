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

// Insertar un nuevo registro
async function insertaCertificado(data) {
  // Obtener el número total de certificados para el tipo_certificado
  const maxQuery = `
    SELECT COUNT(*) AS max_numero
    FROM valores_reportes.certificado_catastral
    WHERE tipo_certificado = $1
  `;
  const { rows: maxRows } = await db.query(maxQuery, [data.tipo_certificado]);

  // Depuración: Verificar el resultado de la consulta
  console.log('Número total de registros:', maxRows[0].max_numero);

  // Convertir el valor recuperado a número y sumarle 1
  const maxNumero = parseInt(maxRows[0].max_numero, 10) + 1;

  // Obtener el año actual
  const anioActual = new Date().getFullYear();

  // Concatenar el número incrementado con el año actual
  const nuevoNumeroSerie = `${maxNumero} - ${anioActual}`;
  console.log('Nuevo número de serie:', nuevoNumeroSerie);

  // Insertar el nuevo registro
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
    data.tipo_predio, data.ph, data.clave_catastral, data.clave_anterior, data.parroquia, data.numero_documento,
    data.alicuota, data.porcentaje_participacion, data.area_suelo_porcentual, data.area_construcciones_porcentual,
    data.valor_suelo_porcentual, data.valor_construcciones_porcentual, data.valor_instalaciones_porcentual,
    data.valor_adicionales_porcentual, data.avaluo_predio_porcentual, data.anio_proceso, data.id_tenencia_propiedad,
    data.id_predio, data.propietario, data.fecha_proceso, data.nombre_canton, data.nombre_parroquia, data.direccion,
    (data.tipo_tramite || '').toString().replace(/[{}]/g, ''), data.propietario_nuevo, data.nuevo_documento,
    (data.tipo_venta || '').toString().replace(/[{}]/g, ''), data.cuantia, data.porcentaje_compra, data.valor_compra,
    data.observaciones, new Date(), data.usuario, data.tipo_certificado, nuevoNumeroSerie, data.fecha_adquisicion_anterior,
    data.valor_avaluo_anterior, data.sup_total_adquirida, data.sup_transfiere, data.fecha_pos_def,
    data.valor_avaluo_pos_def, data.valor_const_pos_def, data.valor_otros_pos_def
  ];

  try {
    console.log('Valores a insertar:', values);
    const result = await db.query(query, values);
    return result.rows[0]; // Devolver el registro insertado
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

module.exports = {
  recuperaCertificado,
  recuperaCertificadoById,
  insertaCertificado,
  actualizaCertificado,
  eliminaCertificado,
};

