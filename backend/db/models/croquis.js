const db = require('../config');

// Servicio para obtener la extensión (bounding box) de un predio por cod_cat
async function getPredioExtentByCodCat(codCat) {
  const query = `
    SELECT 
      boundxmax AS xmax,
      boundymax AS ymax,
      boundxmin AS xmin,
      boundymin AS ymin
    FROM public.geo_predio
    WHERE cod_cat = $1;
  `;
  const { rows } = await db.query(query, [codCat]);
  return rows[0];
}

module.exports = {
  getPredioExtentByCodCat,
  // ...otros exports si existen...
};