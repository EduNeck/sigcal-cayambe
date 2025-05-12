// db/models/catalogo.js
const db = require('../config');

// Función para obtener el catálogo basado en id_tipo_atributo
const getCatalogoByTipoAtributo = async (id_tipo_atributo, tipo_exclusivo) => {
  const query = `
    SELECT id,  descripcion
    FROM public.catastro_catalogo 
    WHERE id_tipo_atributo = $1 AND tipo_exclusivo = $2
    ORDER BY id ASC;
  `;
  try {
    const result = await db.query(query, [id_tipo_atributo, tipo_exclusivo]);
    return result.rows;
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
};

// Función para obtener la descripción de un id
const getDescripcionById = async (id) =>{
  const query = `
    SELECT descripcion
    FROM public.catastro_catalogo
    WHERE id = $1
  `;
  try {
    const result = await db.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
};

module.exports = {
  getCatalogoByTipoAtributo,
  getDescripcionById,
};
