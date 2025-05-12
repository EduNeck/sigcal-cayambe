// db/models/geoConsultas.js
const db = require('../config');

// Recupera Área de Predio
const getAreaPredio = async (codCat) => {
    const query = `SELECT area FROM public.geo_predio WHERE cod_cat = $1`;
    const values = [codCat];
    try {
        const result = await db.query(query, values);
        // Verificar si se encontró un resultado
        if (result.rows.length > 0) {
            return result.rows[0].area || 0; // Devuelve el área o 0 si es null
        } else {
            console.warn(`No se encontró área para el código catastral: ${codCat}`);
            return 0; // Devuelve 0 si no hay resultados
        }
    } catch (err) {
        console.error('Error ejecutando la consulta:', err.stack);
        return 0; // Devuelve 0 en caso de error
    }
};

module.exports = {
    getAreaPredio
};