const TipologiaModel = require('../db/models/TipologiaModel');

/**
 * Controlador para operaciones relacionadas con tipologías
 */
const tipologiaController = {
  /**
   * Obtener todas las tipologías
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async obtenerTipologias(req, res) {
    try {
      const tipologias = await TipologiaModel.obtenerTipologias();
      
      return res.json({
        success: true,
        data: tipologias
      });
    } catch (error) {
      console.error('Error en controlador de tipologías:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener tipologías',
        error: error.message
      });
    }
  },

  /**
   * Obtener una tipología por su ID
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async obtenerTipologiaPorId(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
      }

      const tipologia = await TipologiaModel.obtenerTipologiaPorId(parseInt(id));
      
      if (!tipologia) {
        return res.status(404).json({
          success: false,
          message: 'Tipología no encontrada'
        });
      }

      return res.json({
        success: true,
        data: tipologia
      });
    } catch (error) {
      console.error('Error en controlador de tipologías:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener tipología',
        error: error.message
      });
    }
  },

  /**
   * Crear una nueva tipología
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async crearTipologia(req, res) {
    try {
      const { tipo, nombre, descriptacion, nivel } = req.body;
      
      // Validar campos requeridos
      if (!tipo || !nombre) {
        return res.status(400).json({
          success: false,
          message: 'El tipo y nombre son requeridos'
        });
      }

      const nuevaTipologia = await TipologiaModel.crearTipologia({
        tipo,
        nombre,
        descriptacion: descriptacion || null,
        nivel: nivel || null
      });

      return res.status(201).json({
        success: true,
        message: 'Tipología creada exitosamente',
        data: nuevaTipologia
      });
    } catch (error) {
      console.error('Error en controlador de tipologías:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al crear tipología',
        error: error.message
      });
    }
  },

  /**
   * Actualizar una tipología existente
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async actualizarTipologia(req, res) {
    try {
      const { id } = req.params;
      const { tipo, nombre, descriptacion, nivel } = req.body;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
      }
      
      // Validar campos requeridos
      if (!tipo || !nombre) {
        return res.status(400).json({
          success: false,
          message: 'El tipo y nombre son requeridos'
        });
      }
      
      const idTipologia = parseInt(id);
      
      // Verificar si la tipología existe
      const tipologiaExistente = await TipologiaModel.obtenerTipologiaPorId(idTipologia);
      
      if (!tipologiaExistente) {
        return res.status(404).json({
          success: false,
          message: 'Tipología no encontrada'
        });
      }
      
      // Actualizar la tipología
      const tipologiaActualizada = await TipologiaModel.actualizarTipologia(idTipologia, {
        tipo,
        nombre,
        descriptacion: descriptacion || null,
        nivel: nivel || null
      });

      return res.json({
        success: true,
        message: 'Tipología actualizada exitosamente',
        data: tipologiaActualizada
      });
    } catch (error) {
      console.error('Error en controlador de tipologías:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar tipología',
        error: error.message
      });
    }
  },

  /**
   * Eliminar una tipología
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async eliminarTipologia(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
      }
      
      const idTipologia = parseInt(id);
      
      // Verificar si la tipología existe
      const tipologiaExistente = await TipologiaModel.obtenerTipologiaPorId(idTipologia);
      
      if (!tipologiaExistente) {
        return res.status(404).json({
          success: false,
          message: 'Tipología no encontrada'
        });
      }
      
      // Eliminar la tipología
      await TipologiaModel.eliminarTipologia(idTipologia);

      return res.json({
        success: true,
        message: 'Tipología eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error en controlador de tipologías:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar tipología',
        error: error.message
      });
    }
  }
};

module.exports = tipologiaController;
