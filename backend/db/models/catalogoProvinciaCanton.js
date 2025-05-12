// db/models/catalogoProcinciaCanton.js
const db = require('../config');

//  Función para obtener las provincias
const getProvincias = async () => {
  const query = `
    SELECT id_prov, descripcion, dpa
	FROM public.catastro_provincia
    ORDER BY id_prov ASC;
  `;
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

// Función para obtener los cantones por provincia
const getCantonesByProvincia = async (id) => {
    const query = `
    SELECT id_can, descripcion, dpa
	FROM public.catastro_canton
    WHERE id_prov = $1  ;
    `;
    try {
        const result = await db.query(query, [id]);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    } 
  }

module.exports = {
    getProvincias,
    getCantonesByProvincia
};
  