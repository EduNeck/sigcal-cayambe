<template>
  <v-container :class="['container', tipoClaseContainer]">

  <v-col cols="12" class="text-center">
    <h2 class="titulo-pantalla">Ingreso de Mejoras</h2>
  </v-col>
  <v-col cols="auto" class="d-flex justify-center">
    <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-plus" @click="nuevo" :disabled="!idPredio" v-if="canEdit">Nuevo</v-btn>
    <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-check" @click="guardar" :disabled=" !idPredio || !!idMejora" v-if="canEdit">Guardar</v-btn>
    <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-pencil" @click="actualizarMejoras" :disabled="!idMejora" v-if="canEdit">Actualizar</v-btn>
    <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-delete" @click="eliminar" :disabled="isConsultaPrimario" v-if="canEdit">Eliminar</v-btn>
  </v-col>
        

    <!-- Primer Bloque -->
    <v-card :class="['mb-3', 'block-color', tipoClaseBlock, 'fill-width']">
      <v-card-title class="centered-title">DATOS DE LA MEJORA</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-select
              v-model="form.id_tipo_obra"
              :items="tipoObra"
              label="Tipo de Obra"
              item-text="title"
              item-value="id"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select
              v-model="form.id_material"
              :items="materiales"
              label="Material"
              item-text="title"
              item-value="id"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="form.area"
              label="Cantidad / Dimensión"
              type="number"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Segundo Bloque -->
    <v-card :class="['mb-3', 'block-color', tipoClaseBlock, 'fill-width']">
      <v-card-title class="centered-title">ESTADO Y CONDICIÓN</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-select
              v-model="form.id_estado"
              :items="estados"
              label="Estado"
              item-text="title"
              item-value="id"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select
              v-model="form.id_condicion_fisica"
              :items="condicionesFisicas"
              label="Condición Física"
              item-text="title"
              item-value="id"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="form.anio_construccion"
              label="Año de Construcción"
              type="number"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
  <!-- Alerta -->
  <v-snackbar v-model="snackbarErrorPush" :timeout="3000" color="error">
    {{ snackbarError }}
  </v-snackbar>
  <v-snackbar v-model="snackbarOkPush" :timeout="3000" color="success">
    {{ snackbarOk }}
  </v-snackbar>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import useUserRoles from '@/composables/useUserRoles';
import { useMejorasEvents } from '@/composables/useMejorasEvents';
import API_BASE_URL from '@/config/apiConfig';

