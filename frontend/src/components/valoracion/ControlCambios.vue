<template>
  <v-app-bar :color="tipoPredioActual === 1 ? '#276E90' : '#668A4C'" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center text-white">
      Control de Cambios - {{ tituloTipoPredio }}
    </v-app-bar-title>
  </v-app-bar>

  <v-container fluid>
    <!-- Formulario de filtros -->
    <v-card class="mb-4">
      <v-card-title class="bg-grey-lighten-4 d-flex align-center">
        <v-icon left>mdi-filter</v-icon>
        Filtros de Búsqueda
        <v-spacer></v-spacer>
        <v-chip 
          :color="tipoPredioActual === 1 ? 'blue' : 'green'" 
          dark 
          small
        >
          <v-icon left small>mdi-filter-check</v-icon>
          Solo {{ tituloTipoPredio }}
        </v-chip>
        
        <!-- Mostrar advertencia si no hay tipo definido en el store -->
        <v-chip 
          v-if="!store.getters.getTipoPredio"
          color="orange" 
          dark 
          small
          class="ml-2"
        >
          <v-icon left small>mdi-alert</v-icon>
          Tipo detectado automáticamente
        </v-chip>
      </v-card-title>
      
      <v-card-text>
        <v-form ref="form" @submit.prevent="buscarCambios">
          <v-row>
            <!-- Filtros de fecha -->
            <v-col cols="12" md="3">
              <v-text-field
                v-model="filtros.fecha_inicio"
                label="Fecha Inicio"
                type="date"
                outlined
                dense
                :rules="[rules.required]"
                prepend-inner-icon="mdi-calendar"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="filtros.fecha_fin"
                label="Fecha Fin"
                type="date"
                outlined
                dense
                :rules="[rules.required]"
                prepend-inner-icon="mdi-calendar"
              ></v-text-field>
            </v-col>

            <!-- Filtros adicionales -->
            <v-col cols="12" md="3">
              <v-text-field
                v-model="filtros.clave_catastral"
                label="Clave Catastral"
                outlined
                dense
                clearable
                prepend-inner-icon="mdi-key"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="filtros.usuario_actividad"
                label="Usuario"
                outlined
                dense
                clearable
                prepend-inner-icon="mdi-account"
              ></v-text-field>
            </v-col>

            <!-- Segunda fila de filtros -->
            <v-col cols="12" md="3">
              <v-select
                v-model="filtros.accion_actividad"
                :items="accionesDisponibles"
                label="Acción"
                outlined
                dense
                clearable
                prepend-inner-icon="mdi-cog"
              ></v-select>
            </v-col>

            <!-- Filtro de tipo de predio oculto - se aplica automáticamente -->
            
            <v-col cols="12" md="3">
              <v-select
                v-model="paginacion.pageSize"
                :items="[10, 25, 50, 100]"
                label="Registros por página"
                outlined
                dense
                prepend-inner-icon="mdi-format-list-numbered"
              ></v-select>
            </v-col>

            <!-- Botones -->
            <v-col cols="12" md="6" class="d-flex align-end">
              <v-btn
                color="primary"
                @click="buscarCambios"
                :loading="loading"
                prepend-icon="mdi-magnify"
                class="mr-2"
              >
                Buscar
              </v-btn>
              
              <v-btn
                color="secondary"
                @click="limpiarFiltros"
                :disabled="loading"
                prepend-icon="mdi-refresh"
                class="mr-2"
              >
                Limpiar
              </v-btn>

              <v-btn
                color="success"
                @click="exportarDatos"
                :disabled="loading || cambios.length === 0"
                prepend-icon="mdi-download"
                class="mr-2"
              >
                Exportar
              </v-btn>

              <v-btn
                color="orange"
                @click="abrirValoracion"
                :disabled="loading || registrosSeleccionados.length === 0"
                prepend-icon="mdi-calculator"
                class="mr-2"
              >
                Valoración ({{ registrosSeleccionados.length }})
              </v-btn>

              <v-btn
                color="error"
                @click="salir"
                :disabled="loading"
                prepend-icon="mdi-close"
              >
                Salir
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Grid de datos unificado -->
    <v-card>
      <v-card-title class="bg-primary text-white d-flex align-center">
        <v-icon left color="white">mdi-table</v-icon>
        Control de Cambios - {{ tituloTipoPredio }}
        <v-spacer></v-spacer>
        <v-chip color="white" text-color="primary" v-if="totalRegistros > 0">
          {{ totalRegistros }} registros encontrados
        </v-chip>
        <v-chip 
          color="orange" 
          text-color="white" 
          v-if="registrosSeleccionados.length > 0"
          class="ml-2"
        >
          <v-icon left small>mdi-check-circle</v-icon>
          {{ registrosSeleccionados.length }} seleccionados
        </v-chip>
        
        <!-- Indicador de carga de valoraciones -->
        <v-chip 
          color="info" 
          text-color="white" 
          v-if="loadingValoraciones"
          class="ml-2"
        >
          <v-progress-circular 
            indeterminate 
            color="white" 
            size="16" 
            width="2" 
            class="mr-2"
          ></v-progress-circular>
          Cargando valoraciones...
        </v-chip>
      </v-card-title>

      <v-data-table
        :headers="headersConSeleccion"
        :items="cambios"
        :loading="loading"
        class="elevation-1"
        :items-per-page="10"
        :footer-props="{
          'items-per-page-text': 'Registros por página:',
          'items-per-page-options': [10, 25, 50, 100]
        }"
      >
        <!-- Header personalizado para selección -->
        <template v-slot:header.seleccion>
          <v-checkbox
            :model-value="registrosSeleccionados.length === cambios.length && cambios.length > 0"
            :indeterminate="registrosSeleccionados.length > 0 && registrosSeleccionados.length < cambios.length"
            @click="toggleTodosVisible"
            hide-details
            density="compact"
          ></v-checkbox>
        </template>

        <!-- Slot personalizado para selección individual -->
        <template v-slot:item.seleccion="{ item }">
          <v-checkbox
            :model-value="isRegistroSeleccionado(item)"
            @click="toggleRegistro(item)"
            hide-details
            density="compact"
          ></v-checkbox>
        </template>

        <!-- Slot personalizado para fecha -->
        <template v-slot:item.fecha_actividad="{ item }">
          <v-chip color="info" small>
            {{ formatearFecha(item.fecha_actividad) }}
          </v-chip>
        </template>

        <!-- Slot personalizado para fecha de última valoración -->
        <template v-slot:item.fecha_ultima_valoracion="{ item }">
          <div class="d-flex align-center">
            <v-progress-circular 
              v-if="loadingValoraciones && !item.fecha_ultima_valoracion"
              indeterminate 
              color="primary" 
              size="16"
              width="2"
              class="mr-2"
            ></v-progress-circular>
            
            <v-chip 
              v-if="item.fecha_ultima_valoracion"
              color="success" 
              variant="outlined"
              size="small"
            >
              <v-icon start size="14">mdi-calendar-check</v-icon>
              {{ formatearFecha(item.fecha_ultima_valoracion) }}
            </v-chip>
            
            <v-chip 
              v-else-if="!loadingValoraciones"
              color="warning" 
              variant="outlined"
              size="small"
            >
              <v-icon start size="14">mdi-calendar-remove</v-icon>
              Sin valoración
            </v-chip>
            
            <span v-else class="text-caption text-grey">
              Cargando...
            </span>
          </div>
        </template>

        <!-- Slot personalizado para clave catastral -->
        <template v-slot:item.clave_catastral="{ item }">
          <v-chip color="primary" outlined small>
            {{ item.clave_catastral }}
          </v-chip>
        </template>

        <!-- Slot personalizado para tipo de predio -->
        <template v-slot:item.id_tipo_predio="{ item }">
          <v-chip 
            :color="item.id_tipo_predio === 1 ? 'blue' : 'green'" 
            dark 
            small
          >
            <v-icon left small>
              {{ item.id_tipo_predio === 1 ? 'mdi-city' : 'mdi-pine-tree' }}
            </v-icon>
            {{ item.id_tipo_predio === 1 ? 'URBANO' : 'RURAL' }}
          </v-chip>
        </template>

        <!-- Slot personalizado para acción -->
        <template v-slot:item.accion_actividad="{ item }">
          <v-chip 
            :color="getChipColor(item.accion_actividad)" 
            dark 
            small
          >
            <v-icon left small>
              {{ getActionIcon(item.accion_actividad) }}
            </v-icon>
            {{ item.accion_actividad }}
          </v-chip>
        </template>

        <!-- Slot personalizado para usuario -->
        <template v-slot:item.usuario_actividad="{ item }">
          <div class="d-flex align-center">
            <v-icon left small>mdi-account</v-icon>
            {{ item.usuario_actividad }}
          </div>
        </template>

        <!-- Slot personalizado para fuente -->
        <template v-slot:item.fuente="{ item }">
          <v-chip 
            :color="getFuenteColor(item.fuente)" 
            dark 
            small
          >
            <v-icon left small>
              {{ getFuenteIcon(item.fuente) }}
            </v-icon>
            {{ getFuenteLabel(item.fuente) }}
          </v-chip>
        </template>

        <!-- Estado vacío -->
        <template v-slot:no-data>
          <div class="text-center pa-4">
            <v-icon size="64" color="grey">mdi-database-search</v-icon>
            <div class="text-h6 mt-2">No se encontraron datos</div>
            <div class="text-body-2">
              Ajusta los filtros de búsqueda para encontrar registros
            </div>
          </div>
        </template>

        <!-- Loading -->
        <template v-slot:loading>
          <div class="text-center pa-4">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <div class="text-body-2 mt-2">Cargando datos...</div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <!-- Modal de Valoración -->
  <v-dialog
    v-model="modalValoracion.show"
    max-width="800px"
    persistent
  >
    <v-card>
      <v-card-title class="bg-orange text-white d-flex align-center">
        <v-icon left color="white">mdi-calculator</v-icon>
        Valoración de Predios
        <v-spacer></v-spacer>
        <v-btn
          icon
          color="white"
          @click="cerrarModalValoracion"
          :disabled="modalValoracion.loading"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Configuración inicial -->
        <div v-if="!modalValoracion.completado">
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="modalValoracion.anioSeleccionado"
                :items="aniosDisponibles"
                label="Año de Valoración"
                outlined
                dense
                prepend-inner-icon="mdi-calendar"
                :disabled="modalValoracion.loading"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-chip
                :color="tipoPredioActual === 1 ? 'blue' : 'green'"
                dark
                class="mt-2"
              >
                <v-icon left small>mdi-home-group</v-icon>
                Tipo: {{ tituloTipoPredio }}
              </v-chip>
            </v-col>
          </v-row>

          <!-- Lista de claves a procesar -->
          <v-card variant="outlined" class="mb-4">
            <v-card-subtitle class="bg-grey-lighten-4">
              <v-icon left small>mdi-format-list-bulleted</v-icon>
              Claves Catastrales a Valorar ({{ modalValoracion.clavesCatastrales.length }})
            </v-card-subtitle>
            <v-card-text class="pa-2">
              <v-chip-group column>
                <v-chip
                  v-for="clave in modalValoracion.clavesCatastrales"
                  :key="clave"
                  size="small"
                  color="primary"
                  variant="outlined"
                >
                  {{ clave }}
                </v-chip>
              </v-chip-group>
            </v-card-text>
          </v-card>

          <!-- Progreso de valoración -->
          <div v-if="modalValoracion.loading">
            <v-card variant="outlined">
              <v-card-text>
                <div class="d-flex align-center mb-3">
                  <v-icon color="orange" class="mr-2">mdi-cog</v-icon>
                  <span class="text-h6">Procesando Valoraciones...</span>
                </div>
                
                <v-progress-linear
                  v-model="modalValoracion.progreso.porcentaje"
                  height="20"
                  color="orange"
                  class="mb-2"
                >
                  <template v-slot:default="{ value }">
                    <strong>{{ Math.ceil(value) }}%</strong>
                  </template>
                </v-progress-linear>
                
                <div class="text-center">
                  <span class="text-body-2">
                    {{ modalValoracion.progreso.actual }} de {{ modalValoracion.progreso.total }} predios procesados
                  </span>
                </div>

                <!-- Log de resultados en tiempo real -->
                <v-expansion-panels v-if="modalValoracion.resultados.length > 0" class="mt-4">
                  <v-expansion-panel>
                    <v-expansion-panel-title>
                      <v-icon left>mdi-text-box-outline</v-icon>
                      Ver Log de Proceso
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <div class="log-container" style="max-height: 200px; overflow-y: auto;">
                        <div
                          v-for="(resultado, index) in modalValoracion.resultados"
                          :key="index"
                          class="d-flex align-center mb-1"
                        >
                          <v-icon
                            :color="resultado.success ? 'success' : 'error'"
                            size="small"
                            class="mr-2"
                          >
                            {{ resultado.success ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                          </v-icon>
                          <span class="text-body-2">
                            {{ resultado.clave }}: {{ resultado.mensaje }}
                          </span>
                        </div>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
          </div>
        </div>

        <!-- Resultados finales -->
        <div v-if="modalValoracion.completado && !modalValoracion.loading">
          <v-alert
            type="success"
            icon="mdi-check-circle"
            title="¡Valoración Completada!"
            text="El proceso de valoración ha finalizado exitosamente."
            class="mb-4"
          ></v-alert>

          <!-- Resumen de resultados -->
          <v-card variant="outlined">
            <v-card-subtitle>Resumen de Resultados</v-card-subtitle>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold">{{ modalValoracion.resultados.length }}</div>
                    <div class="text-subtitle-1 text-grey">Total Procesados</div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-center">
                    <div class="text-h4 font-weight-bold text-success">
                      {{ modalValoracion.resultados.filter(r => r.success).length }}
                    </div>
                    <div class="text-subtitle-1 text-grey">Exitosos</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          v-if="!modalValoracion.loading && !modalValoracion.completado"
          color="grey"
          @click="cerrarModalValoracion"
        >
          Cancelar
        </v-btn>
        <v-btn
          v-if="!modalValoracion.loading && !modalValoracion.completado"
          color="orange"
          @click="ejecutarProcesovaloracion"
        >
          <v-icon left>mdi-play</v-icon>
          Iniciar Valoración
        </v-btn>
        <v-btn
          v-if="modalValoracion.completado"
          color="success"
          @click="cerrarModalValoracion"
        >
          <v-icon left>mdi-check</v-icon>
          Finalizar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Snackbar para mensajes -->
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    location="top right"
  >
    {{ snackbar.message }}
    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        @click="snackbar.show = false"
      >
        Cerrar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { API_BASE_URL } from '../../main.js';

// Store de Vuex y Router
const store = useStore();
const router = useRouter();

// Estado reactivo
// Variables reactivas unificadas
const loading = ref(false);
const cambios = ref([]);
const accionesDisponibles = ref([]);
const totalRegistros = ref(0);

// Variables para selección
const registrosSeleccionados = ref([]);
const seleccionarTodos = ref(false);

// Variables para gestión de fechas de valoración
const cacheValoraciones = ref(new Map()); // Cache para evitar consultas repetidas
const loadingValoraciones = ref(false);

// Variables para snackbar
const snackbar = ref({
  show: false,
  message: '',
  color: 'info',
  timeout: 4000
});

// Variables para modal de valoración
const modalValoracion = ref({
  show: false,
  loading: false,
  anioSeleccionado: new Date().getFullYear(),
  clavesCatastrales: [],
  progreso: {
    actual: 0,
    total: 0,
    porcentaje: 0
  },
  resultados: [],
  completado: false
});

// Opciones para filtros
const tiposPredio = [
  { title: 'Urbano', value: 1 },
  { title: 'Rural', value: 2 }
];

// Filtros
const filtros = reactive({
  fecha_inicio: '',
  fecha_fin: '',
  clave_catastral: '',
  usuario_actividad: '',
  accion_actividad: null,
  id_tipo_predio: null
});

// Paginación
const paginacion = reactive({
  page: 1,
  pageSize: 25,
  sortField: 'fecha_actividad',
  sortOrder: 'DESC'
});

// Reglas de validación
const rules = {
  required: value => !!value || 'Campo requerido'
};

// Headers de la tabla
const headers = [
  {
    title: 'Clave Catastral',
    key: 'clave_catastral',
    sortable: true,
    width: '180px'
  },
  {
    title: 'Fecha Actividad',
    key: 'fecha_actividad',
    sortable: true,
    width: '150px'
  },
  {
    title: 'Última Valoración',
    key: 'fecha_ultima_valoracion',
    sortable: true,
    width: '160px'
  },
  {
    title: 'Tipo',
    key: 'id_tipo_predio',
    sortable: true,
    width: '100px'
  },
  {
    title: 'Acción',
    key: 'accion_actividad',
    sortable: true,
    width: '120px'
  },
  {
    title: 'Usuario',
    key: 'usuario_actividad',
    sortable: true,
    width: '150px'
  },
  {
    title: 'Fuente',
    key: 'fuente',
    sortable: true,
    width: '120px'
  }
];

// Computed
const fechasValidas = computed(() => {
  return filtros.fecha_inicio && filtros.fecha_fin;
});

const tipoPredioActual = computed(() => {
  const tipo = store.getters.getTipoPredio;
  
  // Si no hay tipo definido, intentar detectar o usar valor por defecto
  if (!tipo || (tipo !== 1 && tipo !== 2)) {
    console.log('⚠️ No hay tipo de predio válido definido en el store. Usando detección automática.');
    
    // Intentar detectar desde la ruta actual
    const currentRoute = window.location.pathname;
    if (currentRoute.includes('rural')) {
      return 2;
    } else {
      return 1;
    }
  }
  
  return tipo;
});

const tituloTipoPredio = computed(() => {
  return tipoPredioActual.value === 1 ? 'URBANO' : 'RURAL';
});

const aniosDisponibles = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  // Generar años desde 2020 hasta el año actual + 1
  for (let year = 2020; year <= currentYear + 1; year++) {
    years.push({
      title: year.toString(),
      value: year
    });
  }
  return years.reverse(); // Más recientes primero
});

