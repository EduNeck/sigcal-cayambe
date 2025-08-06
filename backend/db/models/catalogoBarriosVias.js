// db/models/catalogoBarriosVias.js
const db = require('../config');

// Función para obtener todos los barrios y vías
const getAllBarriosVias = async () => {
  const query = `
    SELECT id, id_barrio, nombre_barrio, id_calle, nombre_calle
    FROM public.catalogo_barrios_vias
    ORDER BY nombre_barrio ASC, nombre_calle ASC;
  `;
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error executing query getAllBarriosVias', err.stack);
    throw err;
  }
};

// Función para obtener barrios y vías por ID de barrio
const getBarriosViasByBarrio = async (id_barrio) => {
  const query = `
    SELECT id, id_barrio, nombre_barrio, id_calle, nombre_calle
    FROM public.catalogo_barrios_vias
    WHERE id_barrio = $1
    ORDER BY nombre_calle ASC;
  `;
  try {
    const result = await db.query(query, [id_barrio]);
    return result.rows;
  } catch (err) {
    console.error('Error executing query getBarriosViasByBarrio', err.stack);
    throw err;
  }
};

// Función para obtener barrios y vías por ID de calle
const getBarriosViasByCalle = async (id_calle) => {
  const query = `
    SELECT id, id_barrio, nombre_barrio, id_calle, nombre_calle
    FROM public.catalogo_barrios_vias
    WHERE id_calle = $1
    ORDER BY nombre_barrio ASC;
  `;
  try {
    const result = await db.query(query, [id_calle]);
    return result.rows;
  } catch (err) {
    console.error('Error executing query getBarriosViasByCalle', err.stack);
    throw err;
  }
};

// Función para obtener un registro específico por ID
const getBarriosViasById = async (id) => {
  const query = `
    SELECT id, id_barrio, nombre_barrio, id_calle, nombre_calle
    FROM public.catalogo_barrios_vias
    WHERE id = $1;
  `;
  try {
    const result = await db.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error executing query getBarriosViasById', err.stack);
    throw err;
  }
};

// Función para obtener solo los barrios (registros sin id_calle padre)
const getBarrios = async () => {
  const query = `
    SELECT DISTINCT(nombre_barrio), MIN(id_barrio) as id_barrio, MIN(id) as id
    FROM public.catalogo_barrios_vias
    WHERE nombre_barrio IS NOT NULL
    GROUP BY nombre_barrio
    ORDER BY nombre_barrio ASC;
  `;
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error executing query getBarrios', err.stack);
    throw err;
  }
};

// Función para obtener las calles de un barrio específico
const getCallesByBarrio = async (id_barrio) => {
  const query = `
    SELECT id, id_barrio, nombre_barrio, id_calle, nombre_calle
    FROM public.catalogo_barrios_vias
    WHERE id_barrio = $1 AND nombre_calle IS NOT NULL
    ORDER BY nombre_calle ASC;
  `;
  try {
    const result = await db.query(query, [id_barrio]);
    return result.rows;
  } catch (err) {
    console.error('Error executing query getCallesByBarrio', err.stack);
    throw err;
  }
};

// Función para insertar un nuevo barrio
const insertBarrio = async (nombre_barrio) => {
  const query = `
    INSERT INTO public.catalogo_barrios_vias (nombre_barrio, id_calle, nombre_calle)
    VALUES ($1, NULL, NULL)
    RETURNING id, nombre_barrio;
  `;
  try {
    const result = await db.query(query, [nombre_barrio]);
    return result.rows[0];
  } catch (err) {
    console.error('Error executing query insertBarrio', err.stack);
    throw err;
  }
};

// Función para insertar una nueva calle en un barrio
const insertCalle = async (id_barrio, nombre_barrio, nombre_calle) => {
  const query = `
    INSERT INTO public.catalogo_barrios_vias (id_barrio, nombre_barrio, nombre_calle)
    VALUES ($1, $2, $3)
    RETURNING id, id_barrio, nombre_barrio, nombre_calle;
  `;
  try {
    const result = await db.query(query, [id_barrio, nombre_barrio, nombre_calle]);
    return result.rows[0];
  } catch (err) {
    console.error('Error executing query insertCalle', err.stack);
    throw err;
  }
};

// Función para actualizar un barrio
const updateBarrio = async (id, nombre_barrio) => {
  const query = `
    UPDATE public.catalogo_barrios_vias 
    SET nombre_barrio = $2
    WHERE id = $1
    RETURNING id, nombre_barrio;
  `;
  try {
    const result = await db.query(query, [id, nombre_barrio]);
    return result.rows[0];
  } catch (err) {
    console.error('Error executing query updateBarrio', err.stack);
    throw err;
  }
};

// Función para actualizar el nombre de un barrio por id_barrio
const updateBarrioByIdBarrio = async (id_barrio, nombre_barrio) => {
  const query = `
    UPDATE public.catalogo_barrios_vias 
    SET nombre_barrio = $2
    WHERE id_barrio = $1
    RETURNING id, id_barrio, nombre_barrio;
  `;
  try {
    const result = await db.query(query, [id_barrio, nombre_barrio]);
    return result.rows;
  } catch (err) {
    console.error('Error executing query updateBarrioByIdBarrio', err.stack);
    throw err;
  }
};

// Función para actualizar una calle
const updateCalle = async (id, nombre_calle) => {
  const query = `
    UPDATE public.catalogo_barrios_vias 
    SET nombre_calle = $2
    WHERE id = $1
    RETURNING id, id_barrio, nombre_barrio, nombre_calle;
  `;
  try {
    const result = await db.query(query, [id, nombre_calle]);
    return result.rows[0];
  } catch (err) {
    console.error('Error executing query updateCalle', err.stack);
    throw err;
  }
};

// Función para eliminar un registro
const deleteBarrioVia = async (id) => {
  const query = `
    DELETE FROM public.catalogo_barrios_vias 
    WHERE id = $1
    RETURNING id;
  `;
  try {
    const result = await db.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error executing query deleteBarrioVia', err.stack);
    throw err;
  }
};

module.exports = {
  getAllBarriosVias,
  getBarriosViasByBarrio,
  getBarriosViasByCalle,
  getBarriosViasById,
  getBarrios,
  getCallesByBarrio,
  insertBarrio,
  insertCalle,
  updateBarrio,
  updateBarrioByIdBarrio,
  updateCalle,
  deleteBarrioVia
};
