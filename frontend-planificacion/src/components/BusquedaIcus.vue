<template>
  <v-container class="main-container">
    <!-- Encabezado con logo y título -->
    <v-card class="mb-4 py-2 header-card" elevation="3">
      <div class="header-accent-line"></div>
      <v-card-text class="py-1">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="3" class="text-center">
            <img src="@/assets/logo_trasparente.png" alt="Logo de Cayambe" height="60" class="logo-shadow" />
          </v-col>
          <v-col cols="12" sm="9" class="text-center text-sm-left">
            <h1 class="text-h5 font-weight-bold title-text">INFORME DE COMPATIBILIDAD DE USO DE SUELO</h1>
            <h2 class="text-caption text-wrap subtitle-text">Gobierno Autónomo Descentralizado Intercultural y Plurinacional del Municipio de Cayambe</h2>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mb-6 search-card" elevation="3">
      <v-card-title class="search-card-title">
        <v-icon left class="mr-2">mdi-magnify</v-icon>
        Búsqueda de Predios
      </v-card-title>
      <v-card-text class="search-card-content">
        <v-form ref="form" @submit.prevent="buscar">
          <v-row>
            <!-- Clave Catastral -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="filtros.claveCatastral"
                label="Clave Catastral"
                outlined
                dense
                clearable
                hide-details="auto"
              ></v-text-field>
            </v-col>
            
            <!-- Nombres -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="filtros.nombres"
                label="Nombres"
                outlined
                dense
                clearable
                hide-details="auto"
              ></v-text-field>
            </v-col>
            
            <!-- Número de Documento -->
            <v-col cols="12" md="4">
              <v-text-field
                v-model="filtros.numeroDocumento"
                label="Número de Documento"
                outlined
                dense
                clearable
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="mt-3">
            <v-col class="d-flex justify-end">
              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
                :disabled="loading"
              >
                Buscar
              </v-btn>
              <v-btn
                class="ml-2"
                text
                @click="limpiarFiltros"
              >
                Limpiar
              </v-btn>
              <v-btn
                class="ml-2"
                color="error"
                text
                @click="salir"
              >
                Salir
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Tabla de Resultados -->
    <v-card v-if="resultados.length > 0" elevation="3" class="results-card">
      <div class="results-accent-line"></div>
      <v-card-title class="results-card-title">
        <v-icon left class="mr-2">mdi-format-list-bulleted</v-icon>
        Resultados de la búsqueda
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Filtrar resultados"
          single-line
          hide-details
          dense
          class="search-field"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="resultados"
        :search="search"
        :loading="loading"
        :items-per-page="10"
        :footer-props="{ 'items-per-page-options': [5, 10, 20, 50] }"
        class="elevation-1"
      >
        <template v-slot:item.compatibilidad="{ item }">
          <v-chip
            :color="getCompatibilidadColor(item.compatibilidad)"
            text-color="white"
            small
          >
            {{ item.compatibilidad }}
          </v-chip>
        </template>
        
        <template v-slot:item.fecha="{ item }">
          {{ formatearFecha(item.fecha) }}
        </template>
        
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            small
            color="primary"
            @click="verDetalle(item)"
            title="Ver detalle"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            icon
            small
            color="success"
            @click="generarInforme(item)"
            title="Generar informe"
          >
            <v-icon>mdi-file-document</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-alert
      v-else-if="busquedaRealizada && !loading"
      type="info"
      border-color="info"
      elevation="2"
      class="mt-3 no-results-alert"
    >
      <v-icon left>mdi-information-outline</v-icon>
      No se encontraron resultados para esta búsqueda
    </v-alert>

    <!-- Diálogo de detalles -->
    <v-dialog v-model="detalleDialog" max-width="700px">
      <v-card class="dialog-card">
        <div class="dialog-accent-line"></div>
        <v-card-title class="dialog-card-title">
          <v-icon left class="mr-2">mdi-file-certificate-outline</v-icon>
          Detalles del ICUS
          <v-spacer></v-spacer>
          <v-btn icon @click="detalleDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="icusSeleccionado">
          <v-row>
            <v-col cols="6">
              <p><strong>Clave Catastral:</strong> {{ icusSeleccionado.clave_catastral }}</p>
              <p><strong>Propietario:</strong> {{ icusSeleccionado.propietario }}</p>
              <p><strong>Actividad:</strong> {{ icusSeleccionado.actividad }}</p>
              <p><strong>Tipología:</strong> {{ icusSeleccionado.tipologia }}</p>
            </v-col>
            <v-col cols="6">
              <p><strong>Compatibilidad:</strong> {{ icusSeleccionado.compatibilidad }}</p>
              <p><strong>Uso de Suelo:</strong> {{ icusSeleccionado.uso_suelo }}</p>
              <p><strong>Fecha:</strong> {{ formatearFecha(icusSeleccionado.fecha) }}</p>
              <p><strong>ID ICUS:</strong> {{ icusSeleccionado.id }}</p>
            </v-col>
          </v-row>
          <v-row v-if="icusSeleccionado.resultado_informe">
            <v-col cols="12">
              <v-card outlined class="pa-3">
                <p class="mb-0"><strong>Resultado del Informe:</strong></p>
                <p class="mt-2 mb-0">{{ icusSeleccionado.resultado_informe }}</p>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="generarInforme(icusSeleccionado)">
            Generar Informe
          </v-btn>
          <v-btn color="grey darken-1" text @click="detalleDialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para alertas -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      top
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';
import datosTitularService from '@/services/datosTitularService';

