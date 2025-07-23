// db/models/catalogo.js
const db = require('../config');

// Función para obtener el catálogo basado en id_tipo_atributo
const getCatalogoByTipoAtributo = async (id_tipo_atributo, tipo_exclusivo) => {
  const query = `
    SELECT id,  descripcion
    FROM public.catastro_catalogo 
    WHERE id_tipo_atributo = $1 AND tipo_exclusivo = $2
    ORDER BY descripcion ASC;
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

// Función para recuperar un registro de la tabla de Fotos de Predio por id
const getCatalogoDominio = async () => {
    const query = `
      SELECT  id, id_tipo_atributo, codigo, descripcion, 
              factor, digitador, fecha_registro, actualizador, 
              fecha_actualizacion_aud, factor_alt, tipo_exclusivo
        FROM public.catastro_catalogo
      ORDER BY id_tipo_atributo, id, descripcion
    `;

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Servicio para actualizar un dominio por id
const updateCatalogoDominio = async (id, data) => {
    const query = `
      UPDATE public.catastro_catalogo
      SET id_tipo_atributo = $1,
          codigo = $2,
          descripcion = $3,
          factor = $4,
          factor_alt = $5,
          tipo_exclusivo = $6
      WHERE id = $7
      RETURNING *;
    `;
    const values = [
      data.id_tipo_atributo,
      data.codigo,
      data.descripcion,
      data.factor,
      data.factor_alt,
      data.tipo_exclusivo,
      id
    ];
    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error updating dominio', err.stack);
        throw err;
    }
};

// Servicio para obtener id y descripcion de catastro_tipo_atributo por id
const getTipoAtributo = async () => {
  const query = `
    SELECT id, descripcion
    FROM public.catastro_tipo_atributo
    ORDER BY descripcion ASC
  `;
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
};

module.exports = {
  getCatalogoByTipoAtributo,
  getDescripcionById,
  getCatalogoDominio,
  updateCatalogoDominio,
  getTipoAtributo,
};
