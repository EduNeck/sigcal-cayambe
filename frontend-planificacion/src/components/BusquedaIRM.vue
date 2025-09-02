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
            <h1 class="text-h5 font-weight-bold title-text">INFORME DE REGULACIÓN MUNICIPAL</h1>
            <h2 class="text-caption text-wrap subtitle-text">Gobierno Autónomo Descentralizado Intercultural y Plurinacional del Municipio de Cayambe</h2>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mb-6 search-card" elevation="3">
      <v-card-title class="search-card-title">
        <v-icon left class="mr-2">mdi-magnify</v-icon>
        Búsqueda de Titulares
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
      
      <!-- Eliminamos la paginación -->
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
          <v-icon left class="mr-2">mdi-account-details</v-icon>
          Detalles del Titular
          <v-spacer></v-spacer>
          <v-btn icon @click="detalleDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="titularSeleccionado">
          <v-row>
            <v-col cols="6">
              <p><strong>Clave Catastral:</strong> {{ titularSeleccionado.clave_catastral }}</p>
              <p><strong>Nombres:</strong> {{ titularSeleccionado.nombres }}</p>
              <p><strong>Número Documento:</strong> {{ titularSeleccionado.numero_documento }}</p>
              <p><strong>Parroquia:</strong> {{ titularSeleccionado.parroquia }}</p>
              <p><strong>Sector:</strong> {{ titularSeleccionado.sector }}</p>
            </v-col>
            <v-col cols="6">
              <p><strong>Régimen:</strong> {{ titularSeleccionado.regimen }}</p>
              <p><strong>Derechos:</strong> {{ titularSeleccionado.derechos }}</p>
              <p><strong>Área Construida:</strong> {{ titularSeleccionado.area_construida }}</p>
              <p><strong>Área Escritura:</strong> {{ titularSeleccionado.area_escritura }}</p>
              <p><strong>Área Gráfica:</strong> {{ titularSeleccionado.area_grafica }}</p>
            </v-col>
          </v-row>
          <!-- Información geográfica desactivada temporalmente -->
          <!-- <v-row v-if="titularSeleccionado.poligono_geojson">
            <v-col cols="12">
              <div ref="map" style="height: 300px;"></div>
            </v-col>
          </v-row> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="generarInforme(titularSeleccionado)">
            Visualizar Informe
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
import datosTitularService from '@/services/datosTitularService';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'BusquedaIRM',
  
  setup() {
    const router = useRouter();
    const form = ref(null);
    const loading = ref(false);
    const resultados = ref([]);
    const search = ref('');
    const busquedaRealizada = ref(false);
    const detalleDialog = ref(false);
    const titularSeleccionado = ref(null);
    const map = ref(null);
    
    // Estado para el snackbar
    const snackbar = reactive({
      show: false,
      text: '',
      color: 'info',
      timeout: 3000
    });
    
    const filtros = reactive({
      claveCatastral: '',
      nombres: '',
      numeroDocumento: ''
    });
    
    // Eliminamos la variable pagination
    
    const headers = [
      { title: 'Clave Catastral', value: 'clave_catastral', sortable: true },
      { title: 'Nombres', value: 'nombres', sortable: true },
      { title: 'Número de Cédula', value: 'numero_documento', sortable: true },
      { title: 'Tipo Predio', value: 'tipo_predio', sortable: true },
      { title: 'Acciones', value: 'actions', sortable: false, align: 'center' }
    ];
    
    // Método para realizar la búsqueda - sin paginación
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
        const response = await datosTitularService.busquedaAvanzada({
          claveCatastral: filtros.claveCatastral,
          nombres: filtros.nombres,
          numeroDocumento: filtros.numeroDocumento
        });
        
        // Directamente asignamos los datos sin manejar paginación
        resultados.value = response.data.data;
      } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
        showSnackbar('Ocurrió un error al realizar la búsqueda', 'error', 5000);
      } finally {
        loading.value = false;
      }
    };
    
    // Método para limpiar filtros - sin paginación
    const limpiarFiltros = () => {
      filtros.claveCatastral = '';
      filtros.nombres = '';
      filtros.numeroDocumento = '';
      resultados.value = [];
      busquedaRealizada.value = false;
    };
    
    // Método para ver detalles de un titular
    const verDetalle = (item) => {
      titularSeleccionado.value = item;
      detalleDialog.value = true;
    };
    
    // Método para generar informe
    const generarInforme = (item) => {
      // Obtener la clave catastral del item seleccionado
      const claveCatastral = item.clave_catastral;
      
      if (!claveCatastral) {
        showSnackbar('No se pudo obtener la clave catastral del predio', 'error');
        return;
      }
      
      // Navegar al componente de informe y pasar la clave catastral como filtro principal
      router.push({
        name: 'ReporteIRM',
        params: { claveCatastral: encodeURIComponent(claveCatastral) },
        query: { 
          datosTitular: JSON.stringify(item),
          filtro: 'claveCatastral' // Indicar que estamos filtrando por clave catastral
        }
      });
      
      showSnackbar(`Generando certificado para clave catastral: ${claveCatastral}`, 'success');
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
    
    return {
      form,
      filtros,
      loading,
      resultados,
      headers,
      search,
      busquedaRealizada,
      detalleDialog,
      titularSeleccionado,
      snackbar,
      buscar,
      limpiarFiltros,
      verDetalle,
      generarInforme,
      salir
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
