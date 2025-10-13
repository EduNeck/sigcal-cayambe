// backend/db/models/catastroDocumentos.js
const db = require('../config');

/** Convierte base64 (puro) a Buffer para BYTEA */
function base64ToBuffer(b64) {
  if (!b64 || typeof b64 !== 'string') return null;
  try {
    return Buffer.from(b64, 'base64');
  } catch {
    return null;
  }
}

const insertaDocumento = async (data) => {
  const q = `
    INSERT INTO public.catastro_documentos (
      descripcion, fecha_registro, documento, id_predio, digitador, actualizador,
      fecha_actualizacion_aud, nombre, tipo, tamanio
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING id_documentos;
  `;

  const buffer = base64ToBuffer(data.documento);
  if (!buffer) throw new Error('Documento base64 inválido o vacío');

  const v = [
    data.descripcion || null,
    data.fecha_registro || new Date(),
    buffer, // BYTEA
    data.id_predio,
    data.digitador || null,
    data.actualizador || data.digitador || null,
    data.fecha_actualizacion_aud || data.fecha_registro || new Date(),
    data.nombre || 'documento',
    data.tipo || 'application/octet-stream',
    data.tamanio ?? 0 // numeric(17,4) admite enteros también
  ];
  const r = await db.query(q, v);
  return r.rows[0].id_documentos;
};

const obtieneDocumentoById = async (id) => {
  const q = `
    SELECT id_documentos, descripcion, fecha_registro, documento, id_predio,
           digitador, actualizador, fecha_actualizacion_aud, nombre, tipo, tamanio
    FROM public.catastro_documentos
    WHERE id_documentos = $1;
  `;
  const r = await db.query(q, [id]);
  if (!r.rowCount) return null;

  const row = r.rows[0];
  // BYTEA -> base64 para edición en el front (si la necesitas)
  const documentoBase64 = row.documento ? Buffer.from(row.documento).toString('base64') : null;

  return { ...row, documento: documentoBase64 };
};

const obtieneDocumentosLite = async () => {
  const q = `
    SELECT
      id_documentos, descripcion, fecha_registro, id_predio, digitador,
      actualizador, fecha_actualizacion_aud, nombre, tipo, tamanio
    FROM public.catastro_documentos
    ORDER BY id_documentos DESC;
  `;
  const r = await db.query(q);
  return r.rows;
};

const obtieneDocumentos = async () => {
  const q = `
    SELECT
      id_documentos, descripcion, fecha_registro, id_predio, digitador,
      actualizador, fecha_actualizacion_aud, nombre, tipo, tamanio, documento
    FROM public.catastro_documentos
    ORDER BY id_documentos DESC;
  `;
  const r = await db.query(q);
  return r.rows.map(row => ({
    ...row,
    documento: row.documento ? Buffer.from(row.documento).toString('base64') : null
  }));
};

const actualizaDocumento = async (id, data) => {
  // Si viene "documento" lo reemplaza; si no, mantiene el existente
  const setDocumento = typeof data.documento === 'string';
  const buffer = setDocumento ? base64ToBuffer(data.documento) : null;

  const q = `
    UPDATE public.catastro_documentos SET
      descripcion = $1,
      fecha_registro = $2,
      ${setDocumento ? 'documento = $3,' : ''}
      id_predio = $${setDocumento ? 4 : 3},
      digitador = $${setDocumento ? 5 : 4},
      actualizador = $${setDocumento ? 6 : 5},
      fecha_actualizacion_aud = $${setDocumento ? 7 : 6},
      nombre = $${setDocumento ? 8 : 7},
      tipo = $${setDocumento ? 9 : 8},
      tamanio = $${setDocumento ? 10 : 9}
    WHERE id_documentos = $${setDocumento ? 11 : 10}
    RETURNING id_documentos, descripcion, fecha_registro, id_predio, digitador,
              actualizador, fecha_actualizacion_aud, nombre, tipo, tamanio;
  `;

  const vBase = [
    data.descripcion || null,
    data.fecha_registro || new Date()
  ];

  const vRest = [
    data.id_predio || null,
    data.digitador || null,
    data.actualizador || data.digitador || null,
    data.fecha_actualizacion_aud || data.fecha_registro || new Date(),
    data.nombre || 'documento',
    data.tipo || 'application/octet-stream',
    data.tamanio ?? 0,
    id
  ];

  const v = setDocumento ? [...vBase, buffer, ...vRest] : [...vBase, ...vRest];

  const r = await db.query(q, v);
  return r.rows[0] || null;
};

const eliminaDocumento = async (id) => {
  const q = `DELETE FROM public.catastro_documentos WHERE id_documentos = $1 RETURNING *;`;
  const r = await db.query(q, [id]);
  return r.rows[0] || null;
};

module.exports = {
  insertaDocumento,
  obtieneDocumentoById,
  obtieneDocumentos,
  obtieneDocumentosLite,
  actualizaDocumento,
  eliminaDocumento
};
