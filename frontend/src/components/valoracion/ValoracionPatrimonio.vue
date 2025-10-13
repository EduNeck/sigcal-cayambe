<template>
  <v-app-bar color="#BDBDBD" :elevation="1" class="app-bar-custom">
    <v-app-bar-title class="app-bar-title-custom">Valoración Patrimonio</v-app-bar-title>
  </v-app-bar>

  <v-container class="container fill-height">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Valoración Patrimonio</h2>
      </v-col>

      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenu">Salir</v-btn>
        <v-btn class="btn_app mx-2 my-2" color="primary" @click="generaValoracion" :loading="loading">Refrescar</v-btn>
      </v-col>

      <v-col cols="12">
        <v-card class="pa-4 neutral-card" style="position:relative;">
          <!-- Overlay de carga corregido para Vuetify 3 -->
          <v-overlay 
            v-model="loading" 
            class="align-center justify-center"
            contained
          >
            <div class="text-center">
              <v-progress-circular 
                indeterminate 
                color="primary" 
                size="64" 
              ></v-progress-circular>
              <div class="mt-3 text-h6">Cargando valoraciones...</div>
            </div>
          </v-overlay>
          <v-data-table
            :headers="headers"
            :items="valoracionPatrimonio"
            :search="search"
            item-value="id_predio"
            show-expand
            density="compact"
            :items-per-page="15"
            :items-per-page-options="[10, 15, 25, 50, 100]"
            class="elevation-1"
            hover
            fixed-header
            height="600px"
          >
            <template v-slot:top>
              <v-toolbar flat class="d-flex flex-wrap justify-center align-center">
                <v-toolbar-title class="toolbar-title text-center mr-4">
                  Valoración Patrimonial
                  <v-chip v-if="valoracionPatrimonio.length > 0" class="ml-2" size="small" color="primary">
                    {{ valoracionPatrimonio.length }} registros
                  </v-chip>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-inner-icon="mdi-magnify"
                  label="Buscar en todos los campos..."
                  single-line
                  hide-details
                  clearable
                  density="compact"
                  style="max-width: 300px;"
                  class="white-text-field"
                ></v-text-field>
              </v-toolbar>
            </template>

            <!-- Slots personalizados con formato y colores -->
            <template v-slot:item.clave_catastral="{ item }">
              <v-chip size="small" color="info" variant="outlined">
                {{ item.clave_catastral }}
              </v-chip>
            </template>

            <template v-slot:item.propietario="{ item }">
              <div class="text-truncate" style="max-width: 180px;" :title="item.propietario">
                {{ item.propietario }}
              </div>
            </template>

            <template v-slot:item.area_suelo_porcentual="{ item }">
              <span class="font-weight-medium text-teal">
                {{ formatValue(item.area_suelo_porcentual, 'area_suelo_porcentual') }}
              </span>
            </template>

            <template v-slot:item.avaluo_predio_porcentual="{ item }">
              <span class="font-weight-bold text-success">
                {{ formatValue(item.avaluo_predio_porcentual, 'avaluo_predio_porcentual') }}
              </span>
            </template>

            <template v-slot:item.valor_suelo_porcentual="{ item }">
              <span class="font-weight-medium text-blue">
                {{ formatValue(item.valor_suelo_porcentual, 'valor_suelo_porcentual') }}
              </span>
            </template>

            <template v-slot:item.valor_construcciones_porcentual="{ item }">
              <span class="font-weight-medium text-orange">
                {{ formatValue(item.valor_construcciones_porcentual, 'valor_construcciones_porcentual') }}
              </span>
            </template>

            <template v-slot:item.valor_instalaciones_porcentual="{ item }">
              <span class="font-weight-medium text-purple">
                {{ formatValue(item.valor_instalaciones_porcentual, 'valor_instalaciones_porcentual') }}
              </span>
            </template>

            <template v-slot:item.ph="{ item }">
              <v-chip 
                size="small" 
                :color="item.ph === 'URBANO' ? 'success' : item.ph === 'RURAL' ? 'warning' : 'default'"
                variant="flat"
              >
                {{ item.ph }}
              </v-chip>
            </template>

            <!-- Estado sin datos mejorado -->
            <template v-slot:no-data>
              <div class="text-center pa-8">
                <v-icon size="64" color="grey-lighten-2">mdi-database-search-outline</v-icon>
                <div class="text-h6 mt-4 text-grey">No hay datos disponibles</div>
                <div class="text-body-2 text-grey mt-2">
                  {{ search ? 'No se encontraron resultados para la búsqueda' : 'Haga clic en "Refrescar" para cargar los datos' }}
                </div>
                <v-btn 
                  v-if="!search" 
                  color="primary" 
                  variant="outlined" 
                  class="mt-4"
                  @click="generaValoracion"
                  :loading="loading"
                >
                  <v-icon start>mdi-refresh</v-icon>
                  Cargar Datos
                </v-btn>
              </div>
            </template>

            <!-- Detalle expandido más organizado -->
            <template v-slot:expanded-row="{ item }">
              <td :colspan="headers.length" class="pa-0">
                <v-card flat class="pa-4 bg-grey-lighten-5">
                  <v-card-title class="text-h6 pb-2">
                    <v-icon start color="info">mdi-information-outline</v-icon>
                    Detalles del Predio: {{ item.clave_catastral }}
                  </v-card-title>
                  <v-divider class="mb-4"></v-divider>
                  <v-row>
                    <v-col cols="12" sm="6" md="4" lg="3" v-for="(value, key) in item" :key="key">
                      <v-card variant="outlined" class="pa-2" style="height: 100%;">
                        <div class="text-caption text-grey font-weight-bold mb-1">
                          {{ formatLabel(key) }}
                        </div>
                        <div class="text-body-2 font-weight-medium">
                          {{ formatValue(value, key) }}
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </td>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Snackbar para mensajes -->
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="4000"
    location="top right"
  >
    {{ snackbar.message }}
    <template #actions>
      <v-btn
        variant="text"
        @click="snackbar.show = false"
      >
        Cerrar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig.js';

