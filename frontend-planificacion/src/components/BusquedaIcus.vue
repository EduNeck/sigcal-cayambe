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
        dense
      >
        <template v-slot:item.clave_catastral="{ item }">
          <span class="font-weight-bold">{{ item.clave_catastral }}</span>
        </template>
        
        <template v-slot:item.uso_suelo="{ item }">
          <span v-if="item.id_suelo && item.uso_suelo">
            <strong>{{ item.id_suelo }}:</strong> {{ item.uso_suelo }}
          </span>
          <span v-else>{{ item.uso_suelo || 'No especificado' }}</span>
        </template>
        
        <template v-slot:item.area_grafica="{ item }">
          {{ item.area_grafica ? Number(item.area_grafica).toFixed(2) : 'N/A' }} m²
        </template>
        
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-space-around">
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  x-small
                  color="primary"
                  v-bind="props"
                  @click="verDetalle(item)"
                  class="mr-1"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
              <span>Ver detalle</span>
            </v-tooltip>
            
            <v-tooltip location="bottom" v-if="item.datosPugsCompletos && item.datosPugsCompletos.length > 0">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  x-small
                  color="info"
                  v-bind="props"
                  @click="verUsosSuelo(item)"
                  class="mr-1"
                >
                  <v-icon>mdi-map-marker-multiple</v-icon>
                </v-btn>
              </template>
              <span>Ver usos de suelo ({{ item.datosPugsCompletos.length }})</span>
            </v-tooltip>
            
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  x-small
                  color="success"
                  v-bind="props"
                  @click="seleccionarTitular(item)"
                >
                  <v-icon>mdi-certificate</v-icon>
                </v-btn>
              </template>
              <span>Crear ICUS</span>
            </v-tooltip>
          </div>
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
    
    <!-- Bloque de Actividad y Tipología (movido debajo del grid de resultados) -->
    <v-card v-if="busquedaRealizada && resultados.length > 0" class="mt-4 pa-3" outlined>
      <v-card-title class="text-subtitle-1 pb-3">
        <v-icon left class="mr-2">mdi-tag-multiple</v-icon>
        SELECCIÓN DE ACTIVIDAD Y TIPOLOGÍA
      </v-card-title>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-card outlined class="pa-3">
            <v-card-title class="text-subtitle-1 pa-0 pb-2">
              <v-icon size="small" class="mr-1">mdi-tag-multiple</v-icon>
              ACTIVIDAD
            </v-card-title>
            <v-autocomplete
              v-model="filtros.id_actividad"
              :items="actividades"
              item-title="descripcion"
              item-value="id_actividad"
              label="Seleccione una actividad"
              outlined
              dense
              clearable
              @update:model-value="buscarTipologia"
              :loading="loadingActividades"
              no-data-text="No hay actividades disponibles"
              :disabled="loadingActividades"
              return-object
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="item.raw.descripcion" :subtitle="item.raw.id_tipologia ? `Tipología: ${item.raw.id_tipologia}` : 'Sin tipología'"></v-list-item>
              </template>
            </v-autocomplete>
            <p v-if="actividadSeleccionada" class="text-caption mt-1">
              <strong>Descripción:</strong> {{ actividadSeleccionada.descripcion }}
              <br v-if="actividadSeleccionada.id_tipologia">
              <span v-if="actividadSeleccionada.id_tipologia"><strong>ID Tipología:</strong> {{ actividadSeleccionada.id_tipologia }}</span>
            </p>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-card outlined class="pa-3" v-if="filtros.id_actividad && tipologiaSeleccionada">
            <!-- Tipología al lado de Actividad -->
            <v-card-title class="text-subtitle-1 pa-0 pb-2">
              <v-icon size="small" class="mr-1">mdi-shape-outline</v-icon>
              TIPOLOGÍA
            </v-card-title>
            <p class="mb-0"><strong>{{ tipologiaSeleccionada.nombre }}</strong></p>
            <p class="text-caption mb-2" v-if="tipologiaSeleccionada.descriptacion">
              {{ tipologiaSeleccionada.descriptacion }}
            </p>
            
            <!-- Compatibilidad -->
            <v-divider class="my-3"></v-divider>
            <v-card-title class="text-subtitle-1 pa-0 pb-2">
              <v-icon size="small" class="mr-1">mdi-check-circle-outline</v-icon>
              COMPATIBILIDAD
            </v-card-title>
            
            <div v-if="compatibilidadSeleccionada" class="mt-2">
              <!-- Chip con información textual -->
              <div class="d-flex align-center mb-2">
                <v-chip
                  :color="getCompatibilidadColorFromTipo(compatibilidadSeleccionada.tipo)"
                  text-color="white"
                  size="large"
                  class="font-weight-bold"
                  elevation="2"
                >
                  <v-icon start :icon="getCompatibilidadIcon(compatibilidadSeleccionada.tipo)" class="mr-1"></v-icon>
                  {{ compatibilidadSeleccionada.resultado || getTipoCompatibilidadTexto(compatibilidadSeleccionada.tipo) }}
                </v-chip>
              </div>
            </div>
            <div v-else-if="loadingCompatibilidad">
              <v-skeleton-loader type="chip" class="mt-1"></v-skeleton-loader>
            </div>
            <p v-else class="text-caption mt-1">
              No se encontró información de compatibilidad para esta tipología y uso de suelo.
            </p>
          </v-card>
          
          <v-card outlined class="pa-3" v-else-if="loadingTipologia">
            <v-card-title class="text-subtitle-1 pa-0 pb-2">
              <v-icon size="small" class="mr-1">mdi-shape-outline</v-icon>
              TIPOLOGÍA
            </v-card-title>
            <v-skeleton-loader type="text" class="mb-2"></v-skeleton-loader>
          </v-card>
          
          <v-card outlined class="pa-3" v-else-if="filtros.id_actividad">
            <v-card-title class="text-subtitle-1 pa-0 pb-2">
              <v-icon size="small" class="mr-1">mdi-shape-outline</v-icon>
              TIPOLOGÍA
            </v-card-title>
            <p class="text-caption mb-1">No se encontró información de tipología para esta actividad.</p>
          </v-card>
          
          <v-card outlined class="pa-3" v-else>
            <v-card-title class="text-subtitle-1 pa-0 pb-2">
              <v-icon size="small" class="mr-1">mdi-shape-outline</v-icon>
              TIPOLOGÍA
            </v-card-title>
            <p class="text-caption mb-1">Seleccione una actividad para ver su tipología.</p>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- Diálogo de detalles del titular -->
    <v-dialog v-model="detalleDialog" max-width="800px">
      <v-card class="dialog-card">
        <div class="dialog-accent-line"></div>
        <v-card-title class="dialog-card-title">
          <v-icon left class="mr-2">mdi-account-details-outline</v-icon>
          Detalles del Predio
          <v-spacer></v-spacer>
          <v-btn icon @click="detalleDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-if="icusSeleccionado">
          <v-tabs v-model="activeTab" grow>
            <v-tab value="general">Información General</v-tab>
            <v-tab value="tecnicos">Datos Técnicos</v-tab>
            <v-tab value="usosuelo">Uso de Suelo</v-tab>
          </v-tabs>
          
          <v-window v-model="activeTab">
            <!-- Tab 1: Información General -->
            <v-window-item value="general">
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <v-col cols="6">
                      <p><strong>Clave Catastral:</strong> {{ icusSeleccionado.clave_catastral }}</p>
                      <p><strong>Propietario:</strong> {{ icusSeleccionado.propietario }}</p>
                      <p><strong>Documento de Identidad:</strong> {{ icusSeleccionado.numero_documento }}</p>
                      <p><strong>Tipo de Predio:</strong> {{ icusSeleccionado.tipo_predio || 'No especificado' }}</p>
                    </v-col>
                    <v-col cols="6">
                      <p><strong>Parroquia:</strong> {{ icusSeleccionado.parroquia || 'No especificada' }}</p>
                      <p><strong>Sector:</strong> {{ icusSeleccionado.sector || 'No especificado' }}</p>
                      <p><strong>Régimen:</strong> {{ icusSeleccionado.derechos_acciones === 'SI' ? 'Derechos y Acciones' : 'Unipropiedad' }}</p>
                      <p><strong>ID Interno:</strong> {{ icusSeleccionado.id }}</p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-window-item>
            
            <!-- Tab 2: Datos Técnicos -->
            <v-window-item value="tecnicos">
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <v-col cols="6">
                      <p><strong>Área de Escritura:</strong> {{ icusSeleccionado.area_escritura ? Number(icusSeleccionado.area_escritura).toFixed(2) + ' m²' : 'No registrada' }}</p>
                      <p><strong>Área Gráfica:</strong> {{ icusSeleccionado.area_grafica ? Number(icusSeleccionado.area_grafica).toFixed(2) + ' m²' : 'No registrada' }}</p>
                      <p><strong>Frente:</strong> {{ icusSeleccionado.frente ? Number(icusSeleccionado.frente).toFixed(2) + ' m' : 'No registrado' }}</p>
                    </v-col>
                    <v-col cols="6">
                      <p><strong>Tiene Construcción:</strong> {{ icusSeleccionado.tiene_construccion ? 'Sí' : 'No' }}</p>
                      <p><strong>Área de Construcción:</strong> {{ icusSeleccionado.area_construccion ? Number(icusSeleccionado.area_construccion).toFixed(2) + ' m²' : 'No registrada' }}</p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-window-item>
            
            <!-- Tab 3: Uso de Suelo -->
            <v-window-item value="usosuelo">
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" v-if="icusSeleccionado.id_suelo || icusSeleccionado.uso_suelo">
                      <v-card outlined class="pa-3 mb-3">
                        <v-card-title class="text-subtitle-1 pb-2">
                          <v-icon size="small" class="mr-1">mdi-map-marker-outline</v-icon>
                          USO DE SUELO
                        </v-card-title>
                        <p><strong>Código:</strong> {{ icusSeleccionado.id_suelo || 'No especificado' }}</p>
                        <p><strong>Nombre:</strong> {{ icusSeleccionado.uso_suelo || 'No especificado' }}</p>
                      </v-card>
                    </v-col>
                    
                    <v-col cols="12" v-if="icusSeleccionado.id_actividad || icusSeleccionado.actividad">
                      <v-card outlined class="pa-3 mb-3">
                        <v-card-title class="text-subtitle-1 pb-2">
                          <v-icon size="small" class="mr-1">mdi-tag-multiple-outline</v-icon>
                          ACTIVIDAD
                        </v-card-title>
                        <p><strong>Código:</strong> {{ icusSeleccionado.id_actividad || 'No especificado' }}</p>
                        <p><strong>Nombre:</strong> {{ icusSeleccionado.actividad || 'No especificado' }}</p>
                      </v-card>
                    </v-col>
                    
                    <v-col cols="12" v-if="icusSeleccionado.id_tipologia || icusSeleccionado.tipologia">
                      <v-card outlined class="pa-3 mb-3">
                        <v-card-title class="text-subtitle-1 pb-2">
                          <v-icon size="small" class="mr-1">mdi-shape-outline</v-icon>
                          TIPOLOGÍA
                        </v-card-title>
                        <p><strong>Código:</strong> {{ icusSeleccionado.id_tipologia || 'No especificado' }}</p>
                        <p><strong>Nombre:</strong> {{ icusSeleccionado.tipologia || 'No especificado' }}</p>
                      </v-card>
                    </v-col>
                    
                    <v-col cols="12" v-if="icusSeleccionado.compatibilidad">
                      <v-card outlined class="pa-3" :class="`border-${getCompatibilidadColor(icusSeleccionado.compatibilidad)}`">
                        <v-card-title class="text-subtitle-1 pb-2">
                          <v-icon size="small" class="mr-1">mdi-check-circle-outline</v-icon>
                          RESULTADO DE COMPATIBILIDAD
                        </v-card-title>
                        
                        <!-- Chip con el resultado de compatibilidad -->
                        <div class="d-flex align-center mb-2">
                          <v-chip 
                            :color="getCompatibilidadColor(icusSeleccionado.compatibilidad)" 
                            text-color="white" 
                            size="large"
                            class="font-weight-bold"
                            elevation="2"
                          >
                            <v-icon start class="mr-1">
                              {{ icusSeleccionado.compatibilidad === 'COMPATIBLE' ? 'mdi-check-circle' : 
                                 icusSeleccionado.compatibilidad === 'CONDICIONADO' ? 'mdi-alert-circle' : 
                                 'mdi-close-circle' }}
                            </v-icon>
                            {{ icusSeleccionado.compatibilidad }}
                          </v-chip>
                        </div>
                      </v-card>
                    </v-col>
                    
                    <v-col cols="12" v-if="!icusSeleccionado.id_suelo && !icusSeleccionado.uso_suelo && !icusSeleccionado.compatibilidad">
                      <v-alert type="info" outlined>
                        No se encontró información de uso de suelo para este predio.
                      </v-alert>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="seleccionarTitular(icusSeleccionado)">
            <v-icon left>mdi-certificate</v-icon>
            Crear ICUS
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
    
    <!-- Diálogo para mostrar todos los usos de suelo del predio -->
    <v-dialog v-model="usosDetalleDialog" max-width="900px">
      <v-card class="dialog-card">
        <div class="dialog-accent-line"></div>
        <v-card-title class="dialog-card-title">
          <v-icon left class="mr-2">mdi-map-marker-multiple</v-icon>
          Usos de Suelo del Predio
          <v-spacer></v-spacer>
          <v-btn icon @click="usosDetalleDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle v-if="predioSeleccionado">
          <strong>Clave Catastral:</strong> {{ predioSeleccionado.clave_catastral }} | 
          <strong>Propietario:</strong> {{ predioSeleccionado.propietario }}
        </v-card-subtitle>
        <v-card-text>
          <v-data-table
            :headers="[
              { title: 'Código', value: 'usc', width: '100px' },
              { title: 'Uso de Suelo', value: 'usn' },
              { title: 'Código Act.', value: 'act_id', width: '100px' },
              { title: 'Actividad', value: 'act_nombre' },
              { title: 'Código Tip.', value: 'tip_id', width: '100px' },
              { title: 'Tipología', value: 'tip_nombre' },
              { title: 'Compatibilidad', value: 'tipo_texto' }
            ]"
            :items="predioSeleccionado?.datosPugsCompletos || []"
            :items-per-page="10"
            dense
            class="elevation-1"
          >
            <template v-slot:item.tipo_texto="{ item }">
              <v-chip
                x-small
                :color="getCompatibilidadColorFromTipo(item.tipo)"
                text-color="white"
              >
                {{ getTipoCompatibilidadTexto(item.tipo) }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="usosDetalleDialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';
import datosTitularService from '@/services/datosTitularService';
import actividadService from '@/services/actividadService';
import tipologiaService from '@/services/tipologiaService';
import datosPugsService from '@/services/datosPugsService';
import compatibilidadService from '@/services/compatibilidadService';

export default {
  name: 'BusquedaICUS',
  
  setup() {
    const router = useRouter();
    const form = ref(null);
    const loading = ref(false);
    const resultados = ref([]);
    const search = ref('');
    const busquedaRealizada = ref(false);
    const detalleDialog = ref(false);
    const icusSeleccionado = ref(null);
    const activeTab = ref('general'); // Para controlar las pestañas en el diálogo de detalles
    const predioSeleccionado = ref(null); // Para mostrar los usos de suelo del predio seleccionado
    const usosDetalleDialog = ref(false); // Para controlar el diálogo de detalles de usos
    
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
      numeroDocumento: '',
      id_actividad: null
    });
    
    // Variables para actividades y tipologías
    const actividades = ref([]);
    const loadingActividades = ref(false);
    const actividadSeleccionada = ref(null);
    
    const tipologiaSeleccionada = ref(null);
    const loadingTipologia = ref(false);
    
    // Variables para compatibilidad
    const compatibilidadSeleccionada = ref(null);
    const loadingCompatibilidad = ref(false);
    
    // Encabezados para la tabla
    const headers = [
      { title: 'Clave Catastral', value: 'clave_catastral', sortable: true, width: '150px' },
      { title: 'Propietario', value: 'propietario', sortable: true },
      { title: 'Doc. Identidad', value: 'numero_documento', sortable: true },
      { title: 'Uso de Suelo', value: 'uso_suelo', sortable: true },
      { title: 'Parroquia', value: 'parroquia', sortable: true },
      { title: 'Sector', value: 'sector', sortable: true },
      { title: 'Área m²', value: 'area_grafica', sortable: true },
      { title: 'Acciones', value: 'actions', sortable: false, align: 'center', width: '120px' }
    ];
    
    // Método para realizar la búsqueda
    const buscar = async () => {
      // Validar que se haya ingresado al menos un criterio de búsqueda para datos del titular
      if (!filtros.claveCatastral && !filtros.nombres && !filtros.numeroDocumento) {
        showSnackbar('Debe ingresar al menos un criterio de búsqueda (clave catastral, nombre o documento)', 'warning');
        return;
      }
      
      loading.value = true;
      busquedaRealizada.value = true;
      resultados.value = []; // Limpiar resultados anteriores
      
      try {
        console.log('🔍 Iniciando búsqueda de titulares con filtros:', {
          claveCatastral: filtros.claveCatastral,
          nombres: filtros.nombres,
          numeroDocumento: filtros.numeroDocumento
        });
        
        // Preparar los parámetros de búsqueda
        const parametrosBusqueda = {
          claveCatastral: filtros.claveCatastral?.trim() || '',
          nombres: filtros.nombres?.trim() || '',
          numeroDocumento: filtros.numeroDocumento?.trim() || ''
        };
        
        // Buscar los datos de titulares en la vista datos_titular
        const titularesResponse = await datosTitularService.busquedaAvanzada(parametrosBusqueda);
        
        console.log('✅ Respuesta de búsqueda de titulares:', titularesResponse);
        
        if (titularesResponse.data && titularesResponse.data.data && titularesResponse.data.data.length > 0) {
          // Array temporal para almacenar los resultados
          const resultadosTemp = [];
          
          // Procesar cada titular y buscar sus datos de uso de suelo
          for (const titular of titularesResponse.data.data) {
            // Crear el objeto base del resultado
            const resultadoItem = {
              id: titular.id,
              clave_catastral: titular.clave_catastral,
              propietario: titular.nombres,
              numero_documento: titular.numero_documento,
              tipo_predio: titular.tipo_predio,
              parroquia: titular.parroquia,
              sector: titular.sector,
              area_escritura: titular.area_escritura,
              area_grafica: titular.area_grafica,
              frente: titular.frente,
              agua: titular.agua ? 'Sí' : 'No',
              energia_electrica: titular.energia_electrica ? 'Sí' : 'No',
              alcantarillado: titular.alcantarillado ? 'Sí' : 'No',
              // Campos adicionales que podrían ser útiles para ICUS
              actividad: '',
              tipologia: '',
              compatibilidad: '',
              id_suelo: '',
              uso_suelo: '',
              // Array para almacenar todos los usos de suelo
              datosPugsCompletos: [],
              fecha: new Date().toISOString().split('T')[0]
            };
            
            // Si tiene clave catastral, intentar obtener los datos PUGS
            if (titular.clave_catastral) {
              try {
                console.log(`🌎 Consultando datos PUGS para clave catastral: ${titular.clave_catastral}`);
                const pugsResponse = await datosPugsService.obtenerPorClaveCatastral(titular.clave_catastral);
                
                if (pugsResponse.data && pugsResponse.data.success && pugsResponse.data.data && pugsResponse.data.data.length > 0) {
                  // Guardar todos los datos PUGS encontrados
                  resultadoItem.datosPugsCompletos = pugsResponse.data.data;
                  console.log(`✅ ${pugsResponse.data.data.length} datos PUGS encontrados para ${titular.clave_catastral}`);
                  
                  // Usar el primer registro como principal para mostrar en el grid principal
                  if (pugsResponse.data.data.length > 0) {
                    const datosPugs = pugsResponse.data.data[0];
                    
                    // Agregar la información de uso de suelo principal al resultado
                    resultadoItem.id_suelo = datosPugs.usc || '';
                    resultadoItem.uso_suelo = datosPugs.usn || '';
                    resultadoItem.id_actividad = datosPugs.act_id || '';
                    resultadoItem.actividad = datosPugs.act_nombre || '';
                    resultadoItem.id_tipologia = datosPugs.tip_id || '';
                    resultadoItem.tipologia = datosPugs.tip_nombre || '';
                    
                    // Determinar la compatibilidad basada en el tipo
                    if (datosPugs.tipo === 1) {
                      resultadoItem.compatibilidad = 'Compatible';
                    } else if (datosPugs.tipo === 2) {
                      resultadoItem.compatibilidad = 'Condicionado';
                    } else if (datosPugs.tipo === 0) {
                      resultadoItem.compatibilidad = 'No Compatible';
                    }
                  }
                } else {
                  console.log(`⚠️ No se encontraron datos PUGS para clave catastral: ${titular.clave_catastral}`);
                }
              } catch (pugsError) {
                console.error(`❌ Error al buscar datos PUGS para ${titular.clave_catastral}:`, pugsError);
              }
            }
            
            // Añadir el resultado procesado al array temporal
            resultadosTemp.push(resultadoItem);
          }
          
          // Actualizar los resultados con todos los datos procesados
          resultados.value = resultadosTemp;
          
          showSnackbar(`Se encontraron ${resultados.value.length} predios con su información de uso de suelo`, 'success');
        } else {
          // No se encontraron titulares
          resultados.value = [];
          showSnackbar('No se encontraron titulares con los criterios especificados', 'info');
        }
      } catch (error) {
        console.error('❌ Error al realizar la búsqueda de titulares:', error);
        
        // Intentar mostrar detalles más específicos del error
        if (error.response) {
          console.error('❌ Status:', error.response.status);
          console.error('❌ Datos:', error.response.data);
        }
        
        showSnackbar('Ocurrió un error al realizar la búsqueda de titulares', 'error', 5000);
        resultados.value = [];
      } finally {
        loading.value = false;
      }
    };
    
    // Método para limpiar filtros
    const limpiarFiltros = () => {
      filtros.claveCatastral = '';
      filtros.nombres = '';
      filtros.numeroDocumento = '';
      filtros.id_actividad = null;
      actividadSeleccionada.value = null;
      tipologiaSeleccionada.value = null;
      resultados.value = [];
      busquedaRealizada.value = false;
    };
    
    // Método para ver detalles de un titular
    const verDetalle = (item) => {
      icusSeleccionado.value = item;
      detalleDialog.value = true;
    };
    
    // Método para ver los usos de suelo de un predio
    const verUsosSuelo = (item) => {
      predioSeleccionado.value = item;
      usosDetalleDialog.value = true;
    };
    
    // Método para seleccionar un titular y preparar su ICUS
    const seleccionarTitular = (item) => {
      icusSeleccionado.value = item;
      
      // Datos PUGS para incluir en la consulta
      const datosPugs = {
        id_suelo: item.id_suelo,
        uso_suelo: item.uso_suelo,
        id_actividad: item.id_actividad,
        actividad: item.actividad,
        id_tipologia: item.id_tipologia,
        tipologia: item.tipologia,
        compatibilidad: item.compatibilidad
      };
      
      // Mostrar diálogo para completar información de ICUS
      router.push({
        name: 'CrearIcus',
        query: { 
          datosTitular: JSON.stringify(item),
          datosPugs: JSON.stringify(datosPugs),
          claveCatastral: item.clave_catastral
        }
      });
      
      showSnackbar(`Preparando certificado ICUS para: ${item.propietario || 'predio'}`, 'success');
    };
    
    // Método para generar informe basado en los datos existentes
    const generarInforme = (item) => {
      // Navegar al componente de informe y pasar el ID del titular
      router.push({
        name: 'ReporteIcus',
        params: { id: item.id },
        query: { 
          datosTitular: JSON.stringify(item),
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
    
    // Método para obtener el color de la compatibilidad a partir del tipo numérico
    const getCompatibilidadColorFromTipo = (tipo) => {
      if (tipo === 1) return 'success'; // Verde para COMPATIBLE
      if (tipo === 2) return 'warning'; // Amarillo para CONDICIONADO
      if (tipo === 0) return 'error';   // Rojo para NO COMPATIBLE
      return 'grey';                    // Gris para no evaluado
    };
    
    // Método para obtener el icono correspondiente al tipo de compatibilidad
    const getCompatibilidadIcon = (tipo) => {
      if (tipo === 1) return 'mdi-check-circle';          // Icono de verificación para COMPATIBLE
      if (tipo === 2) return 'mdi-alert-circle';          // Icono de alerta para CONDICIONADO
      if (tipo === 0) return 'mdi-close-circle';          // Icono de prohibición para NO COMPATIBLE
      return 'mdi-help-circle-outline';                   // Icono de interrogación para no evaluado
    };
    
    // Método para convertir el tipo numérico a texto de compatibilidad
    const getTipoCompatibilidadTexto = (tipo) => {
      if (tipo === 1) return 'COMPATIBLE';
      if (tipo === 2) return 'CONDICIONADO';
      if (tipo === 0) return 'NO COMPATIBLE → PROHIBIDO';
      return 'No evaluado';
    };
    
    // Cargar actividades
    const cargarActividades = async () => {
      loadingActividades.value = true;
      console.log('📋 Cargando lista de actividades...');
      try {
        const response = await actividadService.obtenerActividades();
        console.log('📥 Respuesta del servicio de actividades:', response);
        
        if (response.data && response.data.success) {
          actividades.value = response.data.data || [];
          console.log('✅ Actividades cargadas:', actividades.value.length);
          console.log('✅ Muestra de datos:', actividades.value.slice(0, 3));
        } else {
          console.log('❌ Error en la respuesta:', response.data);
          showSnackbar('Error al cargar actividades', 'error');
        }
      } catch (error) {
        console.error('❌ Error al cargar actividades:', error);
        showSnackbar('Error al cargar actividades', 'error');
      } finally {
        loadingActividades.value = false;
      }
    };
    
    // Buscar tipología cuando cambia la actividad seleccionada
    const buscarTipologia = async () => {
      if (!filtros.id_actividad) {
        actividadSeleccionada.value = null;
        tipologiaSeleccionada.value = null;
        compatibilidadSeleccionada.value = null;
        return;
      }
      
      loadingTipologia.value = true;
      compatibilidadSeleccionada.value = null;
      
      // Como ahora estamos usando return-object, la actividad seleccionada es el objeto completo
      actividadSeleccionada.value = filtros.id_actividad;
      
      try {
        if (actividadSeleccionada.value && actividadSeleccionada.value.id_tipologia) {
          // Asegurarse de que el ID sea un string limpio
          const idTipologia = String(actividadSeleccionada.value.id_tipologia).trim();
          
          try {
            const response = await tipologiaService.obtenerTipologiaPorId(idTipologia);
            
            if (response.data && response.data.success) {
              tipologiaSeleccionada.value = response.data.data;
              showSnackbar(`Tipología '${response.data.data.nombre}' encontrada`, 'success');
              
              // Una vez que tengamos la tipología, buscamos la compatibilidad con el uso de suelo seleccionado
              await buscarCompatibilidad(idTipologia);
              
            } else {
              tipologiaSeleccionada.value = null;
              showSnackbar('No se encontró la tipología correspondiente', 'warning');
            }
          } catch (serviceError) {
            // Si es un error 404, podemos intentar una consulta alternativa
            if (serviceError.response?.status === 404) {
              showSnackbar('Tipología no encontrada, realizando búsqueda alternativa', 'info');
              // Aquí podríamos implementar una lógica alternativa si es necesario
            } else {
              showSnackbar(`Error al cargar tipología: ${serviceError.response?.data?.message || serviceError.message}`, 'error');
            }
            
            tipologiaSeleccionada.value = null;
          }
        } else {
          tipologiaSeleccionada.value = null;
          showSnackbar('La actividad no tiene tipología asociada', 'info');
        }
      } catch (error) {
        showSnackbar('Error al procesar la actividad seleccionada', 'error');
        tipologiaSeleccionada.value = null;
      } finally {
        loadingTipologia.value = false;
      }
    };
    
    // Buscar compatibilidad entre tipología y uso de suelo
    const buscarCompatibilidad = async (idTipologia) => {
      // Verificamos que tengamos un uso de suelo seleccionado
      if (!resultados.value.length || !resultados.value[0].id_suelo) {
        console.log('No hay predio seleccionado o no tiene uso de suelo definido');
        return;
      }
      
      const idUso = resultados.value[0].id_suelo;
      
      if (!idTipologia || !idUso) {
        console.log('Faltan datos para consultar compatibilidad:', { idTipologia, idUso });
        return;
      }
      
      loadingCompatibilidad.value = true;
      compatibilidadSeleccionada.value = null;
      
      try {
        // Limpiar y formatear los IDs
        const tipologiaIdLimpio = String(idTipologia).trim();
        const usoIdLimpio = String(idUso).trim();
        
        console.log(`🔍 Consultando compatibilidad para tipología [${tipologiaIdLimpio}] y uso [${usoIdLimpio}]`);
        console.log(`🔍 Tipos de datos: tipología (${typeof tipologiaIdLimpio}), uso (${typeof usoIdLimpio})`);
        
        // Intentar obtener la compatibilidad
        const response = await compatibilidadService.obtenerCompatibilidadPorTipologiaYUso(tipologiaIdLimpio, usoIdLimpio);
        
        console.log('✅ Respuesta completa:', response);
        
        if (response.data && response.data.success && response.data.data) {
          compatibilidadSeleccionada.value = response.data.data;
          console.log('✅ Compatibilidad encontrada:', compatibilidadSeleccionada.value);
          
          // Mostrar notificación exitosa
          showSnackbar(`Compatibilidad encontrada: ${compatibilidadSeleccionada.value.resultado || 'Sin resultado definido'}`, 'success');
        } else {
          console.log('⚠️ No se encontró información de compatibilidad en la respuesta:', response.data);
          showSnackbar(`No existe compatibilidad para tipología ${tipologiaIdLimpio} y uso ${usoIdLimpio}`, 'warning');
        }
      } catch (error) {
        console.error('❌ Error al consultar compatibilidad:', error);
        
        // Verificar si es un error 404 de "no encontrado"
        if (error.response?.status === 404) {
          console.log('ℹ️ No se encontró compatibilidad en la base de datos');
          
          // Crear un objeto de compatibilidad por defecto para mostrar "NO COMPATIBLE → PROHIBIDO"
          compatibilidadSeleccionada.value = {
            tipo: 0,  // 0 = No compatible
            resultado: 'NO COMPATIBLE → PROHIBIDO',
            fcode: null
          };
          
          showSnackbar(`No existe compatibilidad definida para esta tipología y uso de suelo. Se considera "NO COMPATIBLE → PROHIBIDO".`, 'warning');
        } else {
          console.error('❌ Detalles del error:', error.response?.data || error.message);
          showSnackbar(`Error al consultar compatibilidad: ${error.message}`, 'error');
          compatibilidadSeleccionada.value = null;
        }
      } finally {
        loadingCompatibilidad.value = false;
      }
    };
    
    // Cargar datos al inicializar el componente
    onMounted(async () => {
      await cargarActividades();
    });

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
      activeTab,
      snackbar,
      predioSeleccionado,
      usosDetalleDialog,
      buscar,
      limpiarFiltros,
      verDetalle,
      verUsosSuelo,
      seleccionarTitular,
      generarInforme,
      salir,
      formatearFecha,
      getCompatibilidadColor,
      getCompatibilidadColorFromTipo,
      getCompatibilidadIcon,
      getTipoCompatibilidadTexto,
      // Propiedades para actividades y tipologías
      actividades,
      loadingActividades,
      actividadSeleccionada,
      tipologiaSeleccionada,
      loadingTipologia,
      buscarTipologia,
      // Propiedades para compatibilidad
      compatibilidadSeleccionada,
      loadingCompatibilidad,
      buscarCompatibilidad
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

/* Bordes coloreados para las tarjetas de compatibilidad */
.border-success {
  border-left: 4px solid #4caf50 !important;
}

.border-warning {
  border-left: 4px solid #ff9800 !important;
}

.border-error {
  border-left: 4px solid #f44336 !important;
}

.border-grey {
  border-left: 4px solid #9e9e9e !important;
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