// Headers con columna de selección manual
const headersConSeleccion = computed(() => [
  {
    title: '',
    key: 'seleccion',
    sortable: false,
    width: '50px'
  },
  ...headers
]);

// Métodos

// Función para obtener fecha de última valoración de una clave catastral
const obtenerFechaValoracion = async (claveCatastral) => {
  try {
    // Verificar si ya tenemos la información en cache
    if (cacheValoraciones.value.has(claveCatastral)) {
      const fechaCache = cacheValoraciones.value.get(claveCatastral);
      return fechaCache;
    }

    // Usar axios con configuración para manejar 404 de manera silenciosa
    const response = await axios.get(`${API_BASE_URL}/api/valoracion-por-clave/${claveCatastral}`, {
      validateStatus: function (status) {
        // Considerar tanto 200 como 404 como respuestas válidas
        return status === 200 || status === 404;
      }
    });

    // Si es 404, significa que no hay valorización para esta clave
    if (response.status === 404) {
      cacheValoraciones.value.set(claveCatastral, null);
      return null;
    }
    
    // Si llegamos aquí, es una respuesta 200
    if (response.data && response.data.length > 0) {
      // Verificar que tengan el campo fecha_proceso
      const valoracionesValidas = response.data.filter(v => v.fecha_proceso);
      
      if (valoracionesValidas.length > 0) {
        // Ordenar por fecha_proceso y tomar la más reciente
        const valoraciones = valoracionesValidas.sort((a, b) => new Date(b.fecha_proceso) - new Date(a.fecha_proceso));
        const fechaUltima = valoraciones[0].fecha_proceso;
        
        // Guardar en cache
        cacheValoraciones.value.set(claveCatastral, fechaUltima);
        return fechaUltima;
      } else {
        cacheValoraciones.value.set(claveCatastral, null);
        return null;
      }
    } else {
      // Guardar en cache que no hay valoración
      cacheValoraciones.value.set(claveCatastral, null);
      return null;
    }
  } catch (error) {
    // Solo errores inesperados (no 404) llegan aquí
    console.warn(`Error inesperado al obtener valoración para clave ${claveCatastral}:`, error.message);
    // Guardar en cache que hubo error (tratado como sin valoración)
    cacheValoraciones.value.set(claveCatastral, null);
    return null;
  }
};

