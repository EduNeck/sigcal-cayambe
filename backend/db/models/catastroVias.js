const db = require('../config');

// Método para insertar datos en la tabla catastroVias
const insertCatastroVias = async (data) => {
    const query = `
        INSERT INTO public.catastro_vias (via_principal, via_secundaria, nombre_via, longitud, id_tipo_via, id_aceras_bordillos, id_predio, id_material_via, num_inmueble, codigo_via) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING id_vias`;
    const values = [
        data.via_principal, data.via_secundaria, data.nombre_via, data.longitud, data.id_tipo_via,
        data.id_aceras_bordillos, data.id_predio, data.id_material_via, data.num_inmueble, data.codigo_via
    ];

    const integerFields = [
        'via_principal', 'via_secundaria', 'nombre_via', 'longitud', 'id_tipo_via', 'id_aceras_bordillos', 'id_predio', 'id_material_via'
    ];

    for (const field of integerFields) {
        if (data[field] === '' || data[field] === null || data[field] === undefined) {
            console.error(`Error: El campo ${field} no puede ser vacío, nulo o indefinido.`);
            throw new Error(`El campo ${field} no puede ser vacío, nulo o indefinido.`);
        }
    }

    try {
        console.log('Valores a insertar:', values);
        const result = await db.query(query, values);
        return result.rows[0].id_vias;
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
            console.error('Database error', err.message);
        }
    }      
};

// Método para actualizar datos en la tabla catastroVias
const updateCatastroVias = async (id, data) => {
    const query = `
        UPDATE public.catastro_vias 
        SET via_principal = $1, via_secundaria = $2, nombre_via = $3, longitud = $4, id_tipo_via = $5, id_aceras_bordillos = $6, id_predio = $7, fecha_registro = $8, id_material_via = $9, num_inmueble = $10, codigo_via = $11
        WHERE id_vias = $12
        RETURNING *;
    `;
    const values = [
        data.via_principal, data.via_secundaria, data.nombre_via, data.longitud, data.id_tipo_via,
        data.id_aceras_bordillos, data.id_predio, data.fecha_registro, data.id_material_via, data.num_inmueble, data.codigo_via, id
    ];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error al actualizar los datos:', err.message);
        throw err;
    }  
    
};

// Método para obtener datos de la tabla catastroVias por id
const getCatastroViasById = async (id_predio) => {
    const query = ` SELECT * FROM public.catastro_vias WHERE id_predio = $1`;
    const values = [id_predio];
    try {
        const result = await db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error('Error al obtener los datos:', err.message);
        throw err;
    }
};

// Método para obtener datos de la tabla catastroVias por id_vias
const getCatastroViasByIdVias = async (id) => {
    const query = ` SELECT * FROM public.catastro_vias WHERE id_vias = $1`;
    const values = [id];
    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error al obtener los datos:', err.message);
        throw err;
    }
};

// Método para obtener datos de la vista vista_vias_completa por id_predio
const getCatastroVistaViasByPredio = async (id_predio) => {
    const query = `
        SELECT  id_vias, via_principal, via_secundaria, nombre_via, longitud, id_tipo_via, tipo_via, id_aceras_bordillos, 
                aceras_bordillos, id_material_via, material_via, num_inmueble, id_predio, fecha_registro, digitador, 
                actualizador, fecha_actualizacion_aud, codigo_via
        FROM public.vista_vias_completa
        WHERE id_predio = $1 ORDER BY id_vias ASC
    `;
    const values = [id_predio];
    try {
        const result = await db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error('Error al obtener los datos:', err.message);
        throw err;
    }
};

// Función para eliminar un registro de la tabla de Fotos de Predio por id
const deleteCatastroViasByIdVias = async (id) => {
    const query = `
        DELETE FROM public.catastro_vias WHERE id_vias = $1 RETURNING *;
    `;
    const values = [id];

    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            console.warn(`⚠ No se encontró ningun vias con id: ${id}`);
            return null;
        }
        console.log(`✅ vias con id: ${id} eliminada con éxito`);
        return result.rows[0];
    } catch (err) {
        console.error(`❌ Error al eliminar el vias con id: ${id}`, err.message);
        throw new Error('Error al eliminar el vias en la base de datos');
    }
};

module.exports = {
    insertCatastroVias,
    updateCatastroVias,
    getCatastroViasById,
    getCatastroViasByIdVias,
    getCatastroVistaViasByPredio,
    deleteCatastroViasByIdVias
};