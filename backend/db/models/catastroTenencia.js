// db/models/catastroTenencia.js
const db = require('../config');

// Función para insertar un registro en la tabla `Catastro Tenencia`
const insertCatastroTenencia = async (data) => {
    const query = ` INSERT INTO public.catastro_tenencia(
                        id_predio, permite_ingreso, presenta_escritura, asentamiento_de_hecho, conflicto, 
                        porcentaje_participacion, id_forma_propiedad, id_propietario, id_prov_protocol,
                        id_can_protocol, fecha_inscripcion, numero_notaria, area_registro, id_unidad,
                        id_provincia, id_canton, fecha_escritura, repertorio, folio, numero_registro,
                        lindero_norte, lindero_sur, lindero_este, lindero_oeste, propietario_anterior,
                        utilidad_publica, representante
                    )VALUES ( 
                        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                        $11, $12, $13, $14, $15, $16, $17, $18, $19,
                        $20, $21, $22, $23, $24, $25, $26, $27) RETURNING id_tenencia;`;
    const values = [
        data.id_predio,
        data.permite_ingreso, data.presenta_escritura, data.asentamiento_de_hecho,
        data.conflicto, data.porcentaje_participacion, data.id_forma_propiedad,
        data.id_propietario, data.id_prov_protocol, data.id_can_protocol,
        data.fecha_inscripcion, data.numero_notaria, data.area_registro,
        data.id_unidad, data.id_provincia, data.id_canton, data.fecha_escritura,
        data.repertorio, data.folio, data.numero_registro, data.lindero_norte,
        data.lindero_sur, data.lindero_este, data.lindero_oeste, data.propietario_anterior,
        data.utilidad_publica, data.representante
    ];

    // Validar que los valores no sean vacíos para los campos que esperan enteros
    const integerFields = [
        'id_predio','permite_ingreso', 'presenta_escritura', 'asentamiento_de_hecho', 'conflicto', 'porcentaje_participacion', 'id_forma_propiedad', 'id_propietario', 'id_prov_protocol', 'id_can_protocol', 'area_registro', 'id_unidad', 'id_provincia', 'id_canton', 'repertorio', 'folio', 'numero_registro'
    ];

    for (const field of integerFields) {
        if (data[field] === undefined) {
            console.error(`Error: El campo ${field} no puede ser vacío, nulo o indefinido.`);
            throw new Error(`El campo ${field} no puede ser vacío, nulo o indefinido.`);
        }
    }

    try {console.log('Valores a insertar:', values);
        const result = await db.query(query, values);
        return result.rows[0].id_tenencia;
    } catch (err) {
        if (err.code) {
            switch (err.code) {
                case '23505': // unique_violation
                    console.error('Error: Duplicate key value violates unique constraint', err.detail);
                    break;
                case '23503': // foreign_key_violation
                    console.error('Error: Foreign key violation', err.detail);
                    break;
                case '22P02': // invalid_text_representation
                    console.error('Error: Invalid input syntax for integer', err.message);
                    break;
                default:
                    console.error('Database error', err.message);
            }
        } else {
            console.error('Error executing query', err.stack);
            throw err;
        }
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
};

// Función para actualizar un registro en la tabla `Catastro Tenencia`
const updateCatastroTenencia = async (id, data) => {
    const query = ` UPDATE public.catastro_tenencia
                    SET permite_ingreso = $1, presenta_escritura = $2, asentamiento_de_hecho = $3, conflicto = $4,
                        porcentaje_participacion = $5, id_forma_propiedad = $6, id_propietario = $7, id_prov_protocol = $8,
                        id_can_protocol = $9, fecha_inscripcion = $10, numero_notaria = $11, area_registro = $12,
                        id_unidad = $13, id_provincia = $14, id_canton = $15, fecha_escritura = $16, repertorio = $17,
                        folio = $18, numero_registro = $19, lindero_norte = $20, lindero_sur = $21, lindero_este = $22,
                        lindero_oeste = $23, propietario_anterior = $24, utilidad_publica = $25, representante = $26
                    WHERE id_tenencia = $27 RETURNING *;`;
    const values = [
        data.permite_ingreso, data.presenta_escritura, data.asentamiento_de_hecho,
        data.conflicto, data.porcentaje_participacion, data.id_forma_propiedad,
        data.id_propietario, data.id_prov_protocol, data.id_can_protocol,
        data.fecha_inscripcion, data.numero_notaria, data.area_registro,
        data.id_unidad, data.id_provincia, data.id_canton, data.fecha_escritura,
        data.repertorio, data.folio, data.numero_registro, data.lindero_norte,
        data.lindero_sur, data.lindero_este, data.lindero_oeste, data.propietario_anterior,
        data.utilidad_publica, data.representante, id
    ];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para obtener un registro de la tabla `Catastro Tenencia`
const getCatastroTenenciaById = async (id) => {
    const query = `SELECT * FROM public.catastro_tenencia WHERE id_tenencia = $1;`;
    const values = [id];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para obtener todos los registros de la tabla `Catastro Tenencia`
const getListadoTenenciaByPredio  = async (id) => {
    const query = `SELECT   id_tenencia, nombres, numero_documento, presenta_escritura, forma_propiedad,  tipo_persona,
                            porcentaje_participacion, regimen_propiedad, representante, utilidad_publica
                    FROM reporte_ficha.ficha_tenencia WHERE id_predio = $1 ORDER BY id_tenencia;`;
    const values = [id];

    try {
        const result = await db.query(query, values);
        return result.rows;
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para obtener el porcentaje acumulado de participación por predio
const getPorcentajeAcumuladoByPredio = async (id_predio, id_tenencia_excluir = null) => {
    let query = `
        SELECT COALESCE(SUM(porcentaje_participacion), 0) as total_porcentaje
        FROM public.catastro_tenencia
        WHERE id_predio = $1
    `;
    
    const values = [id_predio];
    
    // Si se proporciona un ID de tenencia para excluir (ej: cuando estamos actualizando)
    if (id_tenencia_excluir) {
        query += ` AND id_tenencia != $2`;
        values.push(id_tenencia_excluir);
    }
    
    try {
        const result = await db.query(query, values);
        return parseFloat(result.rows[0].total_porcentaje);
    } catch (err) {
        console.error('Error al obtener porcentaje acumulado:', err.stack);
        throw err;
    }
};

// Función para obtener los datos de una tenencia por id_tenencia
const getTenenciaById = async (id_tenencia) => {
    const query = `SELECT id_predio, permite_ingreso, presenta_escritura,
                        asentamiento_de_hecho, conflicto, 
                        porcentaje_participacion, id_forma_propiedad, id_propietario, id_prov_protocol,
                        id_can_protocol, fecha_inscripcion, numero_notaria, area_registro, id_unidad,
                        id_provincia, id_canton, fecha_escritura, repertorio, folio, numero_registro,
                        lindero_norte, lindero_sur, lindero_este, lindero_oeste, propietario_anterior FROM catastro_tenencia 
                    WHERE id_tenencia = $1 ORDER BY id_tenencia;`;
    const values = [id_tenencia];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err;
    }
};

// Función para eliminar un registro de la tabla de tenencia por id
const deleteCatastroTenencia = async (id) => {
    const query = `
        DELETE FROM public.catastro_tenencia WHERE id_tenencia = $1 RETURNING id_tenencia;
    `;
    const values = [id];

    try {
        const result = await db.query(query, values);
        if (result.rowCount === 0) {
            console.warn(`⚠ No se encontró ninguna tenencia con id: ${id}`);
            return null;
        }
        console.log(`✅ Tenencia con id: ${id} eliminada con éxito`);
        return result.rows[0];
    } catch (err) {
        console.error(`❌ Error al eliminar la tenencia con id: ${id}`, err.message);
        throw new Error('Error al eliminar la tenencia en la base de datos');
    }
};

// Inserta múltiples tenencias con solo campos esenciales
const insertMultiplesTenenciasBasicas = async (tenencias) => {
  const query = `
    INSERT INTO public.catastro_tenencia (
      id_predio, id_propietario, porcentaje_participacion, representante
    ) VALUES
    ${tenencias.map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(', ')}
    RETURNING id_tenencia;
  `;

  const values = tenencias.flatMap(t => [
    t.id_predio,
    t.id_propietario,
    t.porcentaje_participacion,
    t.representante
  ]);

  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (err) {
    console.error('❌ Error al insertar varias tenencias:', err.message);
    throw err;
  }
};


module.exports = {
    insertCatastroTenencia,
    updateCatastroTenencia,
    getCatastroTenenciaById,
    getListadoTenenciaByPredio, 
    getTenenciaById,
    deleteCatastroTenencia,
    insertMultiplesTenenciasBasicas,
    getPorcentajeAcumuladoByPredio
}