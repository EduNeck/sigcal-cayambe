const ActividadModel = require('../db/models/ActividadModel');

/**
 * Controlador para operaciones relacionadas con actividades
 */
const actividadController = {
  /**
   * Obtener todas las actividades
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async obtenerActividades(req, res) {
    try {
      const actividades = await ActividadModel.obtenerActividades();
      
      return res.json({
        success: true,
        data: actividades
      });
    } catch (error) {
      console.error('Error en controlador de actividades:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener actividades',
        error: error.message
      });
    }
  },

  /**
   * Obtener una actividad por su ID
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async obtenerActividadPorId(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
      }

      const actividad = await ActividadModel.obtenerActividadPorId(parseInt(id));
      
      if (!actividad) {
        return res.status(404).json({
          success: false,
          message: 'Actividad no encontrada'
        });
      }

      return res.json({
        success: true,
        data: actividad
      });
    } catch (error) {
      console.error('Error en controlador de actividades:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener actividad',
        error: error.message
      });
    }
  },

  /**
   * Crear una nueva actividad
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async crearActividad(req, res) {
    try {
      const { tipo, descripcion } = req.body;
      
      // Validar campos requeridos
      if (!tipo) {
        return res.status(400).json({
          success: false,
          message: 'El tipo es requerido'
        });
      }

      const nuevaActividad = await ActividadModel.crearActividad({
        tipo,
        descripcion: descripcion || null
      });

      return res.status(201).json({
        success: true,
        message: 'Actividad creada exitosamente',
        data: nuevaActividad
      });
    } catch (error) {
      console.error('Error en controlador de actividades:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al crear actividad',
        error: error.message
      });
    }
  },

  /**
   * Actualizar una actividad existente
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async actualizarActividad(req, res) {
    try {
      const { id } = req.params;
      const { tipo, descripcion } = req.body;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
      }
      
      // Validar campos requeridos
      if (!tipo) {
        return res.status(400).json({
          success: false,
          message: 'El tipo es requerido'
        });
      }
      
      const idActividad = parseInt(id);
      
      // Verificar si la actividad existe
      const actividadExistente = await ActividadModel.obtenerActividadPorId(idActividad);
      
      if (!actividadExistente) {
        return res.status(404).json({
          success: false,
          message: 'Actividad no encontrada'
        });
      }
      
      // Actualizar la actividad
      const actividadActualizada = await ActividadModel.actualizarActividad(idActividad, {
        tipo,
        descripcion: descripcion || null
      });

      return res.json({
        success: true,
        message: 'Actividad actualizada exitosamente',
        data: actividadActualizada
      });
    } catch (error) {
      console.error('Error en controlador de actividades:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar actividad',
        error: error.message
      });
    }
  },

  /**
   * Eliminar una actividad
   * @param {Object} req - Objeto de solicitud Express
   * @param {Object} res - Objeto de respuesta Express
   */
  async eliminarActividad(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'ID inválido'
        });
      }
      
      const idActividad = parseInt(id);
      
      // Verificar si la actividad existe
      const actividadExistente = await ActividadModel.obtenerActividadPorId(idActividad);
      
      if (!actividadExistente) {
        return res.status(404).json({
          success: false,
          message: 'Actividad no encontrada'
        });
      }
      
      // Eliminar la actividad
      await ActividadModel.eliminarActividad(idActividad);

      return res.json({
        success: true,
        message: 'Actividad eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error en controlador de actividades:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar actividad',
        error: error.message
      });
    }
  }
};

module.exports = actividadController;
