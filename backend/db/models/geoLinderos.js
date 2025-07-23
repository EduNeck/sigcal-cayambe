// db/models/geoLinderos.js
const db = require('../config');

// Función para insertar un registro en la tabla `geo_linderos`
const insertaGeoLindero = async (data) => {
  const query = `
    INSERT INTO public.geo_linderos (
      geom, clave, longitud, tipo, clave_lindero, tipo_lindero, 
      azimuth, nombres, cardinalidad, ord
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    )
    RETURNING id;
  `;
  const values = [
    data.geom || null,
    data.clave || data.clave_catastral || null, // Acepta ambos nombres
    data.longitud || null,
    data.tipo || null,
    data.clave_lindero || null,
    data.tipo_lindero || null,
    data.azimuth || null,
    data.nombres || null,
    data.cardinalidad || null,
    data.ord || null
  ];

  try {
    const result = await db.query(query, values);
    return result.rows[0].id;
  } catch (err) {
    console.error('Error al insertar geo_lindero:', err);
    throw err;
  }
};

// Función para actualizar un registro en la tabla `geo_linderos`
const updateGeoLindero = async (id, data) => {
  const query = `
    UPDATE public.geo_linderos 
    SET geom = $1, clave = $2, longitud = $3, tipo = $4, clave_lindero = $5, 
        tipo_lindero = $6, azimuth = $7, nombres = $8, cardinalidad = $9, ord = $10
    WHERE id = $11
    RETURNING *;
  `;
  const values = [
    data.geom || null,
    data.clave || data.clave_catastral || null, // Acepta ambos nombres
    data.longitud || null,
    data.tipo || null,
    data.clave_lindero || null,
    data.tipo_lindero || null,
    data.azimuth || null,
    data.nombres || null,
    data.cardinalidad || null,
    data.ord || null,
    id
  ];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error al actualizar geo_lindero:', err);
    throw err;
  }
};

// Función para obtener todos los linderos
const getGeoLinderos = async () => {
  const query = `
    SELECT id, ST_AsText(geom) as geom_text, clave, longitud, tipo, 
           clave_lindero, tipo_lindero, azimuth, nombres, cardinalidad, ord,
           clave as clave_catastral
    FROM public.geo_linderos 
    ORDER BY ord, id;
  `;
  
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error al obtener geo_linderos:', err);
    throw err;
  }
};

// Función para obtener un lindero por ID
const getGeoLinderoById = async (id) => {
  const query = `
    SELECT id, ST_AsText(geom) as geom_text, clave, longitud, tipo, 
           clave_lindero, tipo_lindero, azimuth, nombres, cardinalidad, ord,
           clave as clave_catastral
    FROM public.geo_linderos 
    WHERE id = $1;
  `;
  
  try {
    const result = await db.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error al obtener geo_lindero por ID:', err);
    throw err;
  }
};

// Función para obtener linderos por clave catastral (usando campo 'clave')
const getGeoLinderosByClave = async (clave_catastral) => {
  const query = `
    SELECT id, ST_AsText(geom) as geom_text, clave, longitud, tipo, 
           clave_lindero, tipo_lindero, azimuth, nombres, cardinalidad, ord,
           clave as clave_catastral
    FROM public.geo_linderos 
    WHERE clave = $1
    ORDER BY ord, id;
  `;
  
  try {
    const result = await db.query(query, [clave_catastral]);
    return result.rows;
  } catch (err) {
    console.error('Error al obtener geo_linderos por clave catastral:', err);
    throw err;
  }
};

// Función para obtener linderos por clave lindero
const getGeoLinderosByClaveL = async (clave_lindero) => {
  const query = `
    SELECT id, ST_AsText(geom) as geom_text, clave, longitud, tipo, 
           clave_lindero, tipo_lindero, azimuth, nombres, cardinalidad, ord,
           clave as clave_catastral
    FROM public.geo_linderos 
    WHERE clave_lindero = $1
    ORDER BY ord, id;
  `;
  
  try {
    const result = await db.query(query, [clave_lindero]);
    return result.rows;
  } catch (err) {
    console.error('Error al obtener geo_linderos por clave lindero:', err);
    throw err;
  }
};

// Función para obtener linderos por tipo
const getGeoLinderosByTipo = async (tipo) => {
  const query = `
    SELECT id, ST_AsText(geom) as geom_text, clave, longitud, tipo, 
           clave_lindero, tipo_lindero, azimuth, nombres, cardinalidad, ord,
           clave as clave_catastral
    FROM public.geo_linderos 
    WHERE tipo = $1
    ORDER BY ord, id;
  `;
  
  try {
    const result = await db.query(query, [tipo]);
    return result.rows;
  } catch (err) {
    console.error('Error al obtener geo_linderos por tipo:', err);
    throw err;
  }
};

// Función para eliminar un registro por ID
const deleteGeoLindero = async (id) => {
  const query = `
    DELETE FROM public.geo_linderos 
    WHERE id = $1 
    RETURNING id;
  `;
  
  try {
    const result = await db.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error al eliminar geo_lindero:', err);
    throw err;
  }
};

// Función para eliminar linderos por clave catastral (usando campo 'clave')
const deleteGeoLinderosByClave = async (clave_catastral) => {
  const query = `
    DELETE FROM public.geo_linderos 
    WHERE clave = $1 
    RETURNING id;
  `;
  
  try {
    const result = await db.query(query, [clave_catastral]);
    return result.rows;
  } catch (err) {
    console.error('Error al eliminar geo_linderos por clave catastral:', err);
    throw err;
  }
};

// Función para obtener estadísticas de linderos
const getGeoLinderosStats = async () => {
  const query = `
    SELECT 
      COUNT(*) as total_linderos,
      COUNT(DISTINCT clave) as total_claves,
      COUNT(DISTINCT tipo) as total_tipos,
      COUNT(DISTINCT cardinalidad) as total_cardinalidades,
      AVG(longitud) as longitud_promedio,
      MAX(longitud) as longitud_maxima,
      MIN(longitud) as longitud_minima
    FROM public.geo_linderos;
  `;
  
  try {
    const result = await db.query(query);
    return result.rows[0];
  } catch (err) {
    console.error('Error al obtener estadísticas de geo_linderos:', err);
    throw err;
  }
};

module.exports = {
  insertaGeoLindero,
  updateGeoLindero,
  getGeoLinderos,
  getGeoLinderoById,
  getGeoLinderosByClave,
  getGeoLinderosByClaveL,
  getGeoLinderosByTipo,
  deleteGeoLindero,
  deleteGeoLinderosByClave,
  getGeoLinderosStats
};