export default {
  name: 'BusquedaIcus',
  
  setup() {
    const router = useRouter();
    const form = ref(null);
    const loading = ref(false);
    const resultados = ref([]);
    const search = ref('');
    const busquedaRealizada = ref(false);
    const detalleDialog = ref(false);
    const icusSeleccionado = ref(null);
    
    // Estado para el snackbar
    const snackbar = reactive({
      show: false,
      text: '',
      color: 'info',
      timeout: 3000
    });
    
    // Filtros para la búsqueda
    const filtros = reactive({
      claveCatastral: '',
      nombres: '',
      numeroDocumento: ''
    });
    
    // No longer needed - removed compatibility dropdown
    
    // Encabezados para la tabla
    const headers = [
      { title: 'ID', value: 'id', sortable: true },
      { title: 'Clave Catastral', value: 'clave_catastral', sortable: true },
      { title: 'Propietario', value: 'propietario', sortable: true },
      { title: 'Actividad', value: 'actividad', sortable: true },
      { title: 'Compatibilidad', value: 'compatibilidad', sortable: true },
      { title: 'Fecha', value: 'fecha', sortable: true },
      { title: 'Acciones', value: 'actions', sortable: false, align: 'center' }
    ];
    
    // Método para realizar la búsqueda
    const buscar = async () => {
      if (
        !filtros.claveCatastral && 
        !filtros.nombres && 
        !filtros.numeroDocumento
      ) {
        showSnackbar('Debe ingresar al menos un criterio de búsqueda', 'warning');
        return;
      }
      
      loading.value = true;
      busquedaRealizada.value = true;
      
      try {
        // Primero buscar por datos del titular si se proporcionaron
        if (filtros.claveCatastral || filtros.nombres || filtros.numeroDocumento) {
          const titularesResponse = await datosTitularService.busquedaAvanzada({
            claveCatastral: filtros.claveCatastral,
            nombres: filtros.nombres,
            numeroDocumento: filtros.numeroDocumento
          });
          
          if (titularesResponse.data && titularesResponse.data.data && titularesResponse.data.data.length > 0) {
            // Crear un array de claves catastrales para buscar ICUS relacionados
            const clavesCatastrales = titularesResponse.data.data.map(titular => titular.clave_catastral);
            
            console.log('Claves catastrales encontradas:', clavesCatastrales);
            
            // Buscar ICUS para estas claves catastrales (enviar como string para evitar problemas con el querystring)
            await buscarICUSPorCriterios({ clavesCatastrales: JSON.stringify(clavesCatastrales) });
          } else {
            // No se encontraron titulares
            resultados.value = [];
            showSnackbar('No se encontraron titulares con los criterios especificados', 'info');
          }
        } else {
          // Buscar directamente por criterios de ICUS
          await buscarICUSPorCriterios({});
        }
      } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
        showSnackbar('Ocurrió un error al realizar la búsqueda', 'error', 5000);
      } finally {
        loading.value = false;
      }
    };
    
    // Función para buscar ICUS por criterios
    const buscarICUSPorCriterios = async (criteriosAdicionales) => {
      try {
        const params = {
          ...criteriosAdicionales
        };
        
        console.log("Buscando ICUS con parámetros:", params);
        console.log("URL de API:", API_BASE_URL);
        
        const response = await axios.get(`${API_BASE_URL}/icus/buscar`, { 
          params,
          headers: {
            Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined
          }
        });
        
        console.log("Respuesta API:", response);
        
        if (response.data && response.data.success !== false) {
          resultados.value = response.data.data || [];
          
          if (resultados.value.length === 0) {
            showSnackbar('No se encontraron ICUS con los criterios especificados', 'info');
          } else {
            showSnackbar(`Se encontraron ${resultados.value.length} registros`, 'success');
          }
        } else {
          resultados.value = [];
          showSnackbar('No se encontraron ICUS con los criterios especificados', 'info');
        }
      } catch (error) {
        console.error('Error al buscar ICUS:', error);
        showSnackbar(`Error al buscar información de ICUS: ${error.response?.status === 404 ? 'Endpoint no encontrado' : error.message}`, 'error', 5000);
        resultados.value = [];
      }
    };
    
    // Método para limpiar filtros
    const limpiarFiltros = () => {
      filtros.claveCatastral = '';
      filtros.nombres = '';
      filtros.numeroDocumento = '';
      resultados.value = [];
      busquedaRealizada.value = false;
    };
    
    // Método para ver detalles de un ICUS
    const verDetalle = (item) => {
      icusSeleccionado.value = item;
      detalleDialog.value = true;
    };
    
    // Método para generar informe
    const generarInforme = (item) => {
      // Navegar al componente de informe y pasar el ID del ICUS
      router.push({
        name: 'ReporteIcus',
        params: { id: item.id },
        query: { 
          datosIcus: JSON.stringify(item),
          claveCatastral: item.clave_catastral
        }
      });
      
      showSnackbar(`Generando certificado ICUS para: ${item.propietario || 'predio'}`, 'success');
    };
    
    // Método para salir de la página
    const salir = () => {
      router.push('/'); // Navega a la página principal
    };
    
    // Método para mostrar notificaciones con snackbar
    const showSnackbar = (text, color = 'info', timeout = 3000) => {
      snackbar.text = text;
      snackbar.color = color;
      snackbar.timeout = timeout;
      snackbar.show = true;
    };
    
    // Método para dar formato a la fecha
    const formatearFecha = (fecha) => {
      if (!fecha) return 'No especificada';
      
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return fecha; // Si la fecha es inválida, devolver el string original
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    };
    
    // Método para obtener el color de la compatibilidad
    const getCompatibilidadColor = (compatibilidad) => {
      if (!compatibilidad) return 'grey';
      
      const comp = compatibilidad.toLowerCase();
      if (comp.includes('no compatible')) return 'error';
      if (comp.includes('condicion')) return 'warning';
      if (comp.includes('compatible')) return 'success';
      return 'grey';
    };
    
    return {
      form,
      filtros,
      loading,
      resultados,
      headers,
      search,
      busquedaRealizada,
      detalleDialog,
      icusSeleccionado,
      snackbar,
      buscar,
      limpiarFiltros,
      verDetalle,
      generarInforme,
      salir,
      formatearFecha,
      getCompatibilidadColor
    };
  }
};
</script>

