// db/models/catastroCiudadano.js
const db = require('../config');

// Función para obtener todos los registros de la tabla `catastro_ciudadano`
const obtieneDatosCiudadano = async (params) => {
  const { nombres, numero_documento, tipo_persona, tipo_docuemnto } = params;

  let query = 'SELECT * FROM reporte_ficha.ficha_ciudadano WHERE 1=1'; // Base de la consulta
  const queryParams = [];

  // Agregar condiciones dinámicamente
  if (nombres) {
    queryParams.push(`%${nombres}%`);
    query += ` AND nombres ILIKE $${queryParams.length}`;
  }

  if (numero_documento) {
    queryParams.push(numero_documento);
    query += ` AND numero_documento = $${queryParams.length}`;
  }

  if (tipo_persona) {
    queryParams.push(tipo_persona);
    query += ` AND tipo_persona = $${queryParams.length}`;
  }

  if (tipo_docuemnto) {
    queryParams.push(tipo_docuemnto);
    query += ` AND tipo_docuemnto = $${queryParams.length}`;
  }

  query += ' ORDER BY nombres ASC'; // Ordenar por nombres al final

  try {
    console.log('Consulta generada:', query); // Depuración: Verifica la consulta generada
    console.log('Parámetros:', queryParams); // Depuración: Verifica los parámetros enviados
    const result = await db.query(query, queryParams);
    return result.rows;
  } catch (err) {
    console.error('Error ejecutando la consulta:', err.stack);
    throw err;
  }
};


// Función para obtener un registro por ID
const obtieneDatosCiudadanoById = async (id) => {
  if (id === undefined) {
    throw new Error('El ID proporcionado es undefined');
  }

  const query = 'SELECT id_ciudadano, id_tipo_documento, id_tipo_persona, id_personeria, numero_documento, nombre_principal, nombre_secundario, apellido_primario, apellido_secundario, nombres, fecha_nacimiento, telefono, email, direccion, id_estado_civil, fecha_registro, digitador, fecha_actualizacion_aud FROM public.catastro_ciudadano WHERE id_ciudadano = $1';
  try {
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) {
      throw new Error(`No se encontró un ciudadano con el ID: ${id}`);
    }
    return result.rows[0];
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
};

// Función para insertar un registro en la tabla `catastro_ciudadano`
const insertaCiudadano = async (data) => {
  const query = `
    INSERT INTO public.catastro_ciudadano (id_tipo_documento, id_tipo_persona, id_personeria, numero_documento, nombre_principal, nombre_secundario, apellido_primario, apellido_secundario, nombres, fecha_nacimiento, telefono, email, direccion, id_estado_civil, fecha_registro, digitador)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), $15)
    RETURNING id_ciudadano;
  `;
  const values = [
    data.id_tipo_documento, data.id_tipo_persona, data.id_personeria, data.numero_documento, data.nombre_principal, data.nombre_secundario, data.apellido_primario, data.apellido_secundario, data.nombres, data.fecha_nacimiento, data.telefono, data.email, data.direccion, data.id_estado_civil, data.digitador
  ];

  // Validar solo los campos que no pueden ser nulos
  const requiredFields = ['id_tipo_documento', 'id_tipo_persona', 'id_personeria', 'numero_documento', 'nombre_principal', 'apellido_primario'];

  for (const field of requiredFields) {
    if (data[field] === undefined) {
      console.log(`Error en campo: ${field}`);
      throw new Error(`Error en campo: ${field}`);
    }
  }

  try {
    console.log('valores a insertar', values);
    const result = await db.query(query, values);
    return result.rows[0].id_ciudadano; // Devolver el id_ciudadano
  } catch (err) {
    if (err.code) {
      switch (err.code) {
        case '23505': // unique_violation
          console.error('Error: Duplicate key value violates unique constraint', err.detail);
          break;
        case '23503': // foreign_key_violation
          console.error('Error: Foreign key violation', err.detail);
          break;
        case '23502': // not_null_violation
          console.error('Error: Null value in column violates not-null constraint', err.column);
          break;
        case '22P02': // invalid_text_representation
          console.error('Error: Invalid input syntax for integer', err.message);
          break;
        default:
          console.error('Database error', err.message);
      }
    } else {
      console.error('Error executing query', err.stack);
      throw err;
    }
  }
};

// Función para actualizar un registro en la tabla `catastro_ciudadano`
const actualizaCiudadanoByid = async (id, data) => {
  const query = `
    UPDATE public.catastro_ciudadano
    SET id_tipo_persona = $1, id_personeria = $2, apellido_primario = $3, nombre_principal = $4,
        id_tipo_documento = $5, numero_documento = $6, id_estado_civil = $7, fecha_nacimiento = $8,
        telefono = $9, email = $10, direccion = $11, nombres = $12, nombre_secundario = $13, apellido_secundario = $14,
        digitador = $15, fecha_actualizacion_aud = NOW()
    WHERE id_ciudadano = $16
    RETURNING *;
  `;
  const values = [
    data.id_tipo_persona, data.id_personeria, data.apellido_primario, data.nombre_principal,
    data.id_tipo_documento, data.numero_documento, data.id_estado_civil, data.fecha_nacimiento,
    data.telefono, data.email, data.direccion, data.nombres, data.nombre_secundario, data.apellido_secundario, 
    data.digitador, id
  ];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
};

// Función para obtener los registros de la tabla `catastro_ciudadano`
const recuperaCiudadanoTenencia = async () => {
  const query = 'SELECT id_ciudadano, nombres, numero_documento FROM public.catastro_ciudadano ORDER BY nombres ASC';
  try {
    const result = await db.query(query);
    return result.rows;
  }catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
};

// Función para eliminar un registro en la tabla `catastro_ciudadano`
const eliminaCiudadanoById = async (id) => {
  const query = 'DELETE FROM public.catastro_ciudadano WHERE id_ciudadano = $1';
  try {
    console.log('Intentando eliminar ciudadano con ID:', id);
    const result = await db.query(query, [id]);
    console.log('Resultado de la eliminación:', result);
    return result.rows;
  } catch (err) {
    console.error('Error ejecutando la consulta de eliminación', err.stack);
    throw err;
  }
};

module.exports = {
  obtieneDatosCiudadano,
  obtieneDatosCiudadanoById,
  insertaCiudadano, 
  actualizaCiudadanoByid,
  recuperaCiudadanoTenencia,
  eliminaCiudadanoById
};