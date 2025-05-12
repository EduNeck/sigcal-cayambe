const db = require('../config');

// Función para insertar un registro en la tabla `Catastro Bloques`
const insertCatastroBloques = async (data) => {
    const query = `INSERT INTO public.catastro_bloques(
                        id_predio, cod_uni, cod_bloq, cod_piso, id_tipo_piso, id_condicion_fisica, id_estado_conservacion, id_condicion_patrimonial, id_ocupacion, anio_construccion, anio_restauracion, area_construida, id_instalaciones_especiales, id_estructura, id_paredes, id_cubierta, id_acabados_vivienda, id_revestimiento_paredes, id_revestimiento_cubierta, id_marco_ventanas, id_vidrios, id_puertas, permiso_construccion, fecha_registro, digitador, actualizador, fecha_actualizacion_aud, id_tipologia, lista_instalaciones, id_clasificacion_vivienda, id_tipo_vivienda, id_condicion_ocupacion, numero_habitaciones, id_propiedad_posesion, id_pisos, id_tumbado, id_ventanas, num_banios, num_medio_banios, id_instalaciones_electricas, cuen, id_valor_cultural, numero_habitantes, codigo_vivienda, id_mamposteria, id_entrepiso, id_escaleras
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47
                    ) RETURNING id_bloques;`;
    const values = [
        data.id_predio, data.cod_uni, data.cod_bloq, data.cod_piso, data.id_tipo_piso, data.id_condicion_fisica, data.id_estado_conservacion, data.id_condicion_patrimonial, data.id_ocupacion, data.anio_construccion, data.anio_restauracion, data.area_construida, data.id_instalaciones_especiales, data.id_estructura, data.id_paredes, data.id_cubierta, data.id_acabados_vivienda, data.id_revestimiento_paredes, data.id_revestimiento_cubierta, data.id_marco_ventanas, data.id_vidrios, data.id_puertas, data.permiso_construccion, data.fecha_registro, data.digitador, data.actualizador, data.fecha_actualizacion_aud, data.id_tipologia, data.lista_instalaciones, data.id_clasificacion_vivienda, data.id_tipo_vivienda, data.id_condicion_ocupacion, data.numero_habitaciones, data.id_propiedad_posesion, data.id_pisos, data.id_tumbado, data.id_ventanas, data.num_banios, data.num_medio_banios, data.id_instalaciones_electricas, data.cuen, data.id_valor_cultural, data.numero_habitantes, data.codigo_vivienda, data.id_mamposteria, data.id_entrepiso, data.id_escaleras
    ];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para actualizar un registro en la tabla `Catastro Bloques`
const updateCatastroBloques = async (id, data) => {
    const query = `UPDATE public.catastro_bloques
                    SET id_predio = $1, cod_uni = $2, cod_bloq = $3, cod_piso = $4, id_tipo_piso = $5, cuen = $6, id_condicion_fisica = $7, id_estado_conservacion = $8, id_condicion_patrimonial = $9, anio_construccion = $10, anio_restauracion = $11, area_construida = $12, id_ocupacion = $13, id_estructura = $14, id_paredes = $15, id_cubierta = $16, id_acabados_vivienda = $17, id_revestimiento_paredes = $18, id_revestimiento_cubierta = $19, id_marco_ventanas = $20, id_vidrios = $21, id_puertas = $22, permiso_construccion = $23
                    WHERE id_bloques = $24 RETURNING *;`;
    const values = [
        data.id_predio, data.cod_uni, data.cod_bloq, data.cod_piso, data.id_tipo_piso, data.cuen, data.id_condicion_fisica, data.id_estado_conservacion, data.id_condicion_patrimonial, data.anio_construccion, data.anio_restauracion, data.area_construida, data.id_ocupacion, data.id_estructura, data.id_paredes, data.id_cubierta, data.id_acabados_vivienda, data.id_revestimiento_paredes, data.id_revestimiento_cubierta, data.id_marco_ventanas, data.id_vidrios, data.id_puertas, data.permiso_construccion, id
    ];

    try {
        console.log('Valores a actualizar:', values);
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para obtener un registro de la tabla `Catastro Bloques` por id de bloque
const getCatastroBloquesById = async (id) => {
    const query = `SELECT * FROM public.catastro_bloques WHERE id_bloques = $1;`;
    const values = [id];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para obtener todos los registros de la tabla `Catastro Bloques` por id_predio
const getCatastroBloquesByIdPredio = async (id_predio) => {
    const query = `SELECT * FROM public.catastro_bloques WHERE id_predio = $1;`;
    const values = [id_predio];
    try {
        const result = await db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

//  Función para obtener todos los registros de la vista `vista_bloques_completa` por id_predio
const getCatastroVistaBloquesByIdPredio = async (id_predio) => {
    const query = `SELECT * FROM public.vista_bloques_completa WHERE id_predio = $1;`;
    const values = [id_predio];
    try {
        const result = await db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para eliminar un registro de la tabla de bloques por id
const deleteCatastroBloquesById = async (id) => {
    const query = `
        DELETE FROM public.catastro_bloques WHERE id_bloques = $1 RETURNING *;
    `;
    const values = [id];

    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            console.warn(`⚠ No se encontró ningun bloque con id: ${id}`);
            return null;
        }
        console.log(`✅ bloque con id: ${id} eliminada con éxito`);
        return result.rows[0];
    } catch (err) {
        console.error(`❌ Error al eliminar el bloque con id: ${id}`, err.message);
        throw new Error('Error al eliminar el bloque en la base de datos');
    }
};


module.exports = {
    insertCatastroBloques,
    updateCatastroBloques,
    getCatastroBloquesById,
    getCatastroBloquesByIdPredio,
    getCatastroVistaBloquesByIdPredio,
    deleteCatastroBloquesById
};