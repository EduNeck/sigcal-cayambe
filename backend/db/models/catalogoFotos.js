const db = require('../config');

// Función para insertar un registro en la tabla de Fotos de Predio`
const insertFotoPredio = async (descripcion, fotoBuffer, principal, id_predio, certificado = false) => {
    // Convertir principal y certificado a booleanos para asegurar consistencia
    const isPrincipal = principal === 'true' || principal === true;
    const isCertificado = certificado === 'true' || certificado === true;
    
    console.log(`Insertando foto: principal=${isPrincipal}, certificado=${isCertificado}`);
    
    const query = `
        INSERT INTO public.catastro_foto_predio (descripcion, foto, principal, id_predio, certificado, fecha_registro)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING id_foto;
    `;

    const values = [descripcion, fotoBuffer, isPrincipal, id_predio, isCertificado];

    try {
        const result = await db.query(query, values);
        console.log('✅ Foto insertada con éxito, ID:', result.rows[0].id_foto);
        return result.rows[0];
    } catch (err) {
        console.error('❌ Error al insertar la foto:', err.message);
        throw new Error('Error al insertar la foto en la base de datos');
    }
};


// Función para actualizar un registro en la tabla de Fotos de Predio
const updateFotoPredio = async (id, data) => {
    const query = `
        UPDATE public.catastro_foto_predio
        SET descripcion = $1,
            foto = COALESCE($2, foto),
            principal = $3,
            id_predio = $4,
            fecha_registro = $5,
            digitador = $6,
            actualizador = $7,
            fecha_actualizacion_aud = $8,
            certificado = $9
        WHERE id_foto = $10
        RETURNING *;
    `;
    const values = [
        data.descripcion,              
        data.foto,                     
        data.principal,                
        data.id_predio,                
        data.fecha_registro,           
        data.digitador,                
        data.actualizador,             
        data.fecha_actualizacion_aud,  
        data.certificado,              
        id                             
    ];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para recuperar un registro de la tabla de Fotos de Predio por id
const getFotoPredioById = async (id) => {
    const query = `
        SELECT * FROM public.catastro_foto_predio
        WHERE id_foto = $1;
    `;
    const values = [id];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para recuperar registros de la tabla de Fotos de Predio por id_predio
const getFotoPredioByIdPredio = async (id_predio) => {
    const query = `
        SELECT id_foto, descripcion, principal, 
            CASE WHEN foto IS NOT NULL THEN encode(foto, 'base64') ELSE NULL END AS foto,
            certificado
        FROM public.catastro_foto_predio
        WHERE id_predio = $1
        ORDER BY principal DESC, id_foto DESC;
    `;
    
    const values = [id_predio];

    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            console.warn(`⚠ No se encontraron fotos para id_predio: ${id_predio}`);
        }
        return result.rows;
    } catch (err) {
        console.error('❌ Error al ejecutar la consulta getFotoPredioByIdPredio:', err.message);
        throw new Error('Error al recuperar fotos del predio');
    }
};


// Función para eliminar un registro de la tabla de Fotos de Predio por id
const deleteFotoPredioById = async (id) => {
    const query = `
        DELETE FROM public.catastro_foto_predio
        WHERE id_foto = $1
        RETURNING *;
    `;
    const values = [id];

    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            console.warn(`⚠ No se encontró ninguna foto con id: ${id}`);
            return null;
        }
        console.log(`✅ Foto con id: ${id} eliminada con éxito`);
        return result.rows[0];
    } catch (err) {
        console.error(`❌ Error al eliminar la foto con id: ${id}`, err.message);
        throw new Error('Error al eliminar la foto en la base de datos');
    }
};

// Función para recuperar un registro de la tabla de Fotos de Predio por id
const getFotoPredioCertificadoById = async (id) => {
    const query = `
        SELECT id_foto, foto, descripcion 
        FROM public.catastro_foto_predio
        WHERE id_predio = $1
          AND principal = false
          AND certificado = true;
    `;
    const values = [id];
    try {
        const result = await db.query(query, values);
        return result.rows; // <-- Esto es un array (puede ser vacío)
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};


module.exports = {
    insertFotoPredio,
    updateFotoPredio,
    getFotoPredioById,
    getFotoPredioByIdPredio,
    deleteFotoPredioById,
    getFotoPredioCertificadoById
};



