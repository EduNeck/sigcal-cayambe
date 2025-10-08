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
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="cambios"
        :loading="loading"
        :server-items-length="totalRegistros"
        v-model:page="paginacion.page"
        v-model:items-per-page="paginacion.pageSize"
        @update:options="actualizarTabla"
        class="elevation-1"
        :footer-props="{
          'items-per-page-text': 'Registros por página:',
          'items-per-page-options': [10, 25, 50, 100]
        }"
      >
        <!-- Slot personalizado para fecha -->
        <template v-slot:item.fecha_actividad="{ item }">
          <v-chip color="info" small>
            {{ formatearFecha(item.fecha_actividad) }}
          </v-chip>
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
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
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

// Métodos
const buscarCambios = async () => {
  console.log('🔍 Iniciando búsqueda unificada de cambios...');
  console.log('📅 Fechas válidas:', fechasValidas.value);
  console.log('📊 Filtros actuales:', filtros);
  
  if (!filtros.fecha_inicio || !filtros.fecha_fin) {
    console.log('❌ Fechas no válidas:', { inicio: filtros.fecha_inicio, fin: filtros.fecha_fin });
    alert('Las fechas de inicio y fin son obligatorias');
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
      cambios.value = data.data || []; // Asegurar array vacío si no hay datos
      totalRegistros.value = data.pagination?.total || 0;
      
      console.log('✅ Datos asignados:', { 
        totalCambios: cambios.value.length, 
        totalRegistros: totalRegistros.value 
      });
    } else {
      console.error('❌ Error en respuesta del servidor:', data.message);
      alert('Error al obtener los datos: ' + data.message);
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    alert('Error de conexión al servidor');
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