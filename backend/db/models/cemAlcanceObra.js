const pool = require('../config');

const CemAlcanceObra = {
    // Obtener todos los alcances de obra
    obtenerAlcances: async () => {
        try {
            const query = `
                SELECT 
                    cem_alcance_id, 
                    descripcion
                FROM cem.cem_alcance_obra
                ORDER BY cem_alcance_id;
            `;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener alcances de obra:', error);
            throw error;
        }
    },

    // Obtener un alcance de obra por ID
    obtenerAlcancePorId: async (id) => {
        try {
            const query = `
                SELECT 
                    cem_alcance_id, 
                    descripcion
                FROM cem.cem_alcance_obra
                WHERE cem_alcance_id = $1;
            `;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al obtener alcance de obra por ID:', error);
            throw error;
        }
    },

    // Crear un nuevo alcance de obra
    crearAlcance: async (descripcion) => {
        try {
            const query = `
                INSERT INTO cem.cem_alcance_obra (descripcion)
                VALUES ($1)
                RETURNING cem_alcance_id, descripcion;
            `;
            const result = await pool.query(query, [descripcion]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear alcance de obra:', error);
            throw error;
        }
    },

    // Actualizar un alcance de obra
    actualizarAlcance: async (id, descripcion) => {
        try {
            const query = `
                UPDATE cem.cem_alcance_obra
                SET descripcion = $2
                WHERE cem_alcance_id = $1
                RETURNING cem_alcance_id, descripcion;
            `;
            const result = await pool.query(query, [id, descripcion]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al actualizar alcance de obra:', error);
            throw error;
        }
    },

    // Eliminar un alcance de obra
    eliminarAlcance: async (id) => {
        try {
            const query = `
                DELETE FROM cem.cem_alcance_obra
                WHERE cem_alcance_id = $1
                RETURNING cem_alcance_id;
            `;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al eliminar alcance de obra:', error);
            throw error;
        }
    }
};

module.exports = CemAlcanceObra;