// Función para obtener fechas de valoración en lotes (optimizado)
const obtenerFechasValoracionBatch = async (clavesCatastrales) => {
  loadingValoraciones.value = true;
  const resultados = new Map();
  
  try {
    // Filtrar claves que no están en cache
    const clavesNoEnCache = clavesCatastrales.filter(clave => !cacheValoraciones.value.has(clave));
    const clavesEnCache = clavesCatastrales.filter(clave => cacheValoraciones.value.has(clave));
    
    // Agregar datos del cache
    clavesEnCache.forEach(clave => {
      resultados.set(clave, cacheValoraciones.value.get(clave));
    });
    
    // Hacer consultas en paralelo para las claves no cacheadas (máximo 5 simultáneas)
    if (clavesNoEnCache.length > 0) {
      const chunks = [];
      for (let i = 0; i < clavesNoEnCache.length; i += 5) {
        chunks.push(clavesNoEnCache.slice(i, i + 5));
      }
      
      for (let chunk of chunks) {
        const promesas = chunk.map(clave => obtenerFechaValoracion(clave));
        const fechas = await Promise.all(promesas);
        
        chunk.forEach((clave, index) => {
          resultados.set(clave, fechas[index]);
        });
      }
    }
    
    return resultados;
  } catch (error) {
    console.error('Error al obtener fechas de valoración:', error);
    return resultados;
  } finally {
    loadingValoraciones.value = false;
  }
};