export default {
  name: 'ValoracionPatrimonio',
  data() {
    return {
      search: '',
      valoracionPatrimonio: [],
      loading: false,
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },
      headers: [
        { 
          title: 'Clave Catastral', 
          key: 'clave_catastral',
          sortable: true,
          width: '160px',
          align: 'start'
        },
        { 
          title: 'Propietario', 
          key: 'propietario',
          sortable: true,
          width: '200px',
          align: 'start'
        },
        { 
          title: 'Parroquia', 
          key: 'parroquia',
          sortable: true,
          width: '120px',
          align: 'start'
        },
        { 
          title: 'PH', 
          key: 'ph',
          sortable: true,
          width: '80px',
          align: 'center'
        },
        { 
          title: 'Área Suelo', 
          key: 'area_suelo_porcentual',
          sortable: true,
          width: '120px',
          align: 'end'
        },
        { 
          title: 'Avalúo', 
          key: 'avaluo_predio_porcentual',
          sortable: true,
          width: '140px',
          align: 'end'
        },
        { 
          title: 'Valor Suelo', 
          key: 'valor_suelo_porcentual',
          sortable: true,
          width: '140px',
          align: 'end'
        },
        { 
          title: 'Valor Construcción', 
          key: 'valor_construcciones_porcentual',
          sortable: true,
          width: '160px',
          align: 'end'
        },
        { 
          title: 'Valor Instalación', 
          key: 'valor_instalaciones_porcentual',
          sortable: true,
          width: '150px',
          align: 'end'
        },
        { 
          title: 'Año', 
          key: 'anio_proceso',
          sortable: true,
          width: '100px',
          align: 'center'
        },
        { title: 'Expandir', value: 'data-table-expand' },
      ],
    };
  },
  methods: {
    async generaValoracion() {
      this.loading = true;
      this.showSnackbar('Cargando valoraciones...', 'info');
      
      try {
        const response = await axios.get(`${API_BASE_URL}/valores_patrimonio_urb`);
        
        if (response.data && Array.isArray(response.data)) {
          this.valoracionPatrimonio = response.data;
          this.showSnackbar(
            `Se cargaron ${response.data.length} registros correctamente`, 
            'success'
          );
        } else {
          this.valoracionPatrimonio = [];
          this.showSnackbar('No se encontraron datos', 'warning');
        }
      } catch (error) {
        console.error('Error fetching valoracion patrimonio:', error);
        this.valoracionPatrimonio = [];
        
        let errorMessage = 'Error al cargar los datos';
        if (error.response) {
          errorMessage = `Error ${error.response.status}: ${error.response.data?.message || 'Error del servidor'}`;
        } else if (error.request) {
          errorMessage = 'No se pudo conectar con el servidor';
        }
        
        this.showSnackbar(errorMessage, 'error');
      } finally {
        this.loading = false;
      }
    },

    showSnackbar(message, color = 'success') {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },

    navigateToMenu() {
      this.$router.push('/menu-predial');
    },

    formatLabel(key) {
      return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    },

    formatValue(value, key = '') {
      if (value === null || value === undefined || value === '') {
        return '-';
      }

      const num = parseFloat(value);
      
      if (!isNaN(num)) {
        // Formatear valores monetarios
        if (key.toLowerCase().includes('valor') || 
            key.toLowerCase().includes('avaluo') || 
            key.toLowerCase().includes('precio')) {
          return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(num);
        }
        
        // Formatear áreas y números con decimales
        if (key.toLowerCase().includes('area') || 
            key.toLowerCase().includes('superficie') ||
            key.toLowerCase().includes('porcentual')) {
          return new Intl.NumberFormat('es-EC', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(num) + (key.toLowerCase().includes('area') ? ' m²' : '');
        }
        
        // Números enteros
        if (Number.isInteger(num)) {
          return new Intl.NumberFormat('es-EC').format(num);
        }
        
        // Números con decimales
        return new Intl.NumberFormat('es-EC', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(num);
      }
      
      return value;
    },
  },
  created() {
    this.generaValoracion();
  },
};
</script>

<style scoped>
.titulo-pantalla {
  font-size: 2rem;
  color: #333333;
}

.container {
  background-color: #E8E8E8;
}

.app-bar-custom {
  background-color: #BDBDBD;
}

.app-bar-title-custom {
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333333;
  letter-spacing: 1px;
}

.btn_app {
  background-color: #8C8C8C;
  color: #FFFFFF;
  font-weight: 600;
  border-radius: 8px;
  min-width: 120px;
  font-size: 1rem;
}

.v-btn {
  margin-top: 20px;
}

.white-text-field {
  background-color: #FFFFFF !important;
  border-radius: 8px;
  min-width: 250px;
  max-width: 300px;
}

.white-text-field .v-field__input {
  color: #333 !important;
}

.neutral-card {
  background-color: #F7F6F2;
  border: 1px solid #D6D6D6;
  margin: 0 auto;
  overflow: hidden;
}

.toolbar-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.v-data-table {
  background-color: white;
  border-radius: 8px;
}

/* Mejorar visibilidad de la tabla */
.v-data-table .v-data-table__wrapper {
  overflow-x: auto;
  overflow-y: auto;
}

.v-data-table thead th {
  background-color: #f5f5f5 !important;
  font-weight: 600 !important;
  color: #333 !important;
  border-bottom: 2px solid #e0e0e0 !important;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 2;
}

.v-data-table tbody tr:hover {
  background-color: #f8f9fa !important;
}

.v-data-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

/* Mejorar la visualización de chips */
.v-chip {
  font-size: 0.75rem !important;
  height: 24px !important;
}

/* Estilos para texto truncado */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Overlay de carga mejorado */
.v-overlay {
  background-color: rgba(255, 255, 255, 0.9) !important;
}

.v-overlay .v-overlay__content {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Mejorar la vista responsiva */
@media (max-width: 960px) {
  .v-data-table {
    font-size: 0.875rem;
  }
  
  .v-data-table thead th {
    padding: 8px 4px !important;
  }
  
  .v-data-table tbody td {
    padding: 8px 4px !important;
  }
}

/* Estilos para el estado sin datos */
.v-data-table .v-data-table__empty-wrapper {
  padding: 48px 24px;
}

/* Mejorar la visualización de números */
.font-weight-medium {
  font-family: 'Roboto', sans-serif;
  letter-spacing: 0.025em;
}

.font-weight-bold {
  font-family: 'Roboto', sans-serif;
  letter-spacing: 0.025em;
}
</style>
