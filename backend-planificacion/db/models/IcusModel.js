const { pool } = require('../config');

class IcusModel {
  // Obtener todos los ICUS con paginación y búsqueda
  static async recuperaIcus(page = 1, limit = 10, search = '') {
    try {
      const offset = (page - 1) * limit;
      
      let whereClause = '';
      let queryParams = [limit, offset];
      
      if (search) {
        whereClause = `WHERE numero_documento ILIKE $3 OR propietario ILIKE $3 OR clave_catastral ILIKE $3`;
        queryParams.push(`%${search}%`);
      }
      
      const query = `
        SELECT 
          id, numero_documento, propietario, clave_catastral, clave_anterior,
          derechos_acciones, ph, area_construccion, area_escritura, area_gis,
          frente, id_par, nombre_parroquia, sector, resultado_informe,
          id_actividad, actividad, id_uso_suelo, uso_suelo, id_tipologia,
          tipologia, compatibilidad, notas, fecha, usuario, id_predio,
          ST_AsGeoJSON(geometria) as geometria_geojson
        FROM planificacion.icus 
        ${whereClause}
        ORDER BY id DESC 
        LIMIT $1 OFFSET $2
      `;
      
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM planificacion.icus 
        ${whereClause}
      `;
      
      const [result, countResult] = await Promise.all([
        pool.query(query, queryParams),
        pool.query(countQuery, search ? [`%${search}%`] : [])
      ]);
      
      const total = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(total / limit);
      
      return {
        data: result.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRecords: total,
          limit: parseInt(limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Obtener un ICUS por ID
  static async recuperaIcusById(id) {
    try {
      const query = `
        SELECT 
          id, numero_documento, propietario, clave_catastral, clave_anterior,
          derechos_acciones, ph, area_construccion, area_escritura, area_gis,
          frente, id_par, nombre_parroquia, sector, resultado_informe,
          id_actividad, actividad, id_uso_suelo, uso_suelo, id_tipologia,
          tipologia, compatibilidad, notas, fecha, usuario, id_predio,
          ST_AsGeoJSON(geometria) as geometria_geojson
        FROM planificacion.icus 
        WHERE id = $1
      `;
      
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo ICUS
  static async crearIcus(data) {
    try {
      const {
        numero_documento, propietario, clave_catastral, clave_anterior,
        derechos_acciones, ph, area_construccion, area_escritura, area_gis,
        frente, id_par, nombre_parroquia, sector, resultado_informe,
        id_actividad, actividad, id_uso_suelo, uso_suelo, id_tipologia,
        tipologia, compatibilidad, notas, fecha, usuario, id_predio, geometria
      } = data;
      
      let query, queryParams;
      
      if (geometria) {
        // Si hay geometría, usar ST_GeomFromGeoJSON
        query = `
          INSERT INTO planificacion.icus (
            numero_documento, propietario, clave_catastral, clave_anterior,
            derechos_acciones, ph, area_construccion, area_escritura, area_gis,
            frente, id_par, nombre_parroquia, sector, resultado_informe,
            id_actividad, actividad, id_uso_suelo, uso_suelo, id_tipologia,
            tipologia, compatibilidad, notas, fecha, usuario, id_predio, geometria
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
            $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, ST_GeomFromGeoJSON($26)
          ) RETURNING id, ST_AsGeoJSON(geometria) as geometria_geojson
        `;
        queryParams = [
          numero_documento, propietario, clave_catastral, clave_anterior,
          derechos_acciones, ph, area_construccion, area_escritura, area_gis,
          frente, id_par, nombre_parroquia, sector, resultado_informe,
          id_actividad, actividad, id_uso_suelo, uso_suelo, id_tipologia,
          tipologia, compatibilidad, notas, fecha, usuario, id_predio, JSON.stringify(geometria)
        ];
      } else {
        // Sin geometría
        query = `
          INSERT INTO planificacion.icus (
            numero_documento, propietario, clave_catastral, clave_anterior,
            derechos_acciones, ph, area_construccion, area_escritura, area_gis,
            frente, id_par, nombre_parroquia, sector, resultado_informe,
            id_actividad, actividad, id_uso_suelo, uso_suelo, id_tipologia,
            tipologia, compatibilidad, notas, fecha, usuario, id_predio
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
            $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
          ) RETURNING id
        `;
        queryParams = [
          numero_documento, propietario, clave_catastral, clave_anterior,
          derechos_acciones, ph, area_construccion, area_escritura, area_gis,
          frente, id_par, nombre_parroquia, sector, resultado_informe,
          id_actividad, actividad, id_uso_suelo, uso_suelo, id_tipologia,
          tipologia, compatibilidad, notas, fecha, usuario, id_predio
        ];
      }
      
      const result = await pool.query(query, queryParams);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un ICUS existente
  static async actualizarIcus(id, data) {
    try {
      // Verificar si existe
      const exists = await this.recuperaIcusById(id);
      if (!exists) {
        return null;
      }

      const {
        numero_documento, propietario, clave_catastral, clave_anterior,
        derechos_acciones, ph, area_construccion, area_escritura, area_gis,
        frente, id_par, nombre_parroquia, sector, resultado_informe,
        id_actividad, actividad, id_uso_suelo, uso_suelo, id_tipologia,
        tipologia, compatibilidad, notas, fecha, usuario, id_predio, geometria
      } = data;
      
      let query, queryParams;
      
      if (geometria) {
        // Si hay geometría, usar ST_GeomFromGeoJSON
        query = `
          UPDATE planificacion.icus SET
            numero_documento = $2, propietario = $3, clave_catastral = $4, clave_anterior = $5,
            derechos_acciones = $6, ph = $7, area_construccion = $8, area_escritura = $9, area_gis = $10,
            frente = $11, id_par = $12, nombre_parroquia = $13, sector = $14, resultado_informe = $15,
            id_actividad = $16, actividad = $17, id_uso_suelo = $18, uso_suelo = $19, id_tipologia = $20,
            tipologia = $21, compatibilidad = $22, notas = $23, fecha = $24, usuario = $25, id_predio = $26,
            geometria = ST_GeomFromGeoJSON($27)
          WHERE id = $1
          RETURNING id, ST_AsGeoJSON(geometria) as geometria_geojson
        `;
        queryParams = [
          id, numero_documento, propietario, clave_catastral, clave_anterior,
          derechos_acciones, ph, area_construccion, area_escritura, area_gis,
          frente, id_par, nombre_parroquia, sector, resultado_informe,
          id_actividad, actividad, id_uso_suelo, uso_suelo, id_tipologia,
          tipologia, compatibilidad, notas, fecha, usuario, id_predio, JSON.stringify(geometria)
        ];
      } else {
        // Sin geometría
        query = `
          UPDATE planificacion.icus SET
            numero_documento = $2, propietario = $3, clave_catastral = $4, clave_anterior = $5,
            derechos_acciones = $6, ph = $7, area_construccion = $8, area_escritura = $9, area_gis = $10,
            frente = $11, id_par = $12, nombre_parroquia = $13, sector = $14, resultado_informe = $15,
            id_actividad = $16, actividad = $17, id_uso_suelo = $18, uso_suelo = $19, id_tipologia = $20,
            tipologia = $21, compatibilidad = $22, notas = $23, fecha = $24, usuario = $25, id_predio = $26
          WHERE id = $1
          RETURNING id
        `;
        queryParams = [
          id, numero_documento, propietario, clave_catastral, clave_anterior,
          derechos_acciones, ph, area_construccion, area_escritura, area_gis,
          frente, id_par, nombre_parroquia, sector, resultado_informe,
          id_actividad, actividad, id_uso_suelo, uso_suelo, id_tipologia,
          tipologia, compatibilidad, notas, fecha, usuario, id_predio
        ];
      }
      
      const result = await pool.query(query, queryParams);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un ICUS
  static async eliminarIcus(id) {
    try {
      // Verificar si existe
      const exists = await this.recuperaIcusById(id);
      if (!exists) {
        return false;
      }

      const query = 'DELETE FROM planificacion.icus WHERE id = $1';
      await pool.query(query, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  // Buscar ICUS por diferentes criterios
  static async buscarIcus(criterios = {}) {
    try {
      const {
        clavesCatastrales,
        id_actividad,
        page = 1,
        limit = 50
      } = criterios;
      
      const offset = (page - 1) * limit;
      
      // Construir la cláusula WHERE dinámicamente
      const conditions = [];
      const params = [];
      let paramIndex = 1;
      
      if (clavesCatastrales && Array.isArray(clavesCatastrales) && clavesCatastrales.length > 0) {
        // Si hay múltiples claves catastrales, usar IN
        const placeholders = clavesCatastrales.map((_, i) => `$${paramIndex + i}`).join(',');
        conditions.push(`clave_catastral IN (${placeholders})`);
        clavesCatastrales.forEach(clave => params.push(clave));
        paramIndex += clavesCatastrales.length;
      }
      
      // Añadir filtro por id_actividad si se proporciona
      if (id_actividad) {
        conditions.push(`id_actividad = $${paramIndex}`);
        params.push(id_actividad);
        paramIndex++;
      }
      
      // Construir la consulta SQL completa
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      
      const query = `
        SELECT 
          id, numero_documento, propietario, clave_catastral, clave_anterior,
          derechos_acciones, ph, area_construccion, area_escritura, area_gis,
          frente, id_par, nombre_parroquia, sector, resultado_informe,
          id_actividad, actividad, id_uso_suelo, uso_suelo, id_tipologia,
          tipologia, compatibilidad, notas, fecha, usuario, id_predio,
          ST_AsGeoJSON(geometria) as geometria_geojson
        FROM planificacion.icus 
        ${whereClause}
        ORDER BY id DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      params.push(parseInt(limit));
      params.push(offset);
      
      // Ejecutar la consulta
      const result = await pool.query(query, params);
      
      return {
        success: true,
        data: result.rows,
        total: result.rowCount
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = IcusModel;
