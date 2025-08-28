const { pool } = require('../config');

class DatosTitularModel {
  // Búsqueda avanzada por múltiples parámetros - sin paginación ni conteo
  static async busquedaAvanzada(params = {}) {
    try {
      const { claveCatastral, nombres, numeroDocumento } = params;
      
      let whereConditions = [];
      let queryParams = [];
      let paramCounter = 1; // Empezamos en 1 ya que no tenemos limit ni offset
      
      if (claveCatastral && claveCatastral.trim() !== '') {
        whereConditions.push(`clave_catastral ILIKE $${paramCounter}`);
        queryParams.push(`%${claveCatastral}%`);
        paramCounter++;
      }
      
      if (nombres && nombres.trim() !== '') {
        whereConditions.push(`nombres ILIKE $${paramCounter}`);
        queryParams.push(`%${nombres}%`);
        paramCounter++;
      }
      
      if (numeroDocumento && numeroDocumento.trim() !== '') {
        whereConditions.push(`numero_documento ILIKE $${paramCounter}`);
        queryParams.push(`%${numeroDocumento}%`);
        paramCounter++;
      }
      
      let whereClause = whereConditions.length > 0 
        ? 'WHERE ' + whereConditions.join(' OR ') 
        : '';
      
      const query = `
        SELECT 
          id, numero_documento, nombres, clave_catastral, clave_catastral_anterior, 
          id_regimen_propiedad, regimen, derechos, area_construida, area_escritura, 
          area_grafica, frente, tiene_construccion, parroquia, sector, 
          representante, id_tipo_predio, tipo_predio
        FROM planificacion.view_datos_titular 
        ${whereClause}
        ORDER BY id DESC`;
      
      // Ejecutar la consulta directamente sin paginación ni conteo
      const result = await pool.query(query, queryParams);
      
      // Devolver los datos sin información de paginación
      return {
        data: result.rows
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DatosTitularModel;
