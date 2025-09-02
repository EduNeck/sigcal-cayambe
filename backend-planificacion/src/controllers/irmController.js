const IrmModel = require('../../db/models/IrmModel');
const DetalleIrmModel = require('../../db/models/DetalleIrmModel');

// Controlador para gestionar los IRMs
const irmController = {
  // Crear un nuevo IRM
  createIRM: async (req, res) => {
    try {
      const {
        fecha, 
        tipo,
        tipo_predio,
        id_ciudadano,
        numero_documento,
        clave_catastral,
        clave_anterior,
        derechos_acciones,
        area_construccion,
        area_escritura,
        area_grafica,
        frente,
        tiene_construccion,
        parroquia,
        barrio_sector,
        notas_irm,
        agua,
        energia_electrica,
        alcantarillado,
        otros,
        usuario,
        fecha_reporte,
        regulaciones  // Array de objetos de regulaciones
      } = req.body;

      // Crear el IRM principal usando el modelo
      const irmData = {
        fecha, 
        tipo,
        tipo_predio,
        id_ciudadano,
        numero_documento,
        clave_catastral,
        clave_anterior,
        derechos_acciones,
        area_construccion,
        area_escritura,
        area_grafica,
        frente,
        tiene_construccion,
        parroquia,
        barrio_sector,
        notas_irm,
        agua,
        energia_electrica,
        alcantarillado,
        otros,
        usuario,
        fecha_reporte
      };

      const result = await IrmModel.insertaIrm(irmData);
      const id_certificado = result.id_irm;

      // Insertar las regulaciones si existen usando el modelo de detalleIrm
      if (regulaciones && regulaciones.length > 0) {
        const detallesFormateados = regulaciones.map(reg => ({
          id_certificado_regulacion: id_certificado,
          nombre_zona: reg.zona || '',
          implantacion: reg.forma_ocupacion || '',
          retiro_frontal: reg.frontal || 0,
          retiro_lateral_izq: reg.lateral_1 || 0,
          retiro_lateral_der: reg.lateral_2 || 0,
          retiro_posterior: reg.posterior || 0,
          altura_edificacion: reg.altura_maxima || 0,
          numero_pisos: reg.numero_pisos || 0,
          cos_pb: reg.cos_pb || 0,
          cos_total: reg.cos_total || 0,
          lote_minimo: reg.lote_minimo || 0,
          frente_minimo: reg.frente_minimo || 0,
          observaciones: reg.observaciones || ''
        }));
        
        await DetalleIrmModel.crearMultiplesDetallesIRM(detallesFormateados, id_certificado);
      }
      
      res.json({
        success: true,
        message: 'IRM creado exitosamente',
        data: { id_certificado }
      });
    } catch (error) {
      console.error('Error al crear IRM:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el IRM',
        error: error.message
      });
    }
  },

  // Obtener un IRM por su ID
  getIRMById: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Obtener el IRM principal usando el modelo
      const irm = await IrmModel.recuperaIrmById(id);
      
      if (!irm) {
        return res.status(404).json({
          success: false,
          message: 'IRM no encontrado'
        });
      }
      
      // Obtener las regulaciones asociadas usando el modelo
      const regulaciones = await DetalleIrmModel.obtenerDetallesPorIdIRM(id);
      
      // Combinar los resultados
      const resultado = {
        ...irm,
        regulaciones
      };
      
      res.json({
        success: true,
        data: resultado
      });
    } catch (error) {
      console.error('Error al obtener IRM:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el IRM',
        error: error.message
      });
    }
  },

  // Listar IRMs con paginación y filtros
  listIRMs: async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        clave_catastral, 
        id_ciudadano, 
        fecha_desde, 
        fecha_hasta 
      } = req.query;
      
      // Usar el método buscarIRMs del modelo que incluye la paginación y filtros
      const filters = { 
        clave_catastral, 
        id_ciudadano, 
        fecha_desde, 
        fecha_hasta 
      };
      
      const result = await IrmModel.buscaIrms(filters, page, limit);
      
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error al listar IRMs:', error);
      res.status(500).json({
        success: false,
        message: 'Error al listar los IRMs',
        error: error.message
      });
    }
  },

  // Actualizar un IRM existente
  updateIRM: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar si el IRM existe
      const existingIRM = await IrmModel.obtenerIRMPorId(id);
      
      if (!existingIRM) {
        return res.status(404).json({
          success: false,
          message: 'IRM no encontrado'
        });
      }
      
      const {
        fecha, 
        tipo,
        tipo_predio,
        id_ciudadano,
        clave_catastral,
        clave_anterior,
        derechos_acciones,
        area_construccion,
        area_escritura,
        area_grafica,
        frente,
        tiene_construccion,
        parroquia,
        barrio_sector,
        notas_irm,
        agua,
        energia_electrica,
        alcantarillado,
        otros,
        regulaciones
      } = req.body;

      // Actualizar el IRM principal
      const irmData = {
        fecha, 
        tipo,
        tipo_predio,
        id_ciudadano,
        clave_catastral,
        clave_anterior,
        derechos_acciones,
        area_construccion,
        area_escritura,
        area_grafica,
        frente,
        tiene_construccion,
        parroquia,
        barrio_sector,
        notas_irm,
        agua,
        energia_electrica,
        alcantarillado,
        otros,
        pro_tipo,
        pro_nombre,
        pro_observaciones,
        geometria
      };

      // Filtrar propiedades indefinidas
      Object.keys(irmData).forEach(key => {
        if (irmData[key] === undefined) {
          delete irmData[key];
        }
      });

      const updatedIRM = await IrmModel.actualizaIrm(id, irmData);

      // Actualizar regulaciones si se proporcionaron
      if (regulaciones && regulaciones.length > 0) {
        // Eliminar las regulaciones existentes
        await DetalleIrmModel.eliminarDetallesPorIdIRM(id);
        
        // Crear nuevas regulaciones
        const detallesFormateados = regulaciones.map(reg => ({
          id_certificado_regulacion: id,
          nombre_zona: reg.zona || '',
          implantacion: reg.forma_ocupacion || '',
          retiro_frontal: reg.frontal || 0,
          retiro_lateral_izq: reg.lateral_1 || 0,
          retiro_lateral_der: reg.lateral_2 || 0,
          retiro_posterior: reg.posterior || 0,
          altura_edificacion: reg.altura_maxima || 0,
          numero_pisos: reg.numero_pisos || 0,
          cos_pb: reg.cos_pb || 0,
          cos_total: reg.cos_total || 0,
          lote_minimo: reg.lote_minimo || 0,
          frente_minimo: reg.frente_minimo || 0,
          observaciones: reg.observaciones || ''
        }));
        
        await DetalleIrmModel.crearMultiplesDetallesIRM(detallesFormateados, id);
      }
      
      res.json({
        success: true,
        message: 'IRM actualizado exitosamente',
        data: updatedIRM
      });
    } catch (error) {
      console.error('Error al actualizar IRM:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el IRM',
        error: error.message
      });
    }
  },
  
  // Eliminar un IRM existente
  deleteIRM: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verificar si el IRM existe
      const existingIRM = await IrmModel.obtenerIRMPorId(id);
      
      if (!existingIRM) {
        return res.status(404).json({
          success: false,
          message: 'IRM no encontrado'
        });
      }
      
      // Eliminar primero los detalles asociados
      await DetalleIrmModel.eliminarDetallesPorIdIRM(id);
      
      // Luego eliminar el IRM principal
      await IrmModel.eliminaIrm(id);
      
      res.json({
        success: true,
        message: 'IRM eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar IRM:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el IRM',
        error: error.message
      });
    }
  }
};

module.exports = irmController;
