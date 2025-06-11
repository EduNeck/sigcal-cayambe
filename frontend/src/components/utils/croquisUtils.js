import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export async function generarUrlCroquis(claveCatastral, margenZoom = 10) {
  if (!claveCatastral) {
    console.error('Clave catastral no proporcionada.');
    return '';
  }

  try {
    const resp = await axios.get(`${API_BASE_URL}/bbox_predio/${claveCatastral}`);
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
    const baseUrl = import.meta.env.VITE_GEOSERVER_URL;

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



    return `${baseUrl}/wms?service=WMS&version=1.1.0&request=GetMap&layers=${capas}&cql_filter=${filtros}&styles=&bbox=${bbox}&width=600&height=400&srs=EPSG:32717&format=image/png&_t=${Date.now()}`;
  } catch (error) {
    console.error('Error al generar croquis URL:', error);
    return '';
  }
}
