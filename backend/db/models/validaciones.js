const db = require('../config');

// Función para obtener todos los datos de una vista con filtro opcional
const getVistaControlA = async (viewName, id_tipo_predio) => {
  let query = `SELECT * FROM validaciones.${viewName}`;
  const params = [];

  if (id_tipo_predio !== undefined) {
    query += ` WHERE id_tipo_predio = $1`;
    params.push(id_tipo_predio);
  }

  try {
    const result = await db.query(query, params);
    return result.rows;
  } catch (err) {
    console.error(`Error executing query for view ${viewName}`, err.stack);
    throw err;
  }
};

const getVistaControlB = async (viewName, tipo_zona) => {
    let query = `SELECT * FROM validaciones.${viewName}`;
    const params = [];
  
    if (tipo_zona !== undefined) {
      query += ` WHERE tipo_zona = $1`;
      params.push(tipo_zona);
    }
  
    try {
      const result = await db.query(query, params);
      return result.rows;
    } catch (err) {
      console.error(`Error executing query for view ${viewName}`, err.stack);
      throw err;
    }
  };

  const getVistaControlC = async (viewName, zona) => {
    let query = `SELECT * FROM validaciones.${viewName}`;
    const params = [];
  
    if (zona !== undefined) {
      query += ` WHERE zona = $1`;
      params.push(zona);
    }
  
    try {
      const result = await db.query(query, params);
      return result.rows;
    } catch (err) {
      console.error(`Error executing query for view ${viewName}`, err.stack);
      throw err;
    }
  };


  const getVistaControlD = async (viewName, tipo_predio) => {
    let query = `SELECT * FROM validaciones.${viewName}`;
    const params = [];
  
    if (tipo_predio !== undefined) {
      query += ` WHERE tipo_predio = $1`;
      params.push(tipo_predio);
    }
  
    try {
      const result = await db.query(query, params);
      return result.rows;
    } catch (err) {
      console.error(`Error executing query for view ${viewName}`, err.stack);
      throw err;
    }
  };

  const getVistaControlF = async (viewName) => {
    let query = `SELECT * FROM validaciones.${viewName}`;
    const params = [];
  
    try {
      const result = await db.query(query, params);
      return result.rows;
    } catch (err) {
      console.error(`Error executing query for view ${viewName}`, err.stack);
      throw err;
    }
  };




// Exportar funciones para cada vista
module.exports = {

  // Tipo Predio
  getVcontrolAlicuotasA: (id_tipo_predio) => getVistaControlA('vcontrol_alicuotas_a', id_tipo_predio),
  getVcontrolAlicuotasB: (id_tipo_predio) => getVistaControlA('vcontrol_alicuotas_b', id_tipo_predio),
  getVcontrolInconsistenciaAlicuotas: (id_tipo_predio) => getVistaControlA('vcontrol_inconsistencia_alicuotas', id_tipo_predio),
  getVcontrolPhSinFm: (id_tipo_predio) => getVistaControlA('vcontrol_ph_sin_fm', id_tipo_predio),
  getVcontrolPrediosConPorcentajeExedente: (id_tipo_predio) => getVistaControlA('vcontrol_predios_con_porcentaje_exedente', id_tipo_predio),
  getVcontrolPrediosSinGeometria: (id_tipo_predio) => getVistaControlA('vcontrol_predios_sin_geometria', id_tipo_predio),
  getVcontrolPrediosSinServicios: (id_tipo_predio) => getVistaControlA('vcontrol_predios_sin_servicios', id_tipo_predio),
  getVcontrolPrediosSinUso: (id_tipo_predio) => getVistaControlA('vcontrol_predios_sin_uso', id_tipo_predio),
  // Geometricas  
  getVcontrolBloquesGeometriasInvalidas: (tipo_zona) => getVistaControlB('vcontrol_bloques_geometrias_invalidas', tipo_zona),
  getVcontrolBloquesNoDigitados: (tipo_zona) => getVistaControlB('vcontrol_bloques_no_digitados', tipo_zona),
  getVcontrolBloquesSinGeometria: (tipo_zona) => getVistaControlB('vcontrol_bloques_sin_geometria', tipo_zona),
  getVcontrolFichasDigitadasPorUsuarioB: (tipo_zona) => getVistaControlB('vcontrol_fichas_digitadas_por_usuario_b', tipo_zona),
  getVcontrolPrediosGeometriasInvalidas: (tipo_zona) => getVistaControlB('vcontrol_predios_geometrias_invalidas', tipo_zona),
  getVcontrolPrediosNoDigitados: (tipo_zona) => getVistaControlB('vcontrol_predios_no_digitados', tipo_zona),
  getVcontrolPrediosSinVias: (tipo_zona) => getVistaControlB('vcontrol_predios_sin_vias', tipo_zona),
  // Zona
  getVcontrolBloquesUrb: (zona) => getVistaControlC('vcontrol_bloques_urb', zona),
  // Tipo Predio
  getVcontrolPrediosSinZonaValor: (tipo_predio) => getVistaControlD('vcontrol_predios_sin_zona_valor', tipo_predio),
  // Zona Predio
  getVcontrolGeoDiscrepanciaZonaValorTipoPredio: (tipo_zona_predio) => getVistaControlA('vcontrol_geo_discrepancia_zona_valor_tipo_predio', tipo_zona_predio),  
  // Sin Tipo Predio
  getVcontrolOverlapsBloques:() => getVistaControlF('vcontrol_overlaps_bloques'),
  getVcontrolOverlapsPredio: () => getVistaControlF('vcontrol_overlaps_predio'),
  getVcontrolOverlapsZonasValor: () => getVistaControlF('vcontrol_overlaps_zonas_valor'),
  getVcontrolParticipacionSinCuadrar: () => getVistaControlF('vcontrol_participacion_sin_cuadrar'),
  getVcontrolPrediosSinFoto: () => getVistaControlF('vcontrol_predios_sin_foto'),
  getVcontrolPrediosSinTenencia: () => getVistaControlF('vcontrol_predios_sin_tenencia'),
  getVcontrolRegistrosPorDigitador: () => getVistaControlF('vcontrol_registros_por_digitador'),
  getVcontrolZonasValorGeometriasInvalidas: () => getVistaControlF('vcontrol_zonas_valor_geometrias_invalidas'),
};

