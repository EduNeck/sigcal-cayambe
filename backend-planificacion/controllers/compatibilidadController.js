const CompatibilidadModel = require('../db/models/CompatibilidadModel');

/**
 * Controlador para operaciones relacionadas con compatibilidades
 */
const compatibilidadController = {
  /**
   * Obtener resultado de compatibilidad entre una tipología y un uso de suelo
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async obtenerCompatibilidadPorTipologiaYUso(req, res) {
    try {
      const { idTipologia, idUso } = req.query;
      
      if (!idTipologia || !idUso) {
        return res.status(400).json({
          success: false,
          message: 'Se requieren los parámetros idTipologia y idUso'
        });
      }
      
      const compatibilidad = await CompatibilidadModel.obtenerCompatibilidadPorTipologiaYUso(idTipologia, idUso);
      
      if (!compatibilidad) {
        return res.status(404).json({
          success: false,
          message: `No se encontró compatibilidad para tipología ${idTipologia} y uso ${idUso}`
        });
      }
      
      return res.json({
        success: true,
        data: compatibilidad
      });
    } catch (error) {
      console.error('Error al obtener compatibilidad por tipología y uso:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener la compatibilidad',
        error: error.message
      });
    }
  },

  /**
   * Obtener todas las compatibilidades
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async obtenerCompatibilidades(req, res) {
    try {
      const compatibilidades = await CompatibilidadModel.obtenerCompatibilidades();
      
      return res.json({
        success: true,
        data: compatibilidades
      });
    } catch (error) {
      console.error('Error en controlador de compatibilidades:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener compatibilidades',
        error: error.message
      });
    }
  },

  /**
   * Obtener una compatibilidad por su ID
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async obtenerCompatibilidadPorId(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
      }

      const compatibilidad = await CompatibilidadModel.obtenerCompatibilidadPorId(parseInt(id));
      
      if (!compatibilidad) {
        return res.status(404).json({
          success: false,
          message: 'Compatibilidad no encontrada'
        });
      }

      return res.json({
        success: true,
        data: compatibilidad
      });
    } catch (error) {
      console.error('Error en controlador de compatibilidades:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener compatibilidad',
        error: error.message
      });
    }
  },

  /**
   * Crear una nueva compatibilidad
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async crearCompatibilidad(req, res) {
    try {
      const { tip_id, tipo, uso_id, fcode } = req.body;
      
      // Validar campos requeridos
      if (!tip_id || !tipo) {
        return res.status(400).json({
          success: false,
          message: 'El tip_id y tipo son requeridos'
        });
      }

      const nuevaCompatibilidad = await CompatibilidadModel.crearCompatibilidad({
        tip_id,
        tipo,
        uso_id: uso_id || null,
        fcode: fcode || null
      });

      return res.status(201).json({
        success: true,
        message: 'Compatibilidad creada exitosamente',
        data: nuevaCompatibilidad
      });
    } catch (error) {
      console.error('Error en controlador de compatibilidades:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al crear compatibilidad',
        error: error.message
      });
    }
  },

  /**
   * Actualizar una compatibilidad existente
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async actualizarCompatibilidad(req, res) {
    try {
      const { id } = req.params;
      const { tip_id, tipo, uso_id, fcode } = req.body;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
      }
      
      // Validar campos requeridos
      if (!tip_id || !tipo) {
        return res.status(400).json({
          success: false,
          message: 'El tip_id y tipo son requeridos'
        });
      }
      
      const idCompatibilidad = parseInt(id);
      
      // Verificar si la compatibilidad existe
      const compatibilidadExistente = await CompatibilidadModel.obtenerCompatibilidadPorId(idCompatibilidad);
      
      if (!compatibilidadExistente) {
        return res.status(404).json({
          success: false,
          message: 'Compatibilidad no encontrada'
        });
      }
      
      // Actualizar la compatibilidad
      const compatibilidadActualizada = await CompatibilidadModel.actualizarCompatibilidad(idCompatibilidad, {
        tip_id,
        tipo,
        uso_id: uso_id || null,
        fcode: fcode || null
      });

      return res.json({
        success: true,
        message: 'Compatibilidad actualizada exitosamente',
        data: compatibilidadActualizada
      });
    } catch (error) {
      console.error('Error en controlador de compatibilidades:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar compatibilidad',
        error: error.message
      });
    }
  },

  /**
   * Eliminar una compatibilidad
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async eliminarCompatibilidad(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
      }
      
      const idCompatibilidad = parseInt(id);
      
      // Verificar si la compatibilidad existe
      const compatibilidadExistente = await CompatibilidadModel.obtenerCompatibilidadPorId(idCompatibilidad);
      
      if (!compatibilidadExistente) {
        return res.status(404).json({
          success: false,
          message: 'Compatibilidad no encontrada'
        });
      }
      
      // Eliminar la compatibilidad
      await CompatibilidadModel.eliminarCompatibilidad(idCompatibilidad);

      return res.json({
        success: true,
        message: 'Compatibilidad eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error en controlador de compatibilidades:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar compatibilidad',
        error: error.message
      });
    }
  }
};

module.exports = compatibilidadController;
