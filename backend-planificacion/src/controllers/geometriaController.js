const GeometriaModel = require('../../db/models/GeometriaModel');

/**
 * Controlador para operaciones relacionadas con geometrías de predios
 */
const geometriaController = {
  /**
   * Obtener la geometría de un predio por su clave catastral
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async obtenerGeometriaPorClaveCatastral(req, res) {
    try {
      const { claveCatastral } = req.params;
      
      if (!claveCatastral) {
        return res.status(400).json({
          success: false,
          message: 'La clave catastral es requerida'
        });
      }

      const geometria = await GeometriaModel.obtenerGeometriaPorClaveCatastral(claveCatastral);
      
      if (!geometria) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró geometría para la clave catastral especificada'
        });
      }

      return res.json({
        success: true,
        data: geometria.poligono
      });
    } catch (error) {
      console.error('Error en controlador de geometría:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener geometría del predio',
        error: error.message
      });
    }
  }
};

module.exports = geometriaController;
