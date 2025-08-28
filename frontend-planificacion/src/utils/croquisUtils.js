import axios from 'axios';

/**
 * Genera la URL para obtener el croquis de un predio por su clave catastral
 * @param {string} claveCatastral - La clave catastral del predio
 * @param {number} margenZoom - Margen adicional para el zoom (valor por defecto: 10)
 * @returns {Promise<string>} URL del croquis o cadena vacía en caso de error
 */
export async function generarUrlCroquis(claveCatastral, margenZoom = 10) {
  if (!claveCatastral) {
    console.error('Clave catastral no proporcionada.');
    return '';
  }

  try {
    // Usamos la variable de entorno para la URL de la API
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';
    
    const resp = await axios.get(`${API_BASE_URL}/bbox_predio/${claveCatastral}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const { xmin, ymin, xmax, ymax } = resp.data;

    if (
      xmin == null || ymin == null || xmax == null || ymax == null ||
      isNaN(xmin) || isNaN(ymin) || isNaN(xmax) || isNaN(ymax)
    ) {
      console.error('Coordenadas inválidas:', resp.data);
      return '';
    }

    const xMin = Number(xmin);
    const yMin = Number(ymin);
    const xMax = Number(xmax);
    const yMax = Number(ymax);

    const width_bbox = xMax - xMin;
    const height_bbox = yMax - yMin;
    const maxSide = Math.max(width_bbox, height_bbox);

    const centerX = (xMin + xMax) / 2;
    const centerY = (yMin + yMax) / 2;
    const halfSide = maxSide / 2;

    const newMinX = centerX - halfSide - margenZoom;
    const newMaxX = centerX + halfSide + margenZoom;
    const newMinY = centerY - halfSide - margenZoom;
    const newMaxY = centerY + halfSide + margenZoom;

    const bbox = `${newMinX},${newMinY},${newMaxX},${newMaxY}`;
    
    // Usamos la variable de entorno para la URL del Geoserver
    const baseUrl = import.meta.env.VITE_GEOSERVER_URL || 'http://geoserver.example.com';

    const capas = [
      'sigcal:geo_manzana_poligono',
      'sigcal:geo_predio',
      'sigcal:geo_bloque',
      'sigcal:vista_geo_predio_urb',
      'sigcal:geo_via',
      'sigcal:geo_frentes'
    ].join(',');

    const filtros = [
      'include',
      'include',
      'include',
      `(cod_cat = '${claveCatastral}')`,
      'include',
      'include'
    ].join(';');

    // Agregamos un timestamp para evitar caché
    return `${baseUrl}/wms?service=WMS&version=1.1.0&request=GetMap&layers=${capas}&cql_filter=${filtros}&styles=&bbox=${bbox}&width=600&height=400&srs=EPSG:32717&format=image/png&_t=${Date.now()}`;
  } catch (error) {
    console.error('Error al generar croquis URL:', error);
    return '';
  }
}

/**
 * Verifica si un predio tiene coordenadas válidas para generar un croquis
 * @param {string} claveCatastral - La clave catastral del predio
 * @returns {Promise<boolean>} True si el predio tiene coordenadas válidas, false en caso contrario
 */
export async function verificarPredioTieneCoordenadas(claveCatastral) {
  if (!claveCatastral) {
    return false;
  }
  
  try {
    // Usamos la variable de entorno para la URL de la API
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';
    
    const resp = await axios.get(`${API_BASE_URL}/bbox_predio/${claveCatastral}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const { xmin, ymin, xmax, ymax } = resp.data;
    
    return !(
      xmin == null || ymin == null || xmax == null || ymax == null ||
      isNaN(xmin) || isNaN(ymin) || isNaN(xmax) || isNaN(ymax)
    );
  } catch (error) {
    console.error('Error al verificar coordenadas del predio:', error);
    return false;
  }
}
