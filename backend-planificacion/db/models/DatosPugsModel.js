const { pool } = require('../config');

class DatosPugsModel {
  /**
   * Obtener datos PUGS por clave catastral
   * @param {string} codCat - Clave catastral
   * @returns {Promise<Object>} - Datos del PUGS
   */
  static async obtenerDatosPugsPorCodCat(codCat) {
    try {
      const query = `
        SELECT 
          objectid, fcode, usc, usn, csc, csn, foc, fon, zoc, zon, 
          cop, cot, npi, atp, lmi, fmi, rfe, rle1, rle2, rpe, 
          reb, txt, dcf, red, fea, fhc, cod_cat, poligono
        FROM planificacion.view_datos_pugs 
        WHERE cod_cat = $1
      `;
      
      const result = await pool.query(query, [codCat]);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener datos PUGS:', error);
      throw error;
    }
  }
}

module.exports = DatosPugsModel;
