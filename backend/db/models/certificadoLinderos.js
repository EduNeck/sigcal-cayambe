const db = require('../config');

// Servicio para consultar certificado_linderos por clave
async function getCertificadoLinderosByClave(clave) {
  const query = `
    SELECT id, clave, longitud, tipo, clave_lindero, tipo_lindero, azimuth, nombres, cardinalidad, ord, numero_documento, propietarios, direccion_principal, area_terreno, avaluo_predio_porcentual, descripcion
    FROM reporte_ficha.certificado_linderos
    WHERE clave = $1
  `;
  const { rows } = await db.query(query, [clave]);
  return rows;
}

// Servicio para actualizar un registro en geo_linderos por clave
async function updateGeoLinderosByClave(data) {
  const query = `
    UPDATE public.geo_linderos
    SET longitud = $1, tipo = $2, clave_lindero = $3, tipo_lindero = $4, azimuth = $5, nombres = $6, cardinalidad = $7, ord = $8
    WHERE clave = $9 AND id = $10
    RETURNING *
  `;
  const values = [
    data.longitud,
    data.tipo,
    data.clave_lindero,
    data.tipo_lindero,
    data.azimuth,
    data.nombres,
    data.cardinalidad,
    data.ord,
    data.clave
  ];
  const { rows } = await db.query(query, values);
  return rows[0];
}

module.exports = {
  getCertificadoLinderosByClave,
  updateGeoLinderosByClave,
};
