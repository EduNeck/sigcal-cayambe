<template>
  <v-container :class="['container', tipoClaseContainer]">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Ingreso de Vías</h2>
      </v-col>
      <v-col cols="auto" class="d-flex justify-center">
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-plus" @click="nuevo" :disabled="!getIdPredio" v-if="canEdit">Nuevo</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-check" @click="guardar" :disabled="!getIdPredio || !!idVia" v-if="canEdit">Guardar</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-pencil" @click="actualizarVia" :disabled="!idVia" v-if="canEdit">Actualizar</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-delete" @click="eliminar" :disabled="isConsultaPrimario" v-if="canEdit">Eliminar</v-btn>
      </v-col>
    </v-row>              

    <v-row justify="center" class="mb-3">
      <v-col cols="12" md="6">
        <!-- Primer Bloque -->
        <v-card :class="['mb-3', 'block-color', tipoClaseBlock]">
          <v-card-title :class="['centered-title', tipoClaseTitle]">Información de la Vía</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-select
                  v-model="form.via_principal"
                  :items="valida"
                  label="Vía Principal"                  
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <!-- Segundo Bloque - Selección de Barrio y Calle -->
        <v-card :class="['mb-3', 'block-color', tipoClaseBlock]">
            <v-card-title :class="['centered-title', tipoClaseTitle]">Selección de Barrio y Calle</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="6" md="6">
                        <v-select
                            v-model="barrioSeleccionado"
                            :items="barrios"
                            item-title="nombre_barrio"
                            item-value="id_barrio"
                            label="Seleccionar Barrio"
                            variant="outlined"
                            density="comfortable"
                            prepend-inner-icon="mdi-home-city"
                            placeholder="Seleccione un barrio"
                            clearable
                            @update:model-value="cargarCallesPorBarrio"
                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-select
                            v-model="calleSeleccionada"
                            :items="calles"
                            item-title="nombre_calle"
                            item-value="nombre_calle"
                            label="Seleccionar Calle"
                            variant="outlined"
                            density="comfortable"
                            prepend-inner-icon="mdi-road"
                            placeholder="Seleccione una calle"
                            clearable
                            :disabled="!barrioSeleccionado || calles.length === 0"
                            @update:model-value="copiarNombreCalle"
                        ></v-select>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        
        <!-- Tercer Bloque -->
        <v-card :class="['mb-3', 'block-color', tipoClaseBlock]">
            <v-card-title :class="['centered-title', tipoClaseTitle]">Datos de la Vía</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="6" md="12">
                        <v-text-field
                            v-model="form.nombre_via"
                            label="Nombre de la Vía *"
                            :rules="[v => !!v || 'Este campo es obligatorio']"
                            required
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <!-- Cuarto Bloque -->
        <v-card :class="['mb-3', 'block-color', tipoClaseBlock]">
            <v-card-title :class="['centered-title', tipoClaseTitle]">Caracteristicas de la Via</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field
                            v-model="form.longitud"
                            label="Longitud *"
                            type="number"
                            required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6" md="6">
                            <v-select
                            v-model="form.id_tipo_via"
                            :items="tipoVias"
                            label="Tipo de Vía *"
                            item-text="title"
                            item-value="id"
                            :rules="[v => !!v || 'Este campo es obligatorio']"
                            required
                            ></v-select>
                        </v-col>

                        <v-col cols="12" sm="6" md="6">
                            <v-select
                            v-model="form.id_aceras_bordillos"
                            :items="acerasBordillos"
                            label="Aceras y Bordillos *"
                            item-text="title"
                            item-value="id"
                            :rules="[v => !!v || 'Este campo es obligatorio']" 
                            required
                            ></v-select>
                        </v-col>

                        <v-col cols="12" sm="6" md="6">
                            <v-select
                            v-model="form.id_material_via"
                            :items="materialVias"
                            label="Material de Vía *"
                            item-text="title"
                            item-value="id"
                            :rules="[v => !!v || 'Este campo es obligatorio']" 
                            required
                            ></v-select>
                        </v-col>

                        <v-col cols="12" sm="6" md="6">
                            <v-text-field
                            v-model="form.num_inmueble"
                            label="Número de Inmueble"
                            type="text"
                            :rules="[v => v === '' || v === null || typeof v === 'string' || 'Debe ser un texto válido']"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6" md="6">
                            <v-text-field
                            v-model="form.codigo_vias"
                            label="Código de Vías"
                            type="text"
                            :rules="[v => v === '' || v === null || typeof v === 'string' || 'Debe ser un texto válido']"
                            ></v-text-field>
                        </v-col>
                    </v-row>
            </v-card-text>
        </v-card>        
      </v-col>
    </v-row>
    <!-- Alerta -->
    <v-snackbar v-model="snackbarErrorPush" :timeout="3000" color="error">
      {{ snackbarError }}
    </v-snackbar>
    <v-snackbar v-model="snackbarOkPush" :timeout="3000" color="success">
      {{ snackbarOk }}
    </v-snackbar>

  </v-container>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import useUserRoles from '@/composables/useUserRoles';
