const db = require('../config');

const recuperaPatrimonioCertificado = async (claveCatastral, anioProceso, tipoPredio) => {
  const query = `
    SELECT tipo_predio, ph, clave_catastral, clave_anterior, parroquia, 
           numero_documento, alicuota, porcentaje_participacion, area_suelo_porcentual, 
           area_construcciones_porcentual, valor_suelo_porcentual, valor_construcciones_porcentual, 
           valor_instalaciones_porcentual, valor_adicionales_porcentual, avaluo_predio_porcentual, 
           anio_proceso, id_tenencia_propiedad, id_predio, propietario, fecha_proceso, nombre_parroquia, 
           nombre_canton, direccion
    FROM valores_reportes.vista_patrimonio
    WHERE clave_catastral = $1 AND anio_proceso = $2 AND tipo_predio = $3;
  `;

  try {
    const { rows } = await db.query(query, [claveCatastral, anioProceso, tipoPredio]);
    return rows;
  } catch (error) {
    console.error('Error al recuperar datos de patrimonio urbano:', error);
    throw error;
  }
};

module.exports = {
    recuperaPatrimonioCertificado,
};