// Función para enriquecer los datos con fechas de valoración
const enriquecerConFechasValoracion = async (datosOriginales) => {
  if (!datosOriginales || datosOriginales.length === 0) {
    return datosOriginales;
  }
  
  // Extraer claves catastrales únicas
  const clavesCatastrales = [...new Set(datosOriginales.map(item => item.clave_catastral))];
  
  // Obtener fechas de valoración
  const fechasValoracion = await obtenerFechasValoracionBatch(clavesCatastrales);
  
  // Enriquecer los datos originales
  return datosOriginales.map(item => ({
    ...item,
    fecha_ultima_valoracion: fechasValoracion.get(item.clave_catastral)
  }));
};

// Función para refrescar valoración de una clave específica
const refrescarValoracionClave = async (claveCatastral) => {
  console.log(`🔄 Refrescando valoración para clave: ${claveCatastral}`);
  
  // Limpiar cache
  cacheValoraciones.value.delete(claveCatastral);
  
  // Obtener nueva fecha
  const nuevaFecha = await obtenerFechaValoracion(claveCatastral);
  
  // Actualizar el grid si la clave está presente
  const index = cambios.value.findIndex(item => item.clave_catastral === claveCatastral);
  if (index >= 0) {
    cambios.value[index].fecha_ultima_valoracion = nuevaFecha;
    console.log(`✅ Grid actualizado para ${claveCatastral}:`, nuevaFecha);
  }
  
  return nuevaFecha;
};

