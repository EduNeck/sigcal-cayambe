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

module.exports = {
  getCertificadoLinderosByClave,
};
