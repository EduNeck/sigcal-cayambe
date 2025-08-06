<template>
  <!-- Overlay de carga -->
  <v-overlay
    :model-value="cargando"
    class="d-flex align-center justify-center"
    persistent
    style="z-index: 2000"
  >
    <v-card class="pa-4 text-center" color="#f5f5f5">
      <v-progress-circular indeterminate color="primary" size="50" class="mb-2" />
      <div aria-live="polite">Cargando catálogo, por favor espere...</div>
    </v-card>
  </v-overlay>

  <v-container class="container">
    <v-row justify="center" align="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Catálogo de Barrios y Vías</h2>
      </v-col>
      <v-spacer></v-spacer>
      <v-btn color="white" class="text-primary" @click="cargarDatos">
        <v-icon left>mdi-refresh</v-icon>Recargar
      </v-btn>
      <v-btn color="white" class="text-primary" @click="salir">
        <v-icon left>mdi-logout</v-icon>Salir
      </v-btn>

      <v-col cols="12">
        <!-- Formularios de gestión -->
        <v-expansion-panels class="mb-4" v-model="panelAbierto">
          <!-- Panel de Creación -->
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="mr-2" color="green">mdi-plus-circle</v-icon>
              Crear Nuevo Barrio y Calles
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <!-- Crear Barrio -->
              <v-row align="center" class="mb-4">
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="nuevoBarrioNombre"
                    label="Nombre del nuevo barrio"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-home-plus"
                    placeholder="Ingrese el nombre del barrio"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-btn
                    color="green"
                    variant="elevated"
                    :disabled="!nuevoBarrioNombre || nuevoBarrioNombre.trim() === ''"
                    :loading="creandoBarrio"
                    @click="crearNuevoBarrio"
                    prepend-icon="mdi-home-plus"
                  >
                    Crear Barrio
                  </v-btn>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <!-- Agregar Calles -->
              <v-row align="center">
                <v-col cols="12" md="4">
                  <v-select
                    v-model="barrioParaAgregarCalle"
                    :items="barriosUnicos"
                    item-title="nombre_barrio"
                    item-value="id_barrio"
                    label="Seleccionar Barrio"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-home-group"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="5">
                  <v-text-field
                    v-model="nuevaCalleNombre"
                    label="Nombre de la nueva calle"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-road-variant"
                    :disabled="!barrioParaAgregarCalle"
                    placeholder="Ingrese el nombre de la calle"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    color="green"
                    variant="elevated"
                    :disabled="!barrioParaAgregarCalle || !nuevaCalleNombre || nuevaCalleNombre.trim() === ''"
                    :loading="agregandoCalle"
                    @click="agregarNuevaCalle"
                    prepend-icon="mdi-road-variant"
                  >
                    Agregar Calle
                  </v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Panel de Edición -->
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="mr-2" color="primary">mdi-pencil</v-icon>
              Editar Barrios y Calles
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <!-- Edición de Barrios -->
              <v-row align="center" class="mb-4">
                <v-col cols="12" md="5">
                  <v-select
                    v-model="barrioSeleccionadoParaEditarNombre"
                    :items="barriosUnicos"
                    item-title="nombre_barrio"
                    item-value="id_barrio"
                    label="Seleccionar Barrio a Editar"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-home-group"
                    clearable
                    @update:model-value="seleccionarBarrioParaEditarNombre"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="5">
                  <v-text-field
                    v-model="nuevoNombreBarrio"
                    label="Nuevo nombre de barrio"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-rename-box"
                    :disabled="!barrioSeleccionadoParaEditarNombre"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-btn
                    color="primary"
                    variant="elevated"
                    :disabled="!barrioSeleccionadoParaEditarNombre || !nuevoNombreBarrio"
                    :loading="guardandoEdicionBarrio"
                    @click="guardarEdicionBarrio"
                    prepend-icon="mdi-content-save"
                  >
                    Guardar
                  </v-btn>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <!-- Edición de Calles -->
              <v-row align="center">
                <v-col cols="12" md="4">
                  <v-select
                    v-model="barrioSeleccionadoParaEdicion"
                    :items="barriosUnicos"
                    item-title="nombre_barrio"
                    item-value="id_barrio"
                    label="Seleccionar Barrio"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-home-group"
                    clearable
                    @update:model-value="cargarCallesParaEdicion"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="calleSeleccionadaParaEdicion"
                    :items="callesParaEdicion"
                    item-title="nombre_calle"
                    item-value="id"
                    label="Seleccionar Calle"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-road-variant"
                    :disabled="!barrioSeleccionadoParaEdicion || callesParaEdicion.length === 0"
                    clearable
                    @update:model-value="seleccionarCalleParaEdicion"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="nuevoNombreCalle"
                    label="Nuevo nombre de calle"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-rename-box"
                    :disabled="!calleSeleccionadaParaEdicion"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="1">
                  <v-btn
                    color="primary"
                    variant="elevated"
                    :disabled="!calleSeleccionadaParaEdicion || !nuevoNombreCalle"
                    :loading="guardandoEdicion"
                    @click="guardarEdicionCalle"
                    icon="mdi-content-save"
                    size="large"
                  ></v-btn>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- Tabla de datos -->
        <v-data-table
          :headers="headers"
          :items="items"
          :search="buscar"
          item-key="id"
          class="elevation-2 rounded-lg"
          dense
        >
          <!-- Barra superior -->
          <template v-slot:top>
            <v-toolbar flat class="bg-primary rounded-t-lg">
              <v-toolbar-title class="white--text">Barrios y Vías</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="buscar"
                append-icon="mdi-magnify"
                label="Buscar en el catálogo"
                single-line
                hide-details
                clearable
                class="ma-2"
                style="max-width: 300px;"
              ></v-text-field>
            </v-toolbar>
          </template>

          <!-- Columna de ID -->
          <template v-slot:item.id="{ item }">
            <v-chip size="small" color="primary" variant="elevated">
              {{ item.id }}
            </v-chip>
          </template>

          <!-- Columna de ID Barrio -->
          <template v-slot:item.id_barrio="{ item }">
            <v-chip 
              v-if="item.id_barrio"
              size="small" 
              color="secondary" 
              variant="outlined"
            >
              {{ item.id_barrio }}
            </v-chip>
            <span v-else class="text-grey">-</span>
          </template>

          <!-- Columna de Nombre Barrio -->
          <template v-slot:item.nombre_barrio="{ item }">
            <div class="d-flex align-center">
              <v-icon class="mr-2" size="small" color="primary">mdi-home-group</v-icon>
              <span class="font-weight-medium">{{ item.nombre_barrio || '-' }}</span>
            </div>
          </template>

          <!-- Columna de ID Calle -->
          <template v-slot:item.id_calle="{ item }">
            <v-chip 
              v-if="item.id_calle"
              size="small" 
              color="success" 
              variant="outlined"
            >
              {{ item.id_calle }}
            </v-chip>
            <span v-else class="text-grey">-</span>
          </template>

          <!-- Columna de Nombre Calle -->
          <template v-slot:item.nombre_calle="{ item }">
            <div class="d-flex align-center" v-if="item.nombre_calle">
              <v-icon class="mr-2" size="small" color="primary">mdi-road-variant</v-icon>
              <span class="font-weight-medium">{{ item.nombre_calle }}</span>
            </div>
            <span v-else class="text-grey">-</span>
          </template>
        </v-data-table>

        <!-- Snackbar -->
        <v-snackbar v-model="snackbarError" color="error" timeout="3000" top right>
          {{ mensajeError }}
        </v-snackbar>
        <v-snackbar v-model="snackbarSuccess" color="success" timeout="3000" top right>
          {{ mensajeSuccess }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'CatalogoBarriosVias',
  data() {
    return {
      items: [],
      panelAbierto: null, // Para controlar qué panel de expansión está abierto
      
      // Grid headers
      headers: [
        {
          title: 'ID',
          align: 'start',
          sortable: true,
          key: 'id',
          width: '80px'
        },
        {
          title: 'ID Barrio',
          key: 'id_barrio',
          sortable: true,
          width: '120px'
        },
        {
          title: 'Nombre Barrio',
          key: 'nombre_barrio',
          sortable: true
        },
        {
          title: 'ID Calle',
          key: 'id_calle',
          sortable: true,
          width: '120px'
        },
        {
          title: 'Nombre Calle',
          key: 'nombre_calle',
          sortable: true
        }
      ],
      
      // Búsqueda
      buscar: '',
      
      // Estados de carga
      cargando: false,
      
      // Formulario de edición
      barriosUnicos: [],
      
      // Creación de barrios y calles
      nuevoBarrioNombre: '',
      creandoBarrio: false,
      barrioParaAgregarCalle: null,
      barrioInfoParaCalle: null,
      nuevaCalleNombre: '',
      agregandoCalle: false,
      
      // Edición de barrios
      barrioSeleccionadoParaEditarNombre: null,
      barrioSeleccionadoInfo: null,
      nuevoNombreBarrio: '',
      guardandoEdicionBarrio: false,
      
      // Edición de calles
      barrioSeleccionadoParaEdicion: null,
      callesParaEdicion: [],
      calleSeleccionadaParaEdicion: null,
      calleSeleccionadaInfo: null,
      nuevoNombreCalle: '',
      guardandoEdicion: false,
      
      // Mensajes
      snackbarError: false,
      snackbarSuccess: false,
      mensajeError: '',
      mensajeSuccess: ''
    };
  },
  
  watch: {
    barrioParaAgregarCalle(newValue) {
      if (newValue) {
        this.barrioInfoParaCalle = this.barriosUnicos.find(b => b.id_barrio === newValue);
      } else {
        this.barrioInfoParaCalle = null;
      }
    }
  },
  
  async mounted() {
    await this.cargarDatos();
    await this.cargarBarriosUnicos();
  },
  
  methods: {
    async cargarDatos() {
      this.cargando = true;
      try {
        console.log('Cargando datos desde:', `${API_BASE_URL}/catalogo_barrios_vias`);
        const response = await axios.get(`${API_BASE_URL}/catalogo_barrios_vias`);
        this.items = response.data;
        console.log('Datos cargados:', this.items);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        this.mostrarError('Error al cargar los datos');
      } finally {
        this.cargando = false;
      }
    },

    async cargarBarriosUnicos() {
      try {
        console.log('Iniciando carga de barrios únicos...');
        const response = await axios.get(`${API_BASE_URL}/catalogo_barrios`);
        this.barriosUnicos = response.data;
        console.log('Barrios únicos cargados:', this.barriosUnicos);
        console.log('Número de barrios:', this.barriosUnicos.length);
        console.log('Primer barrio (estructura):', this.barriosUnicos[0]);
      } catch (error) {
        console.error('Error al cargar barrios únicos:', error);
        console.error('Detalles del error:', error.response?.data);
        this.mostrarError('Error al cargar los barrios');
      }
    },

    async cargarCallesParaEdicion() {
      if (!this.barrioSeleccionadoParaEdicion) {
        this.callesParaEdicion = [];
        this.calleSeleccionadaParaEdicion = null;
        this.calleSeleccionadaInfo = null;
        this.nuevoNombreCalle = '';
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/catalogo_calles_por_barrio/${this.barrioSeleccionadoParaEdicion}`);
        this.callesParaEdicion = response.data;
        console.log('Calles para edición cargadas:', this.callesParaEdicion);
        
        // Limpiar selección anterior
        this.calleSeleccionadaParaEdicion = null;
        this.calleSeleccionadaInfo = null;
        this.nuevoNombreCalle = '';
      } catch (error) {
        console.error('Error al cargar calles para edición:', error);
        this.mostrarError('Error al cargar las calles');
      }
    },

    // Métodos para creación de barrios y calles
    async crearNuevoBarrio() {
      if (!this.nuevoBarrioNombre || this.nuevoBarrioNombre.trim() === '') {
        this.mostrarError('El nombre del barrio es obligatorio');
        return;
      }

      this.creandoBarrio = true;
      try {
        await axios.post(`${API_BASE_URL}/catalogo_barrios`, {
          nombre_barrio: this.nuevoBarrioNombre.trim()
        });

        this.mostrarSuccess('Barrio creado exitosamente');
        
        // Limpiar formulario
        this.nuevoBarrioNombre = '';
        
        // Recargar datos
        await this.cargarDatos();
        await this.cargarBarriosUnicos();
        
      } catch (error) {
        console.error('Error al crear barrio:', error);
        this.mostrarError('Error al crear el barrio');
      } finally {
        this.creandoBarrio = false;
      }
    },

    async agregarNuevaCalle() {
      if (!this.barrioParaAgregarCalle || !this.nuevaCalleNombre || this.nuevaCalleNombre.trim() === '') {
        this.mostrarError('Debe seleccionar un barrio y proporcionar el nombre de la calle');
        return;
      }

      this.agregandoCalle = true;
      try {
        const barrioInfo = this.barriosUnicos.find(b => b.id_barrio === this.barrioParaAgregarCalle);
        
        await axios.post(`${API_BASE_URL}/catalogo_calles`, {
          id_barrio: this.barrioParaAgregarCalle,
          nombre_barrio: barrioInfo.nombre_barrio,
          nombre_calle: this.nuevaCalleNombre.trim()
        });

        this.mostrarSuccess('Calle agregada exitosamente');
        
        // Limpiar formulario
        this.nuevaCalleNombre = '';
        
        // Recargar datos
        await this.cargarDatos();
        
      } catch (error) {
        console.error('Error al agregar calle:', error);
        this.mostrarError('Error al agregar la calle');
      } finally {
        this.agregandoCalle = false;
      }
    },

    // Métodos para edición de barrios
    seleccionarBarrioParaEditarNombre() {
      if (!this.barrioSeleccionadoParaEditarNombre) {
        this.barrioSeleccionadoInfo = null;
        this.nuevoNombreBarrio = '';
        return;
      }

      // Buscar la información completa del barrio seleccionado
      this.barrioSeleccionadoInfo = this.barriosUnicos.find(
        barrio => barrio.id_barrio === this.barrioSeleccionadoParaEditarNombre
      );
      
      if (this.barrioSeleccionadoInfo) {
        this.nuevoNombreBarrio = this.barrioSeleccionadoInfo.nombre_barrio;
      }
    },

    async guardarEdicionBarrio() {
      if (!this.barrioSeleccionadoParaEditarNombre || !this.nuevoNombreBarrio.trim()) {
        this.mostrarError('Debe seleccionar un barrio y proporcionar un nuevo nombre');
        return;
      }

      this.guardandoEdicionBarrio = true;
      try {
        await axios.put(`${API_BASE_URL}/catalogo_barrios_by_id_barrio/${this.barrioSeleccionadoParaEditarNombre}`, {
          nombre_barrio: this.nuevoNombreBarrio.trim()
        });

        this.mostrarSuccess('Barrio actualizado exitosamente');
        
        // Recargar datos
        await this.cargarDatos();
        await this.cargarBarriosUnicos();
        
        // Limpiar formulario
        this.barrioSeleccionadoParaEditarNombre = null;
        this.barrioSeleccionadoInfo = null;
        this.nuevoNombreBarrio = '';
        
      } catch (error) {
        console.error('Error al actualizar barrio:', error);
        this.mostrarError('Error al actualizar el barrio');
      } finally {
        this.guardandoEdicionBarrio = false;
      }
    },

    // Métodos para edición de calles

    // Métodos para edición de calles
    seleccionarCalleParaEdicion() {
      if (!this.calleSeleccionadaParaEdicion) {
        this.calleSeleccionadaInfo = null;
        this.nuevoNombreCalle = '';
        return;
      }

      // Buscar la información completa de la calle seleccionada
      this.calleSeleccionadaInfo = this.callesParaEdicion.find(
        calle => calle.id === this.calleSeleccionadaParaEdicion
      );
      
      if (this.calleSeleccionadaInfo) {
        this.nuevoNombreCalle = this.calleSeleccionadaInfo.nombre_calle;
      }
    },

    async guardarEdicionCalle() {
      if (!this.calleSeleccionadaParaEdicion || !this.nuevoNombreCalle.trim()) {
        this.mostrarError('Debe seleccionar una calle y proporcionar un nuevo nombre');
        return;
      }

      this.guardandoEdicion = true;
      try {
        await axios.put(`${API_BASE_URL}/catalogo_calles/${this.calleSeleccionadaParaEdicion}`, {
          nombre_calle: this.nuevoNombreCalle.trim()
        });

        this.mostrarSuccess('Calle actualizada exitosamente');
        
        // Recargar datos
        await this.cargarDatos();
        await this.cargarCallesParaEdicion();
        
      } catch (error) {
        console.error('Error al actualizar calle:', error);
        this.mostrarError('Error al actualizar la calle');
      } finally {
        this.guardandoEdicion = false;
      }
    },

    getBarrioNombre(idBarrio) {
      const barrio = this.barriosUnicos.find(b => b.id_barrio === idBarrio);
      return barrio ? barrio.nombre_barrio : 'Desconocido';
    },

    salir() {
      // Navegar hacia atrás en el historial o a una ruta específica
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push('/admin');
      }
    },
    
    // Método de utilidad
    mostrarError(mensaje) {
      this.mensajeError = mensaje;
      this.snackbarError = true;
    },

    mostrarSuccess(mensaje) {
      this.mensajeSuccess = mensaje;
      this.snackbarSuccess = true;
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-top: 20px;
}

.titulo-pantalla {
  font-weight: bold;
  font-size: 28px;
  color: #324b21;
}

.v-data-table {
  background: white;
}

.v-toolbar {
  background-color: #324b21;
}

.v-toolbar-title {
  font-weight: bold;
}

.v-expansion-panels {
  background: white;
}
</style>