const buscarCambios = async () => {
  console.log('🔍 Iniciando búsqueda unificada de cambios...');
  console.log('📅 Fechas válidas:', fechasValidas.value);
  console.log('📊 Filtros actuales:', filtros);
  
  if (!filtros.fecha_inicio || !filtros.fecha_fin) {
    console.log('❌ Fechas no válidas:', { inicio: filtros.fecha_inicio, fin: filtros.fecha_fin });
    mostrarSnackbar('Las fechas de inicio y fin son obligatorias', 'warning');
    return;
  }

  loading.value = true;
  
  try {
    // Asegurar que el filtro del tipo de predio esté actualizado
    filtros.id_tipo_predio = tipoPredioActual.value;
    
    // Aplicar automáticamente el filtro del tipo de predio actual
    const filtrosConTipo = {
      ...filtros,
      id_tipo_predio: tipoPredioActual.value,
      page: paginacion.page,
      pageSize: paginacion.pageSize,
      sortField: paginacion.sortField,
      sortOrder: paginacion.sortOrder
    };
    
    const params = new URLSearchParams();
    
    // Agregar parámetros
    Object.keys(filtrosConTipo).forEach(key => {
      if (filtrosConTipo[key] !== null && filtrosConTipo[key] !== '' && filtrosConTipo[key] !== undefined) {
        params.append(key, filtrosConTipo[key]);
      }
    });
    
    console.log('🔍 Buscando cambios totales para tipo:', filtrosConTipo.id_tipo_predio === 1 ? 'URBANO' : 'RURAL');

    // Remover parámetros vacíos
    Object.keys(filtros).forEach(key => {
      if (!filtros[key]) {
        params.delete(key);
      }
    });

    const url = `${API_BASE_URL}/api/auditoria/cambios-total?${params}`;
    console.log('🌐 URL de consulta:', url);
    console.log('📨 Parámetros enviados:', params.toString());

    const response = await fetch(url);
    console.log('📥 Respuesta del servidor:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📦 Datos recibidos:', data);

    if (data.success) {
      const datosOriginales = data.data || []; // Asegurar array vacío si no hay datos
      totalRegistros.value = data.pagination?.total || 0;
      
      console.log('✅ Datos base obtenidos:', { 
        totalCambios: datosOriginales.length, 
        totalRegistros: totalRegistros.value 
      });

      // Enriquecer con fechas de valoración
      if (datosOriginales.length > 0) {
        console.log('🔄 Enriqueciendo datos con fechas de valoración...');
        mostrarSnackbar(`Cargando fechas de valoración para ${datosOriginales.length} registros...`, 'info');
        
        try {
          const datosEnriquecidos = await enriquecerConFechasValoracion(datosOriginales);
          cambios.value = datosEnriquecidos;
          
          const clavesCongValoracion = datosEnriquecidos.filter(item => item.fecha_ultima_valoracion).length;
          console.log('✅ Datos enriquecidos:', { 
            total: datosEnriquecidos.length,
            conValoracion: clavesCongValoracion,
            sinValoracion: datosEnriquecidos.length - clavesCongValoracion
          });
          
          mostrarSnackbar(
            `✅ Cargados ${datosEnriquecidos.length} registros (${clavesCongValoracion} con valoración)`, 
            'success'
          );
        } catch (error) {
          console.error('Error al enriquecer con valoraciones:', error);
          cambios.value = datosOriginales; // Usar datos originales si falla el enriquecimiento
          mostrarSnackbar('Datos cargados sin fechas de valoración', 'warning');
        }
      } else {
        cambios.value = datosOriginales;
        mostrarSnackbar('No se encontraron registros para el período seleccionado', 'info');
      }
    } else {
      console.error('❌ Error en respuesta del servidor:', data.message);
      mostrarSnackbar('Error al obtener los datos: ' + data.message, 'error');
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    mostrarSnackbar('Error de conexión al servidor', 'error');
  } finally {
    loading.value = false;
  }
};

const obtenerAccionesDisponibles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auditoria/acciones-totales-disponibles`);
    const data = await response.json();
    
    if (data.success) {
      accionesDisponibles.value = data.data;
      console.log('✅ Acciones totales disponibles cargadas:', data.data);
    }
  } catch (error) {
    console.error('Error al obtener acciones totales:', error);
  }
};

const limpiarFiltros = () => {
  Object.keys(filtros).forEach(key => {
    if (key !== 'id_tipo_predio') { // No limpiar el tipo de predio automático
      filtros[key] = '';
    }
  });
  filtros.accion_actividad = null;
  // filtros.id_tipo_predio se mantiene para el filtro automático
  cambios.value = [];
  totalRegistros.value = 0;
  paginacion.page = 1;
};

const actualizarTabla = (options) => {
  if (options.page) paginacion.page = options.page;
  if (options.itemsPerPage) paginacion.pageSize = options.itemsPerPage;
  if (options.sortBy && options.sortBy.length > 0) {
    paginacion.sortField = options.sortBy[0].key;
    paginacion.sortOrder = options.sortBy[0].order === 'asc' ? 'ASC' : 'DESC';
  }
  
  if (fechasValidas.value) {
    buscarCambios();
  }
};

const formatearFecha = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getColorAccion = (accion) => {
  const colores = {
    'INSERT': 'success',
    'UPDATE': 'warning',
    'DELETE': 'error',
    'CREATE': 'info',
    'MODIFY': 'orange'
  };
  return colores[accion] || 'grey';
};

const getActionIcon = (accion) => {
  const iconos = {
    'INSERT': 'mdi-plus',
    'UPDATE': 'mdi-pencil',
    'DELETE': 'mdi-delete',
    'CREATE': 'mdi-plus-circle',
    'MODIFY': 'mdi-pencil-circle'
  };
  return iconos[accion] || 'mdi-help-circle';
};

const getChipColor = (accion) => {
  const colores = {
    'INSERT': 'success',
    'UPDATE': 'info',
    'DELETE': 'error',
    'CREATE': 'primary',
    'MODIFY': 'warning'
  };
  return colores[accion] || 'grey';
};

const exportarDatos = () => {
  if (cambios.value.length === 0) return;

  const csv = [
    // Header
    headers.map(h => h.title).join(','),
    // Data
    ...cambios.value.map(item => 
      headers.map(h => item[h.key] || '').join(',')
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cambios_predios_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Funciones de selección
const limpiarSeleccion = () => {
  registrosSeleccionados.value = [];
};

const seleccionarTodosVisible = () => {
  registrosSeleccionados.value = [...cambios.value];
};

const exportarSeleccionados = () => {
  if (registrosSeleccionados.value.length === 0) return;

  const csv = [
    // Header
    headers.map(h => h.title).join(','),
    // Data
    ...registrosSeleccionados.value.map(item => 
      headers.map(h => item[h.key] || '').join(',')
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cambios_seleccionados_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Función helper para mostrar snackbar
const mostrarSnackbar = (message, color = 'info') => {
  snackbar.value = {
    show: true,
    message,
    color,
    timeout: 4000
  };
};

// Funciones del modal de valoración
const cerrarModalValoracion = () => {
  if (!modalValoracion.value.loading) {
    modalValoracion.value = {
      show: false,
      loading: false,
      anioSeleccionado: new Date().getFullYear(),
      clavesCatastrales: [],
      progreso: {
        actual: 0,
        total: 0,
        porcentaje: 0
      },
      resultados: [],
      completado: false
    };
  }
};

const ejecutarProcesovaloracion = async () => {
  if (modalValoracion.value.clavesCatastrales.length === 0) {
    mostrarSnackbar('No hay claves catastrales seleccionadas', 'warning');
    return;
  }

  modalValoracion.value.loading = true;
  modalValoracion.value.completado = false;
  modalValoracion.value.resultados = [];
  modalValoracion.value.progreso.actual = 0;
  modalValoracion.value.progreso.total = modalValoracion.value.clavesCatastrales.length;
  modalValoracion.value.progreso.porcentaje = 0;

  const usuario = store.state.usuario || 'sistema'; // Obtener usuario del store
  
  try {
    for (let i = 0; i < modalValoracion.value.clavesCatastrales.length; i++) {
      const clave = modalValoracion.value.clavesCatastrales[i];
      
      try {
        // Llamar al API de valoración
        const response = await fetch(`${API_BASE_URL}/api/ejecuta_valoracion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pr_anio: modalValoracion.value.anioSeleccionado,
            var_tipo: tipoPredioActual.value,
            pr_clave: clave,
            var_usuario: usuario
          })
        });

        const result = await response.json();
        
        if (response.ok) {
          modalValoracion.value.resultados.push({
            clave: clave,
            success: true,
            mensaje: 'Valoración ejecutada correctamente'
          });
        } else {
          modalValoracion.value.resultados.push({
            clave: clave,
            success: false,
            mensaje: result.error || 'Error desconocido'
          });
        }
      } catch (error) {
        console.error(`Error valorando ${clave}:`, error);
        modalValoracion.value.resultados.push({
          clave: clave,
          success: false,
          mensaje: 'Error de conexión'
        });
      }

      // Actualizar progreso
      modalValoracion.value.progreso.actual = i + 1;
      modalValoracion.value.progreso.porcentaje = ((i + 1) / modalValoracion.value.progreso.total) * 100;
      
      // Pequeña pausa para permitir que la UI se actualice
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    modalValoracion.value.loading = false;
    modalValoracion.value.completado = true;
    
    const exitosos = modalValoracion.value.resultados.filter(r => r.success).length;
    const total = modalValoracion.value.resultados.length;
    
    mostrarSnackbar(
      `Proceso completado: ${exitosos}/${total} valoraciones exitosas`, 
      exitosos === total ? 'success' : 'warning'
    );

  } catch (error) {
    console.error('Error general en el proceso de valoración:', error);
    modalValoracion.value.loading = false;
    mostrarSnackbar('Error inesperado durante el proceso de valoración', 'error');
  }
};

