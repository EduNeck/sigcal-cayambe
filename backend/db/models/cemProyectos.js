const db = require('../config');

const cemProyectos = {
    // Obtener todos los proyectos
    obtieneProyectos: async () => {
        const query = `SELECT 
                cem_proyecto_id, 
                cem_nombre, 
                cem_id_tipo_proyecto, 
                cem_base_calculo, 
                cem_porc_subsidio, 
                cem_plazo_retorno_anios,
                cem_fecha_registro, 
                cem_proyecto_finalizado, 
                cem_anio_inicio_obligaciones,
                cem_base_imponible, 
                cem_anio_finalizacion_obligaciones, 
                cem_valor_anualizado,
                cem_anio_inicio_obra, 
                cem_alcance_id, 
                cem_porc_frente, 
                cem_porc_avaluo, 
                cem_usuario_sistema
            FROM cem.cem_proyectos`;
        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error en getAll cemProyectos:', error);
            throw error;
        }
    },

    // Obtener un proyecto por ID
    proyectoById: async (id) => {
        const query = `SELECT 
            cem_proyecto_id, 
            cem_nombre, 
            cem_id_tipo_proyecto, 
            cem_base_calculo, 
            cem_porc_subsidio, 
            cem_plazo_retorno_anios,
            cem_fecha_registro, 
            cem_proyecto_finalizado, 
            cem_anio_inicio_obligaciones,
            cem_base_imponible, 
            cem_anio_finalizacion_obligaciones, 
            cem_valor_anualizado,
            cem_anio_inicio_obra, 
            cem_alcance_id, 
            cem_porc_frente, 
            cem_porc_avaluo, 
            cem_usuario_sistema
        FROM cem.cem_proyectos 
        WHERE cem_proyecto_id = $1`;
        try {
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error en getById cemProyectos:', error);
            throw error;
        }
    },

    // Crear un nuevo proyecto
    insertaProyecto: async (proyecto) => {
        const query = `INSERT INTO cem.cem_proyectos (
            cem_nombre, 
            cem_id_tipo_proyecto, 
            cem_base_calculo, 
            cem_porc_subsidio, 
            cem_plazo_retorno_anios,
            cem_fecha_registro, 
            cem_proyecto_finalizado, 
            cem_anio_inicio_obligaciones,
            cem_base_imponible, 
            cem_anio_finalizacion_obligaciones, 
            cem_valor_anualizado,
            cem_anio_inicio_obra, 
            cem_alcance_id, 
            cem_porc_frente, 
            cem_porc_avaluo, 
            cem_usuario_sistema
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        ) RETURNING *`;
        try {
            const values = [
                proyecto.cem_nombre,
                proyecto.cem_id_tipo_proyecto,
                proyecto.cem_base_calculo,
                proyecto.cem_porc_subsidio,
                proyecto.cem_plazo_retorno_anios,
                proyecto.cem_fecha_registro,
                proyecto.cem_proyecto_finalizado,
                proyecto.cem_anio_inicio_obligaciones,
                proyecto.cem_base_imponible,
                proyecto.cem_anio_finalizacion_obligaciones,
                proyecto.cem_valor_anualizado,
                proyecto.cem_anio_inicio_obra,
                proyecto.cem_alcance_id,
                proyecto.cem_porc_frente,
                proyecto.cem_porc_avaluo,
                proyecto.cem_usuario_sistema
            ];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error en create cemProyectos:', error);
            throw error;
        }
    },

    // Actualizar un proyecto
    actualizaProyecto: async (id, proyecto) => {
        const query = `UPDATE cem.cem_proyectos SET
            cem_nombre = $1,
            cem_id_tipo_proyecto = $2,
            cem_base_calculo = $3,
            cem_porc_subsidio = $4,
            cem_plazo_retorno_anios = $5,
            cem_fecha_registro = $6,
            cem_proyecto_finalizado = $7,
            cem_anio_inicio_obligaciones = $8,
            cem_base_imponible = $9,
            cem_anio_finalizacion_obligaciones = $10,
            cem_valor_anualizado = $11,
            cem_anio_inicio_obra = $12,
            cem_alcance_id = $13,
            cem_porc_frente = $14,
            cem_porc_avaluo = $15,
            cem_usuario_sistema = $16
        WHERE cem_proyecto_id = $17
        RETURNING *`;
        try {
            const values = [
                proyecto.cem_nombre,
                proyecto.cem_id_tipo_proyecto,
                proyecto.cem_base_calculo,
                proyecto.cem_porc_subsidio,
                proyecto.cem_plazo_retorno_anios,
                proyecto.cem_fecha_registro,
                proyecto.cem_proyecto_finalizado,
                proyecto.cem_anio_inicio_obligaciones,
                proyecto.cem_base_imponible,
                proyecto.cem_anio_finalizacion_obligaciones,
                proyecto.cem_valor_anualizado,
                proyecto.cem_anio_inicio_obra,
                proyecto.cem_alcance_id,
                proyecto.cem_porc_frente,
                proyecto.cem_porc_avaluo,
                proyecto.cem_usuario_sistema,
                id
            ];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error en update cemProyectos:', error);
            throw error;
        }
    },

    // Eliminar un proyecto
    eliminaProyecto: async (id) => {
        const query = 'DELETE FROM cem.cem_proyectos WHERE cem_proyecto_id = $1 RETURNING cem_proyecto_id';
        try {
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error en delete cemProyectos:', error);
            throw error;
        }
    }
};

module.exports = cemProyectos;
