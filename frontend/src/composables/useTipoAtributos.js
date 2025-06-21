// Este composable obtiene todos los tipos de atributo para el select
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export async function fetchTipoAtributos() {
  // Si tienes un endpoint para todos los tipos, usa ese. Si no, simula algunos ids
  // Aquí se asume que hay un endpoint tipo_atributo/all que devuelve todos
  try {
    const response = await axios.get(`${API_BASE_URL}/tipo_atributo/all`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipos de atributo:', error);
    return [];
  }
}