const onSelectionChange = (selected) => {
  console.log('🔄 Evento de cambio de selección detectado:', selected);
  console.log('Cantidad seleccionada:', selected?.length || 0);
};

// Funciones de selección manual
const toggleRegistro = (registro) => {
  const index = registrosSeleccionados.value.findIndex(r => r.indice_actividad === registro.indice_actividad);
  if (index >= 0) {
    registrosSeleccionados.value.splice(index, 1);
  } else {
    registrosSeleccionados.value.push(registro);
  }
  console.log('✅ Registro toggleado:', registro.clave_catastral);
  console.log('📊 Total seleccionados:', registrosSeleccionados.value.length);
};

const isRegistroSeleccionado = (registro) => {
  return registrosSeleccionados.value.some(r => r.indice_actividad === registro.indice_actividad);
};

const toggleTodosVisible = () => {
  if (registrosSeleccionados.value.length === cambios.value.length) {
    // Si todos están seleccionados, deseleccionar todos
    registrosSeleccionados.value = [];
  } else {
    // Si no todos están seleccionados, seleccionar todos
    registrosSeleccionados.value = [...cambios.value];
  }
  console.log('🔄 Toggle todos - Total seleccionados:', registrosSeleccionados.value.length);
};

const abrirValoracion = () => {
  console.log('🧮 Función abrirValoracion ejecutada');
  console.log('📊 Registros seleccionados:', registrosSeleccionados.value);
  console.log('📊 Cantidad de registros seleccionados:', registrosSeleccionados.value.length);
  
  if (registrosSeleccionados.value.length === 0) {
    console.log('❌ No hay registros seleccionados, saliendo...');
    return;
  }
  
  // Con return-object, registrosSeleccionados contiene objetos completos
  const clavesCatastrales = [...new Set(registrosSeleccionados.value.map(item => item.clave_catastral))];  
  console.log('🔑 Claves catastrales extraídas:', clavesCatastrales);
  
  // Configurar y abrir el modal de valoración
  modalValoracion.value = {
    show: true,
    loading: false,
    anioSeleccionado: new Date().getFullYear(),
    clavesCatastrales: clavesCatastrales,
    progreso: {
      actual: 0,
      total: clavesCatastrales.length,
      porcentaje: 0
    },
    resultados: [],
    completado: false
  };
};