import { useViasEvents } from '@/composables/useViasEvents';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'TabVias',
  setup() {
    const { emitViasUpdated } = useViasEvents();
    return { emitViasUpdated };
  },
  data() {
    return {
      form: {
        via_principal: '',
        nombre_via: '',
        longitud: '',
        id_tipo_via: null,
        id_aceras_bordillos: null,
        fecha_registro: '',
        id_material_via: null,
        num_inmueble: '',
        codigo_vias: ''
      },
      valida: ['SI', 'NO'],
      tipoVias: [],
      acerasBordillos: [],
      materialVias: [],
      
      // Datos para barrios y calles
      barrios: [],
      calles: [],
      barrioSeleccionado: null,
      calleSeleccionada: null,
      
      idPredio: null,
      idVia: null,
      snackbar: false,   
      snackbarErrorPush: false,   
      snackbarError: '',
      snackbarOk: '',
      snackbarOkPush: false,
    };
  },

  computed: {
    ...mapGetters(['getIdPredio', 'getIdVia', 'getTipoPredio', 'isConsultaPrimario']),
    canEdit() {
      const { canEdit } = useUserRoles();
      return canEdit.value;
    },
    tipoClaseContainer() {
      return this.getTipoPredio === 1 ? 'urbano-container' : 'rural-container';
    },
    tipoClaseButton() {
      return this.getTipoPredio === 1 ? 'urbano-btn' : 'rural-btn';
    },
    tipoClaseBlock() {
      return this.getTipoPredio === 1 ? 'urbano-block' : 'rural-block';
    },
    tipoClaseTitle() {
      return this.getTipoPredio === 1 ? 'urbano-title' : 'rural-title';
    }
  },

  async mounted() {
    await this.cargaCatalogos();

    // Validar idPredio
    if (!this.getIdPredio) {
      this.snackbarError = 'No se ha definido un predio para el ingreso de Vías';
      this.snackbarErrorPush = true;
      return;
    }

    // Montar idPredio e idVia
    this.idPredio = this.getIdPredio;
    this.idVia = this.getIdVia;
    console.log('ID DEL PREDIO:', this.idPredio);
    console.log('ID DE LA VÍA:', this.idVia);

    // Cargar datos de la vía si existe idVia
    if (this.idVia) {
      await this.cargarDatosVia(this.idVia);
    }    
  },

  methods: {
    ...mapActions(['incrementViasCount']), // 🛣️ Action para incrementar contador de vías
    async cargaCatalogos() {
      try {
        this.tipoVias = await this.cargaCatalogo(21,0); 
        this.acerasBordillos = await this.cargaCatalogo(22,0);
        this.materialVias = await this.cargaCatalogo(23,0);
        
        // Cargar barrios disponibles
        await this.cargarBarrios();
      } catch (error) {
        console.error('Error al obtener los catálogos:', error);
      }
    },

    // Cargar Catalogo
    async cargaCatalogo(id_tipo_atributo, tipo) {
      try {
        const response = await axios.get(`${API_BASE_URL}/catalogo/${id_tipo_atributo}/${tipo}`);
        console.log(`Datos obtenidos para id_tipo_atributo ${id_tipo_atributo} y tipo ${tipo}:`, response.data);
        
        if (Array.isArray(response.data)) {
          // Eliminar duplicados basados en el campo 'id'
          const uniqueData = response.data.filter((item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
          );
          return uniqueData.map(item => ({
            ...item,
            tipoNombre: item.descripcion, // Crea la propiedad `tipoNombre`
            title: item.descripcion        // Crea la propiedad `title`
          }));
        } else {
          throw new Error('La respuesta de la API no es un array');
        }
      } catch (error) {
        console.error('Error fetching catalogo:', error);
        throw new Error('No se pudo obtener el catálogo');
      }
    },

    // Cargar barrios únicos
    async cargarBarrios() {
      try {
        const response = await axios.get(`${API_BASE_URL}/catalogo_barrios`);
        this.barrios = response.data;
      } catch (error) {
        console.error('Error al cargar barrios:', error);
        this.snackbarError = 'Error al cargar la lista de barrios';
        this.snackbarErrorPush = true;
      }
    },

    // Cargar calles por barrio seleccionado
    async cargarCallesPorBarrio(idBarrio) {
      if (!idBarrio) {
        this.calles = [];
        this.calleSeleccionada = null;
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/catalogo_calles_por_barrio/${idBarrio}`);
        console.log('Calles cargadas para barrio:', idBarrio, response.data);
        this.calles = response.data;
        this.calleSeleccionada = null; // Limpiar selección anterior
      } catch (error) {
        console.error('Error al cargar calles:', error);
        this.snackbarError = 'Error al cargar las calles del barrio seleccionado';
        this.snackbarErrorPush = true;
        this.calles = [];
      }
    },

    // Copiar nombre de calle al campo nombre_via
    copiarNombreCalle(nombreCalle) {
      if (nombreCalle) {
        this.form.nombre_via = nombreCalle;
        console.log('Nombre de calle copiado:', nombreCalle);
      }
    },

    async guardar() {
      // Validar campos requeridos
      if (!this.form.nombre_via || !this.form.id_tipo_via || !this.form.id_aceras_bordillos || !this.form.id_material_via || !this.form.longitud) {
        this.snackbarError = 'Por favor, complete todos los campos obligatorios marcados con un (*)';
        this.snackbarErrorPush = true;
        return;
      }

      const nuevaVia = {
        id_predio: this.getIdPredio,
        via_principal: this.form.via_principal === 'SI',
        via_secundaria: false, // Valor por defecto
        nombre_via: this.form.nombre_via,
        longitud: this.form.longitud || 0,
        id_tipo_via: this.form.id_tipo_via,
        id_aceras_bordillos: this.form.id_aceras_bordillos,
        id_material_via: this.form.id_material_via,
        num_inmueble: this.form.num_inmueble || null,
        codigo_vias: this.form.codigo_vias || null
      };

      console.log('Datos a guardar:', nuevaVia);
      try {
        const response = await axios.post(`${API_BASE_URL}/inserta_vias`, nuevaVia);
        console.log('Respuesta del servidor:', response.data);
        this.idVia = response.data;
        console.log('ID de la nueva vía:', this.idVia);
        this.snackbarOk = 'Vía guardada con éxito';
        this.snackbarOkPush = true;
        
        // 🛣️ Emitir evento y actualizar contador para reactividad
        this.emitViasUpdated();
        this.incrementViasCount();
      } catch (error) {
        console.error('Error al guardar la vía:', error);
        this.snackbarError = `Error al guardar la vía: ${error.message}`;
        this.snackbarErrorPush = true;
      }
    },

    async actualizarVia() {
      // Validar campos requeridos
      if (!this.form.nombre_via || !this.form.id_tipo_via || !this.form.id_aceras_bordillos || !this.form.id_material_via) {
        this.snackbarError = 'Por favor, complete todos los campos obligatorios';
        this.snackbarErrorPush = true;
        return;
      }

      const viaActualizada = {
        via_principal: this.form.via_principal === 'SI',
        via_secundaria: false, // Valor por defecto
        nombre_via: this.form.nombre_via,
        longitud: Number(this.form.longitud) || 0,
        id_tipo_via: this.form.id_tipo_via,
        id_aceras_bordillos: this.form.id_aceras_bordillos,
        id_material_via: this.form.id_material_via,
        num_inmueble: this.form.num_inmueble || null,
        codigo_vias: this.form.codigo_vias || null,
        id_predio: this.getIdPredio
      };

      console.log('Datos a actualizar:', viaActualizada);
      try {
        const response = await axios.put(`${API_BASE_URL}/actualiza_vias/${this.getIdVia}`, viaActualizada);
        console.log('Respuesta del servidor:', response.data);
        this.snackbarOk = 'Vía actualizada con éxito';
        this.snackbarOkPush = true;
        
        // 🛣️ Emitir evento y actualizar contador para reactividad
        this.emitViasUpdated();
        this.incrementViasCount();
      } catch (error) {
        console.error('Error al actualizar la vía:', error);
        this.snackbarError = `Error al actualizar la vía: ${error.message}`;
        this.snackbarErrorPush = true;
      }
    },

    async cargarDatosVia(idVia) {
      console.log('ID DE LA VIAS:', this.getIdVia);
      try {
        const response = await axios.get(`${API_BASE_URL}/vias_by_idVias/${idVia}`);
        console.log('Datos recuperados del servidor:', response.data);
        this.form = { ...this.form, ...response.data };
      } catch (error) {
        console.error('Error al recuperar los datos del bloque:', error);
        this.snackbarError = `Error al recuperar los datos del bloque: ${error.message}`;
        this.snackbarErrorPush = true;
      }
    },

    async eliminar() {
      console.log('Eliminando Vias:', this.idVia);
      if (!this.idVia) {
        this.snackbarError = 'No hay un Vias seleccionado para eliminar';
        this.snackbarErrorPush = true;
        return;
      }
      try {
        
        await axios.post(`${API_BASE_URL}/elimina_vias_by_id/${this.idVia}`);
        this.snackbarOk = 'Vias eliminado exitosamente';
        this.snackbar = true;
        this.limpiarFormulario(); // Limpiar el formulario después de eliminar
        
        // 🛣️ Emitir evento y actualizar contador para reactividad
        this.emitViasUpdated();
        this.incrementViasCount();
      } catch (error) {
        console.error('Error al eliminar el Vias:', error);
        this.snackbarError = 'Error al eliminar el Vias';
        this.snackbarErrorPush = true;
      }
    },        

    limpiarFormulario() {
      this.form = {
        via_principal: '',
        nombre_via: '',
        longitud: '',
        id_tipo_via: null,
        id_aceras_bordillos: null,
        fecha_registro: '',
        id_material_via: null,
        num_inmueble: '',
        codigo_vias: ''
      };
      
      // Limpiar selecciones de barrio y calle
      this.barrioSeleccionado = null;
      this.calleSeleccionada = null;
      this.calles = [];
    },

    nuevo() {
      this.limpiarFormulario();
      this.idVia = null;      
    }
    
  }
};
</script>


<style scoped>

.container {
  background-color: #114358;
}

.urbano-container {
  background-color: #114358;
}
.rural-container {
  background-color: #668A4C;
}

.btn_app {
  margin-bottom: 10px;
}
.urbano-btn {
  background-color: #276E90;
  color: #ffffff;
}
.rural-btn {
  background-color: #4C7031;
  color: #ffffff;
}

.block-color {
  background-color: #F1ECE7;
}
.urbano-block {
  color: #114358;
}
.rural-block {
  color: #4C7031;
}

.centered-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
}
.urbano-title {
  background-color: #276E90;
  color: #F1ECE7;
}
.rural-title {
  background-color: #4C7031;
  color: #F1ECE7;
}

.titulo-pantalla {
  font-size: 2rem;
  color: #ffffff;
}

/* Estilos para etiquetas más oscuras */
:deep(.v-label) {
  color: #333333 !important; 
  font-weight: 500 !important;
}

/* Etiquetas en selects */
:deep(.v-select .v-label) {
  color: #2c2c2c !important;
  font-weight: 500 !important;
}

/* Etiquetas cuando el campo está enfocado */
:deep(.v-field--focused .v-label) {
  color: #276E90 !important;
  font-weight: 600 !important;
}

/* Mejorar legibilidad de texto en los campos */
:deep(.v-field__input) {
  color: #121212 !important;
  font-weight: 500 !important;
}

/* Mejorar contraste de las etiquetas en diferentes estados */
:deep(.v-field--variant-filled .v-label) {
  opacity: 1 !important;
  text-shadow: 0px 0px 0px rgba(0,0,0,0.1);
}

/* Clase para aplicar a campos específicos si es necesario */
.dark-label :deep(.v-label) {
  color: #222222 !important;
  font-weight: 600 !important;
}
</style>
