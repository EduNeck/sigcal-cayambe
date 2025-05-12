const express = require('express');
const router = express.Router();
const validacionesModel = require('../db/models/validaciones');

// ========================= RUTAS VALIDACIONES =========================

const rutasTipoA = [
  'vcontrol_alicuotas_a',
  'vcontrol_alicuotas_b',
  'vcontrol_inconsistencia_alicuotas',
  'vcontrol_ph_sin_fm',
  'vcontrol_predios_con_porcentaje_exedente',
  'vcontrol_predios_sin_geometria',
  'vcontrol_predios_sin_servicios',
  'vcontrol_predios_sin_uso',
  'vcontrol_geo_discrepancia_zona_valor_tipo_predio'
];

rutasTipoA.forEach((ruta) => {
  router.get(`/${ruta}`, async (req, res) => {
    try {
      const funcion = validacionesModel[`get${toCamelCase(ruta)}`];
      const data = await funcion(req.query.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

const rutasTipoB = [
  'vcontrol_bloques_geometrias_invalidas',
  'vcontrol_bloques_no_digitados',
  'vcontrol_bloques_sin_geometria',
  'vcontrol_fichas_digitadas_por_usuario_b',
  'vcontrol_predios_geometrias_invalidas',
  'vcontrol_predios_no_digitados',
  'vcontrol_predios_sin_vias'
];

rutasTipoB.forEach((ruta) => {
  router.get(`/${ruta}`, async (req, res) => {
    try {
      const funcion = validacionesModel[`get${toCamelCase(ruta)}`];
      const data = await funcion(req.query.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

const rutasTipoC = [
  'vcontrol_bloques_urb'
];

rutasTipoC.forEach((ruta) => {
  router.get(`/${ruta}`, async (req, res) => {
    try {
      const funcion = validacionesModel[`get${toCamelCase(ruta)}`];
      const data = await funcion(req.query.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

const rutasTipoD = [
  'vcontrol_predios_sin_zona_valor'
];

rutasTipoD.forEach((ruta) => {
  router.get(`/${ruta}`, async (req, res) => {
    try {
      const funcion = validacionesModel[`get${toCamelCase(ruta)}`];
      const data = await funcion(req.query.id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

const rutasTipoF = [
  'vcontrol_overlaps_bloques',
  'vcontrol_overlaps_predio',
  'vcontrol_overlaps_zonas_valor',
  'vcontrol_participacion_sin_cuadrar',
  'vcontrol_predios_sin_foto',
  'vcontrol_predios_sin_tenencia',
  'vcontrol_registros_por_digitador',
  'vcontrol_zonas_valor_geometrias_invalidas'
];

rutasTipoF.forEach((ruta) => {
  router.get(`/${ruta}`, async (req, res) => {
    try {
      const funcion = validacionesModel[`get${toCamelCase(ruta)}`];
      const data = await funcion();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

function toCamelCase(text) {
  return text.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()).replace(/^./, s => s.toUpperCase());
}

module.exports = router;