const salir = () => {
  // Navegar al menú predial usando el router
  router.push('/menu-predial');
};

// Funciones helper para fuentes
const getFuenteColor = (fuente) => {
  const fuentesGeograficas = ['geo_predio', 'geo_bloque', 'geo_manzana', 'geo_limite', 'geo_construccion'];
  const fuentesPredios = ['predios', 'predio', 'avaluos', 'tenencia', 'mejoras'];
  const fuentesVias = ['vias', 'via'];
  
  if (fuentesGeograficas.includes(fuente)) {
    return 'teal';
  } else if (fuentesPredios.includes(fuente)) {
    return 'orange';
  } else if (fuentesVias.includes(fuente)) {
    return 'purple';
  } else {
    return 'grey';
  }
};

const getFuenteIcon = (fuente) => {
  const fuentesGeograficas = ['geo_predio', 'geo_bloque', 'geo_manzana', 'geo_limite', 'geo_construccion'];
  const fuentesPredios = ['predios', 'predio', 'avaluos', 'tenencia', 'mejoras'];
  const fuentesVias = ['vias', 'via'];
  
  if (fuentesGeograficas.includes(fuente)) {
    return 'mdi-map';
  } else if (fuentesPredios.includes(fuente)) {
    return 'mdi-home';
  } else if (fuentesVias.includes(fuente)) {
    return 'mdi-road';
  } else {
    return 'mdi-database';
  }
};

