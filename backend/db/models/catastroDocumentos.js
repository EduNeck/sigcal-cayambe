// db/models/catastroDocumentos.js
const db = require('../config');

// Función para insertar un nuevo documento
const insertaDocumento = async (data) => {
  const query = `
    INSERT INTO public.catastro_documentos (
      descripcion, fecha_registro, documento, id_predio, digitador, actualizador,
      fecha_actualizacion_aud, nombre, tipo, tamanio
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    ) RETURNING id_documentos;
  `;
  
  const values = [
    data.descripcion,
    data.fecha_registro,
    data.documento,                  // base64 plano como texto
    data.id_predio,
    data.digitador,
    data.actualizador || data.digitador,
    data.fecha_actualizacion_aud || data.fecha_registro,
    data.nombre,
    data.tipo || 'application/pdf',
    data.tamanio || 0
  ];

  try {
    const result = await db.query(query, values);
    return result.rows[0].id_documentos;
  } catch (err) {
    console.error('Error al insertar el documento:', err);
    throw err;
  }
};

// Función para obtener un documento por su ID
const obtieneDocumentoById = async (id) => {
  const query = `
    SELECT * FROM public.catastro_documentos WHERE id_documentos = $1;
  `;
  try {
    const result = await db.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    console.error('Error al obtener el documento:', err);
    throw err;
  }
};

// Función para obtener todos los documentos
// Función para obtener todos los documentos
const obtieneDocumentos = async () => {
  const query = `
    SELECT 
      id_documentos,
      descripcion,
      fecha_registro,
      id_predio,
      digitador,
      actualizador,
      fecha_actualizacion_aud,
      nombre,
      tipo,
      tamanio,
      documento
    FROM public.catastro_documentos;
  `;

  try {
    const result = await db.query(query);

    // Convertir campo documento a base64
    const documentos = result.rows.map(doc => ({
      ...doc,
      documento: doc.documento
        ? Buffer.from(doc.documento).toString('base64')
        : null, // evitar errores si está vacío
    }));

    return documentos;
  } catch (err) {
    console.error('Error al obtener los documentos:', err);
    throw err;
  }
};


// Función para actualizar un documento por su ID
const actualizaDocumento = async (id, data) => {
  const query = `
    UPDATE public.catastro_documentos SET
      descripcion = $1, fecha_registro = $2, documento = $3, id_predio = $4, digitador = $5, 
      actualizador = $6, fecha_actualizacion_aud = $7, nombre = $8, tipo = $9, tamanio = $10
    WHERE id_documentos = $11
    RETURNING *;
  `;
  const values = [
    data.descripcion, data.fecha_registro, data.documento, data.id_predio, data.digitador, 
    data.actualizador, data.fecha_actualizacion_aud, data.nombre, data.tipo, data.tamanio, id
  ];

  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error al actualizar el documento:', err);
    throw err;
  }
};

// Función para eliminar un documento por su ID
const eliminaDocumento = async (id) => {
  const query = `
    DELETE FROM public.catastro_documentos WHERE id_documentos = $1 RETURNING *;
  `;
  try {
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) {
      console.warn(`⚠ No se encontró ningún documento con id: ${id}`);
      return null;
    }
    console.log(`✅ Documento con id: ${id} eliminado con éxito`);
    return result.rows[0];
  } catch (err) {
    console.error(`❌ Error al eliminar el documento con id: ${id}`, err.message);
    throw new Error('Error al eliminar el documento en la base de datos');
  }
};

module.exports = {
  insertaDocumento,
  obtieneDocumentoById,
  obtieneDocumentos,
  actualizaDocumento,
  eliminaDocumento
};

