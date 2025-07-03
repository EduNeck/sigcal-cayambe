// db/models/cemTipoProyectos
const db = require('../config');

console.log('Modelo cemTipoProyecto cargado');

    // Obtener todos los tipos de proyecto
    const obtieneProyectos = async () => {
        const query = 'SELECT cem_id_tipo_proyecto, descripcion FROM cem.cem_tipo_proyecto';
        try {
            console.log('🔍 Ejecutando query:', query);
            const result = await db.query(query);
            console.log('✅ Resultado query:', result.rows);
            return result.rows;
        } catch (error) {
            console.error('❌ Error en obtieneProyectos cemTipoProyecto:', error);
            console.error('📑 Stack:', error.stack);
            throw error;
        }
    };

    // Obtener un tipo de proyecto por ID
    const proyectosById = async (id) => {
        const query = 'SELECT cem_id_tipo_proyecto, descripcion FROM cem.cem_tipo_proyecto WHERE cem_id_tipo_proyecto = $1';
        try {
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error en proyectosById cemTipoProyecto:', error);
            throw error;
        }
    };

    // Crear un nuevo tipo de proyecto
    const insertaProyecto = async (descripcion) => {
        const query = 'INSERT INTO cem.cem_tipo_proyecto (descripcion) VALUES ($1) RETURNING cem_id_tipo_proyecto, descripcion';
        try {
            const result = await db.query(query, [descripcion]);
            return result.rows[0];
        } catch (error) {
            console.error('Error en insertaProyecto cemTipoProyecto:', error);
            throw error;
        }
    };

    // Actualizar un tipo de proyecto
    const actualizaProyecto = async (id, descripcion) => {
        const query = 'UPDATE cem.cem_tipo_proyecto SET descripcion = $1 WHERE cem_id_tipo_proyecto = $2 RETURNING cem_id_tipo_proyecto, descripcion';
        try {
            const result = await db.query(query, [descripcion, id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error en actualizaProyecto cemTipoProyecto:', error);
            throw error;
        }
    };

    // Eliminar un tipo de proyecto
    const eliminaProyecto = async (id) => {
        const query = 'DELETE FROM cem.cem_tipo_proyecto WHERE cem_id_tipo_proyecto = $1 RETURNING cem_id_tipo_proyecto';
        try {
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error en eliminaProyecto cemTipoProyecto:', error);
            throw error;
        }
    };


module.exports = {   
    obtieneProyectos,
    proyectosById,
    insertaProyecto,
    actualizaProyecto,
    eliminaProyecto
};