const getFuenteLabel = (fuente) => {
  const labels = {
    'geo_predio': 'GEO PREDIO',
    'geo_bloque': 'GEO BLOQUE',
    'geo_manzana': 'GEO MANZANA',
    'geo_limite': 'GEO LÍMITE',
    'geo_construccion': 'GEO CONSTRUCCIÓN',
    'predios': 'PREDIOS',
    'predio': 'PREDIO',
    'avaluos': 'AVALÚOS',
    'tenencia': 'TENENCIA',
    'mejoras': 'MEJORAS',
    'vias': 'VÍAS',
    'via': 'VÍA'
  };
  
  return labels[fuente] || fuente.toUpperCase();
};

// Watchers
watch(() => paginacion.pageSize, () => {
  paginacion.page = 1;
  if (fechasValidas.value) {
    buscarCambios();
  }
});

// Limpiar selección cuando cambien los datos - TEMPORALMENTE DESACTIVADO PARA DEBUG
// watch(() => cambios.value, () => {
//   registrosSeleccionados.value = [];
// });

// Limpiar selección cuando cambie la página - TEMPORALMENTE DESACTIVADO PARA DEBUG
// watch(() => paginacion.page, () => {
//   registrosSeleccionados.value = [];
// });

// Watcher para debug de selección
watch(() => registrosSeleccionados.value, (newVal, oldVal) => {
  console.log('🔄 Cambio en registrosSeleccionados:');
  console.log('   Anterior:', oldVal?.length || 0);
  console.log('   Nuevo:', newVal?.length || 0);
  console.log('   Datos:', newVal);
}, { deep: true });

// Watcher para detectar cambios en el tipo de predio
watch(() => tipoPredioActual.value, (nuevoTipo) => {
  console.log('🔄 Cambio de tipo de predio detectado:', nuevoTipo);
  filtros.id_tipo_predio = nuevoTipo;
  if (fechasValidas.value) {
    buscarCambios();
  }
});

// Lifecycle
onMounted(async () => {
  console.log('🚀 Iniciando Control de Cambios - Tipo:', tipoPredioActual.value === 1 ? 'URBANO' : 'RURAL');
  
  // Configurar fechas por defecto (día actual)
  const hoy = new Date();
  const fechaHoy = hoy.toISOString().split('T')[0];
  
  filtros.fecha_inicio = fechaHoy;
  filtros.fecha_fin = fechaHoy;
  
  // Configurar el filtro de tipo de predio automáticamente
  filtros.id_tipo_predio = tipoPredioActual.value;
  
  console.log('📅 Configurado para el día actual:', fechaHoy);
  console.log('🎯 Filtro automático aplicado:', filtros.id_tipo_predio === 1 ? 'URBANO' : 'RURAL');
  
  // Cargar datos iniciales unificados
  await obtenerAccionesDisponibles();
  await buscarCambios();
});
</script>

<style scoped>
.titulo-pantalla {
  color: #1976d2;
  font-weight: bold;
  margin-bottom: 20px;
}

.v-card {
  border-radius: 8px;
}

.bg-grey-lighten-4 {
  border-bottom: 1px solid #e0e0e0;
}

.v-chip {
  font-weight: 500;
}

.v-data-table {
  border-radius: 8px;
}

.v-data-table th {
  background-color: #fafafa !important;
  font-weight: 600;
}

.v-progress-circular {
  margin: 1rem;
}
</style>