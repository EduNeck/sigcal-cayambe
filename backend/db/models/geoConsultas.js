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

// Recupera Área de Bloque
const getAreaBloque = async (codCat, numBloq, numPiso, codUni, tipoPiso, tipoZona) => {
    const query = `SELECT area 
                   FROM public.geo_bloque 
                   WHERE cod_cat = $1 
                   AND num_bloq = $2 
                   AND num_piso = $3 
                   AND cod_uni = $4 
                   AND tipo_piso = $5 
                   AND tipo_zona = $6`;
    const values = [codCat, numBloq, numPiso, codUni, tipoPiso, tipoZona];
    try {
        const result = await db.query(query, values);
        // Verificar si se encontró un resultado
        if (result.rows.length > 0) {
            return result.rows[0].area || 0; // Devuelve el área o 0 si es null
        } else {
            console.warn(`No se encontró área para el bloque con parámetros: cod_cat=${codCat}, num_bloq=${numBloq}, num_piso=${numPiso}, cod_uni=${codUni}, tipo_piso=${tipoPiso}, tipo_zona=${tipoZona}`);
            return 0; // Devuelve 0 si no hay resultados
        }
    } catch (err) {
        console.error('Error ejecutando la consulta getAreaBloque:', err.stack);
        return 0; // Devuelve 0 en caso de error
    }
};

module.exports = {
    getAreaPredio,
    getAreaBloque
};