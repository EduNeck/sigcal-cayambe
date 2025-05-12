// db/models/valoracion.js
const db = require('../config');

// Función para obtener todos los registros de la tabla `valoracion Suelo Cal`
const getAllValSueloCal = async () => {
    const query = `
     SELECT id,cod_cat,area_dibujo, area_parcial,predio_zona, cod_zon, nombre, anio,
            valor1, valor2, valor3, valor4, valor5, areatipo, frentetipo, fondotipo, tipo_zona,
            fecha_proceso, usuario, area_grafica, frente_relativo, fondo_relativo, id_alfa,
            ftam, forma, fforma, localizacion, floc, ffrente, ffondo, acceso, facceso, agua,
            fagua, alcantarillado, falcantarillado, energia, fenergia, telefono, ftelefono,
            celular, fcelular, internet, finternet, uso, fuso, fcorreccion, valor_parcial,
            numero_frentes, riego,friego, ocupacion,focupacion, topografia, ftopografia 
    FROM valoracion.val_suelo_calc;`;
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

// Función para obtener todos los registros de la tabla `valoracion Mejoras Cal`
const getAllValMejorasCal = async () => {
    const query = `
    SELECT  id_mejoras, id_predio, clave_catastral, tipo_zona,
            id_obra, obra, valor_unitario, cantidad, id_estado, estado, factor_estado,
            valor, anio_val, fecha_proceso, usuario 
    FROM valoracion.val_mejoras_calc;`;
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

// Función para obtener todos los registros de la tabla `predio_resultado_urb`
const getAllPredioResultadoUrb = async () => {
    const query = `
    SELECT 
        id, id_predio, clave_catastral, anio_val, fecha_proceso,
        procesador, tipo_zona, area_grafica, valor_suelo, area_construida,
        valor_construcciones, valor_adicionales, valor_predio, tipo_prop, alicuota     
    FROM valoracion.val_total;`;
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

// Función para obtener todos los registros de la vista `vista_patrimonio_urbano`
const getAllValoresPatrimonio = async () => {
    const query = `
    SELECT
        tipo_predio, ph, clave_catastral, clave_anterior, parroquia,
        numero_documento, alicuota, porcentaje_participacion, area_suelo_porcentual,
        area_construcciones_porcentual, valor_suelo_porcentual, valor_construcciones_porcentual,
        valor_instalaciones_porcentual, valor_adicionales_porcentual, avaluo_predio_porcentual,
        anio_proceso, id_tenencia_propiedad, id_predio, propietario, fecha_proceso
    FROM
        valores_reportes.vista_patrimonio_urbano;`;
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

// Función para obtener todos los registros de la tabla `val_tipologia`
const getAllTipologiaUrb = async () => {
    const query = `
    SELECT
        id, tipo_zona,nombre, anio, vida_util_edificios, 
        residual_edificios, vida_util_casas, residual_casas
    FROM
        valoracion.val_tipologia;`;
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

// Función para obtener todos los registros de la tabla `val_factor_tamanio`
const getAllFactorTamanioUrb = async () => {
    const query = `
    SELECT
        codigo, descripcion, desde, hasta, factor, tipo_predio
    FROM
        valoracion.val_factor_tamanio;`;
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

// Función para obtener todos los registros de la tabla `val_fito_corvini`
const getAllFittoCorvini = async () => {
    const query = `
    SELECT id, desde, hasta, estado, factor
    FROM valoracion.val_fito_corvini;`;
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

//  Función para obtener todos los registros de la tabla `valores_comerciales.val_comerciales_peritajes`
const getAllValoresComercialesPeritaje = async () => {
    const query = `
    SELECT id_comercial, valor_suelo, valor_construcciones, valor_adicionales, 
        valor_especiales, valor_total, fecha_registro, usuario, observaciones, 
        mandatorio, tipo, id_tenencia
    FROM valores_comerciales.val_comerciales_peritajes; `;
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

// Función para ejecutar las consultas proporcionadas con parámetros
const ejecutaValoracion = async (pr_anio, var_tipo, pr_clave, var_usuario) => {
    const queries = [
        'SELECT valoracion.val_asigna_zona_valor($1, $2, $3, $4)',
        'SELECT valoracion.val_agrega_factores_suelo($1, $2, $3)',
        'SELECT valoracion.val_mejoras_valor($1, $2, $3, $4)',
        'SELECT valoracion.val_piso_valor($1, $2, $3, $4)',
        'SELECT valoracion.val_piso_asigna_tipologia($1, $2, $3)',
        'SELECT valoracion.val_piso_factor($1, $2, $3)',
        'SELECT valoracion.val_total_calc($1, $2, $3, $4)',
        'SELECT valores_reportes.inserta_patrimonio_urbano($1, $2, $3)'
    ];

    try {
        for (const query of queries) {
            if (query.includes('$4')) {
                await db.query(query, [pr_anio, var_tipo, pr_clave, var_usuario]);
            } else {
                await db.query(query, [pr_anio, var_tipo, pr_clave]);
            }
        }
        console.log('All queries executed successfully');
    } catch (err) {
        console.error('Error executing queries', err.stack);
        throw err;
    }
}

// Función para obtener todos los registros de la tabla `certificado_catastral_geografico`
const certificadoCatastralGeografico = async ( codigo ) => {
    const query = ` SELECT id, tipo_predio, ph, clave_catastral, clave_anterior, parroquia, numero_documento, alicuota, porcentaje_participacion, area_suelo_porcentual, area_construcciones_porcentual, valor_suelo_porcentual, valor_construcciones_porcentual, valor_instalaciones_porcentual, valor_adicionales_porcentual, avaluo_predio_porcentual, anio_proceso, propietario, id_predio, fecha_proceso, eje_principal, eje_secundario, sector, observaciones, fecha_actualizacion, tipo_persona, personeria, este, norte, boundxmax, boundymax, boundxmin, boundymin, poligono, parroquia_nombre, tipo, foto, id_tenencia_propiedad, observacion_ficha, area_terreno, area_comun_terreno, id_unidad_area, coordenada_x, coordenada_y, lindero_norte, lindero_sur, lindero_este, lindero_oeste, codigo_certificado, usuario, fecha_certificado, estado, id_regimen_propiedad FROM geo_vistas.certificado_catastral_geografico WHERE codigo_certificado = $1;`;
    try {
        const result = await db.query(query, [codigo]);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}

const insertaCertificadoCatastral = async ( tipo, anio, clave, usuario, codigo ) => {
    const query = `SELECT geo_vistas.certificado_carastral_geofrafico($1, $2, $3, $4, $5);`;
    try {
        const result = await db.query(query, [tipo, anio, clave, usuario, codigo]);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
}



module.exports = {
    getAllValSueloCal,
    getAllValMejorasCal,
    getAllPredioResultadoUrb,
    getAllValoresPatrimonio,
    getAllTipologiaUrb,
    getAllFactorTamanioUrb,
    getAllFittoCorvini,
    getAllValoresComercialesPeritaje,
    ejecutaValoracion,
    certificadoCatastralGeografico,
    insertaCertificadoCatastral
};