<style scoped>
/* Container styles */
.main-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #ebf0f6 100%);
  min-height: calc(100vh - 56px);
  padding: 20px 16px;
  border-radius: 8px;
}

/* Header card styles */
.header-card {
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(39, 110, 144, 0.08) !important;
  border: 1px solid #e0e0e0;
}

.header-accent-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #276E90, #4C7031);
}

.title-text {
  line-height: 1.2;
  margin-bottom: 4px;
  color: #276E90;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.7);
}

.subtitle-text {
  line-height: 1.2;
  color: rgba(0, 0, 0, 0.7);
}

.logo-shadow {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Search card styles */
.search-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(39, 110, 144, 0.08) !important;
  border: 1px solid #e0e0e0;
}

.search-card-title {
  background-color: #276E90;
  color: white !important;
  font-weight: 500;
  padding-top: 12px;
  padding-bottom: 12px;
}

.search-card-content {
  background-color: #ffffff;
  padding: 20px;
}

/* Results card styles */
.results-card {
  background-color: #ffffff;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(39, 110, 144, 0.08) !important;
  border: 1px solid #e0e0e0;
}

.results-accent-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #4C7031, #668A4C);
}

.results-card-title {
  background-color: #f8f9fa;
  color: #276E90 !important;
  border-bottom: 1px solid #e5e7eb;
}

.search-field {
  max-width: 250px;
}

/* Dialog styles */
.dialog-card {
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.dialog-accent-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, #276E90, #4C7031);
}

.dialog-card-title {
  background-color: #f8f9fa;
  color: #276E90 !important;
  border-bottom: 1px solid #e5e7eb;
}

/* No results alert */
.no-results-alert {
  background-color: #eef6fb !important;
  border-left-color: #276E90 !important;
}

/* Data table */
.v-data-table :deep(.v-data-table__wrapper) {
  overflow-x: auto;
}

.v-data-table :deep(.v-data-table__wrapper table) {
  border-collapse: separate;
  border-spacing: 0;
}

.v-data-table :deep(thead th) {
  background-color: #f8f9fa;
  color: #276E90 !important;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
}

.v-data-table :deep(tbody tr:hover) {
  background-color: #f1f5f9 !important;
}

/* Responsive text */
@media (max-width: 600px) {
  .text-h5 {
    font-size: 1rem !important;
  }
  
  .text-caption {
    font-size: 0.7rem !important;
  }
  
  .main-container {
    padding: 12px 8px;
  }
}
</style>
