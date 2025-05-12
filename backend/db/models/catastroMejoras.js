const db = require('../config');

// Función para insertar un registro en la tabla `catastro_obras_mejoras`
const insertaMejoras = async (data) => {
    const query = `INSERT INTO public.catastro_obras_mejoras(
                        id_tipo_obra, id_material, area, id_estado, id_predio, id_condicion_fisica, anio_construccion
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7
                    ) RETURNING id_mejoras;`;
    const values = [
        data.id_tipo_obra, data.id_material, data.area, data.id_estado, data.id_predio, data.id_condicion_fisica, data.anio_construccion
    ];

    try {
        console.log('Valores a insertar:', values);
        const result = await db.query(query, values);
        return result.rows[0].id_mejoras;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para actualizar un registro en la tabla `catastro_obras_mejoras`
const actualizaMejoras = async (id, data) => {
    const query = `UPDATE public.catastro_obras_mejoras
                    SET id_tipo_obra = $1, id_material = $2, area = $3, id_estado = $4, id_predio = $5, id_condicion_fisica = $6, anio_construccion = $7
                    WHERE id_mejoras = $8 RETURNING *;`;
    const values = [
        data.id_tipo_obra, data.id_material, data.area, data.id_estado, data.id_predio, data.id_condicion_fisica, data.anio_construccion, id
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

// Función para obtener un registro de la tabla `catastro_obras_mejoras` por `id_mejoras`
const recuperaMejorasByIdMejoras = async (id_mejoras) => {
    const query = `SELECT * FROM public.catastro_obras_mejoras WHERE id_mejoras = $1;`;
    const values = [id_mejoras];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para obtener todos los registros de la tabla `catastro_obras_mejoras` por `id_predio`
const recuperaMejorasByIdPredio = async (id_predio) => {
    const query = `SELECT * FROM public.catastro_obras_mejoras WHERE id_predio = $1;`;
    const values = [id_predio];
    try {
        const result = await db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para obtener todos los registros de la vista `vista_obras_mejoras_completa` por `id_predio`
const recuperaVistaMejorasByIdPredio = async (id_predio) => {
    const query = `SELECT * FROM public.vista_obras_mejoras_completa WHERE id_predio = $1 ORDER BY id_mejoras ASC;`;
    const values = [id_predio];
    try {
        const result = await db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para eliminar un registro de la tabla de Fotos de Mejoras por id
const eliminaMejoras = async (id) => {
    const query = ` DELETE FROM public.catastro_obras_mejoras WHERE id_mejoras = $1 RETURNING *;`;
    const values = [id];

    try {
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            console.warn(`⚠ No se encontró ningun Mejoras con id: ${id}`);
            return null;
        }
        console.log(`✅ Mejoras con id: ${id} eliminada con éxito`);
        return result.rows[0];
    } catch (err) {
        console.error(`❌ Error al eliminar el Mejoras con id: ${id}`, err.message);
        throw new Error('Error al eliminar el Mejoras en la base de datos');
    }
};

module.exports = {
    insertaMejoras,
    actualizaMejoras,
    recuperaMejorasByIdMejoras,
    recuperaMejorasByIdPredio,
    recuperaVistaMejorasByIdPredio,
    eliminaMejoras
};