export default {
    name: 'TabMejoras', // 🔧 Force refresh - Fixed mapActions duplication issue
    setup() {
        const { emitMejorasUpdated } = useMejorasEvents();
        return { emitMejorasUpdated };
    },
    data() {
        return {
            form: {
                id_tipo_obra: null,
                id_material: null,
                area: '',
                id_estado: null,
                id_condicion_fisica: null,
                anio_construccion: '',
            },
            idPredio: null,
            idMejora: null,
            tipoObra: [],
            materiales: [],
            estados: [],
            condicionesFisicas: [],
            snackbarOkPush: false,
            snackbarErrorPush: false,
            snackbarOk: '',
            snackbarError: ''   
        };
    },
    
    computed: {
      ...mapGetters(['getIdPredio', 'getIdMejora', 'isConsultaPrimario', 'getTipoPredio']),        

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
      await this.cargaCatalogo();
      console.log('ID PREDIO:', this.getIdPredio);
      console.log('ID MEJORAS:', this.getIdMejora);

      if (!this.getIdPredio) {
          console.error(`idPredio (${this.getIdPredio}) no está definido`);          
          return;
      }else{
          this.idPredio = this.getIdPredio;
          this.idMejora = this.getIdMejora;
      }

      if (this.getIdMejora) {
        await this.cargarDatosMejoras(this.getIdMejora);
      }
             
    },


    methods: {
        ...mapActions(['incrementMejorasCount']), // 🔧 Action para incrementar contador de mejoras
        async cargaCatalogo() {
            try {
                this.tipoObra = await this.cargaCatalogos(59,0); 
                this.materiales = await this.cargaCatalogos(26,0); 
                this.estados = await this.cargaCatalogos(27,0); 
                this.condicionesFisicas = await this.cargaCatalogos(28,0); 
            } catch (error) {
                console.error('Error fetching catalogos:', error);
            }
        },

        // Cargar Catalogo
        async cargaCatalogos(id_tipo_atributo, tipo) {
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

        // Cargar Datos Mejoras
        async cargarDatosMejoras(idMejora) {            
            console.log('ID DE LA MEJORA:', this.getIdMejora);
            try {
              const response = await axios.get(`${API_BASE_URL}/mejora_by_id/${idMejora}`);
              console.log('Datos recuperados del servidor:', response.data);
              this.form = { ...this.form, ...response.data };
            } catch (error) {
              console.error('Error al recuperar los datos del bloque:', error);
              
            }
        },

        async guardar() {
          console.log('Guardando mejora:', this.form);

          // Procesar los datos para enviar valores correctos
          const nuevaMejora = {
            id_predio: this.idPredio || null,
            id_tipo_obra: this.form.id_tipo_obra || null,
            id_material: this.form.id_material || null,
            area: this.form.area ? parseFloat(this.form.area) : 0,
            id_estado: this.form.id_estado || null,
            id_condicion_fisica: this.form.id_condicion_fisica || null,
            anio_construccion: this.form.anio_construccion ? parseInt(this.form.anio_construccion) : 0,
          };

          try {
            const response = await axios.post(`${API_BASE_URL}/inserta_mejora`, nuevaMejora);
            console.log('Mejora creada con éxito:', response.data);
            this.idMejora = response.data;
            console.log('ID de la mejora creada:', this.idMejora);
            this.snackbarOk = 'Mejora creada con éxito';
            this.snackbarOkPush = true;
            
            // 🔧 Emitir evento y actualizar contador para reactividad
            this.emitMejorasUpdated();
            this.incrementMejorasCount();
          } catch (error) {
            console.error('Error al guardar la mejora', error);
            this.snackbarError = `Error al guardar la mejora: ${error.message}`;
            this.snackbarErrorPush = true;
          }
        },

        async actualizarMejoras() {
          console.log('Actualizando mejora:', this.form);

          // Procesar los datos para enviar valores correctos
          const mejoraActualizada = {
            id_predio: this.idPredio || null,
            id_tipo_obra: this.form.id_tipo_obra || null,
            id_material: this.form.id_material || null,
            area: this.form.area ? parseFloat(this.form.area) : 0,
            id_estado: this.form.id_estado || null,
            id_condicion_fisica: this.form.id_condicion_fisica || null,
            anio_construccion: this.form.anio_construccion ? parseInt(this.form.anio_construccion) : 0,
          };

          try {
            const response = await axios.put(`${API_BASE_URL}/actualiza_mejora/${this.idMejora}`, mejoraActualizada);
            console.log('Mejora actualizada con éxito:', response.data);
            this.snackbarOk = 'Mejora actualizada con éxito';
            this.snackbarOkPush = true;
            
            // 🔧 Emitir evento y actualizar contador para reactividad
            this.emitMejorasUpdated();
            this.incrementMejorasCount();
          } catch (error) {
            console.error('Error al actualizar la mejora', error);
            this.snackbarError = `Error al actualizar la mejora: ${error.message}`;
            this.snackbarErrorPush = true;
          }
        },

        async eliminar() {
          console.log('Eliminando mejora:', this.idMejora);
          if (!this.idMejora) {
            this.snackbarError = 'No hay un mejora seleccionado para eliminar';
            this.snackbarErrorPush = true;
            return;
          }
          try {
            await axios.post(`${API_BASE_URL}/elimina_mejora_by_id/${this.idMejora}`);
            this.snackbarOk = 'mejora eliminado exitosamente';
            this.snackbarOkPush = true;
            this.nuevo();
            
            // 🔧 Emitir evento y actualizar contador para reactividad
            this.emitMejorasUpdated();
            this.incrementMejorasCount();
          } catch (error) {
            console.error('Error al eliminar el mejora:', error);
            this.snackbarError = 'Error al eliminar el mejora';
            this.snackbarErrorPush = true;
          }
        },    

        nuevo() {
            this.form = {
                id_tipo_obra: null,
                id_material: null,
                area: '',
                id_estado: null,
                id_condicion_fisica: null,
                anio_construccion: '',                
                idMejora: null,
            };
        },
    },
};
</script>

<style scoped>
.urbano-container {
    background-color: #114358;
}
.rural-container {
    background-color: #668A4C;
}

.urbano-btn {
    background-color: #276E90;
    color: #ffffff;
}
.rural-btn {
    background-color: #4C7031;
    color: #ffffff;
}

.urbano-block {
    background-color: #F1ECE7;
    color: #114358;
}
.rural-block {
    background-color: #F1ECE7;
    color: #4C7031;
}

.centered-title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    text-align: center;
    font-size: 1rem;
}

.urbano-title {
    background-color: #276E90;
    color: #F1ECE7;
    font-weight: bold;
}
.rural-title {
    background-color: #4C7031;
    color: #F1ECE7;
    font-weight: bold;
}

.titulo-pantalla {
    font-size: 2rem;
    color: #ffffff;
}

.v-data-table-header th {
    color: black !important;
}

.selected-row {
    background-color: #114358; 
    color: white;
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
