const db = require('../config');

/**
 * Modelo para operaciones relacionadas con geometrías de predios
 */
const GeometriaModel = {
  /**
   * Obtener la geometría de un predio por su clave catastral
   * @param {string} claveCatastral - La clave catastral del predio
   * @returns {Promise<Object>} La geometría del predio en formato GeoJSON
   */
  async obtenerGeometriaPorClaveCatastral(claveCatastral) {
    try {
      // Consultamos la vista v_predio_geom que contiene la geometría del predio
      const query = `
        SELECT 
          clave_catastral,
          ST_AsGeoJSON(geom)::json as poligono
        FROM 
          planificacion.view_datos_titular
        WHERE 
          clave_catastral = $1
        LIMIT 1
      `;

      const result = await db.query(query, [claveCatastral]);
      
      if (result.rows.length > 0) {
        return result.rows[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener geometría del predio:', error);
      throw error;
    }
  }
};

module.exports = GeometriaModel;
