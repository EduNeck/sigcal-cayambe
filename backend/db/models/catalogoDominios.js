const db = require('../config');

// Servicio para consultar todos los dominios del catálogo
async function catalogoDominios() {
  const query = `
    SELECT id, id_tipo_atributo, codigo, descripcion, factor, digitador, fecha_registro, actualizador, fecha_actualizacion_aud, factor_alt, tipo_exclusivo
    FROM public.catastro_catalogo
  `;
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error ejecutando catalogoDominios:', error);
    throw error;
  }
}

module.exports = {
  catalogoDominios,
};
