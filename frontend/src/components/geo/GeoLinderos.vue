<template>
  <v-container :class="['container', tipoClaseContainer]">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Gestión de Linderos Geográficos</h2>
      </v-col>
      <v-col cols="auto" class="d-flex justify-center">
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-plus" @click="nuevo" v-if="canEdit">Nuevo</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-check" @click="guardar" :disabled="!!idLindero" v-if="canEdit">Guardar</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-pencil" @click="actualizar" :disabled="!idLindero" v-if="canEdit">Actualizar</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-content-copy" @click="duplicarLindero" :disabled="!idLindero" v-if="canEdit">Duplicar</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-delete" @click="eliminar" :disabled="!idLindero" v-if="canEdit">Eliminar</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-close" @click="cancelarEdicion" :disabled="!idLindero" v-if="canEdit">Cancelar</v-btn>
        <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-refresh" @click="cargarLinderos">Refrescar</v-btn>
      </v-col>
    </v-row>

    <!-- Formulario de Datos del Lindero -->
    <v-card class="mb-3" :class="['block-color', tipoClaseBlock]">
      <v-card-title :class="['centered-title', tipoClaseTitle]">
        {{ idLindero ? 'EDITANDO LINDERO' : (esDuplicado ? 'DUPLICANDO LINDERO' : 'DATOS DEL LINDERO') }}
        <v-chip v-if="idLindero" color="warning" size="small" class="ml-2">ID: {{ idLindero }}</v-chip>
        <v-chip v-if="esDuplicado" color="info" size="small" class="ml-2">DUPLICANDO REGISTRO</v-chip>
      </v-card-title>
      <v-card-text>
        <v-alert
          v-if="esDuplicado && linderoOriginal"
          type="info"
          variant="tonal"
          class="mb-3"
          density="compact"
        >
          Duplicando el lindero ID: {{ linderoOriginal.id }} - {{ linderoOriginal.cardinalidad }}
          ({{ linderoOriginal.clave_lindero }}).
          Modifique los valores necesarios y luego presione "Guardar" para crear un nuevo registro.
        </v-alert>

        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-text-field 
              label="Clave Catastral" 
              v-model="form.clave_catastral" 
              type="text"
              hint="Clave catastral del predio actual (solo lectura)"
              readonly
              required
              :disabled="true"
            />
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field 
              label="Longitud (m)" 
              v-model="form.longitud" 
              type="number"
              step="0.01"
              hint="Longitud del lindero en metros"
              required
            />
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field 
              label="Clave Lindero" 
              v-model="form.clave_lindero" 
              type="text"
              hint="Identificador único del lindero"
              required
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-select 
              :items="cardinalidades" 
              label="Cardinalidad" 
              v-model="form.cardinalidad" 
              item-title="text"
              item-value="value"
              hint="Orientación del lindero"
              required
            />
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-text-field 
              label="Orden" 
              v-model="form.ord" 
              type="number"
              hint="Orden de secuencia del lindero"
              min="1"
            />
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-textarea 
              label="Nombres/Descripción" 
              v-model="form.nombres" 
              rows="2"
              hint="Descripción del lindero"
              auto-grow
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tabla de Linderos -->
    <v-card :class="['block-color', tipoClaseBlock]">
      <v-card-title :class="['centered-title', tipoClaseTitle]">LISTA DE LINDEROS</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="linderos"
          :items-per-page="10"
          class="elevation-1"
          @click:row="(event, { item }) => seleccionarLindero(item)"
          :item-class="getItemClass"
          item-key="id"
          hover
        >
          <template v-slot:item.longitud="{ item }">
            {{ item.longitud ? parseFloat(item.longitud).toFixed(2) + ' m' : '-' }}
          </template>
          <template v-slot:item.nombres="{ item }">
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <span v-bind="props" class="text-truncate" style="max-width: 150px; display: inline-block;">
                  {{ item.nombres || 'Sin descripción' }}
                </span>
              </template>
              <span>{{ item.nombres || 'Sin descripción' }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Alertas -->
    <v-snackbar v-model="snackbarErrorPush" :timeout="3000" color="error" rounded="pill">
      {{ snackbarError }}
    </v-snackbar>
    <v-snackbar v-model="snackbarOkPush" :timeout="3000" color="success">
      {{ snackbarOk }}
    </v-snackbar>

  </v-container>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import useUserRoles from '@/composables/useUserRoles';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'GeoLinderos',
  data() {
    return {
      form: {
        clave_catastral: this.$store.getters.getClaveCatastral || '', // Inicializar con la clave del store
        longitud: null,
        clave_lindero: '',
        nombres: '',
        cardinalidad: '',
        ord: null
      },
      linderos: [],
      idLindero: null,
      esDuplicado: false,  // Flag para indicar si estamos trabajando con un registro duplicado
      linderoOriginal: null, // Guardar la referencia al lindero original que se está duplicando
      snackbarErrorPush: false,
      snackbarError: '',
      snackbarOkPush: false,
      snackbarOk: '',
      
      // Datos para selects
      cardinalidades: [
        { value: 'Norte', text: 'Norte' },
        { value: 'Sur', text: 'Sur' },
        { value: 'Este', text: 'Este' },
        { value: 'Oeste', text: 'Oeste' },
        { value: 'Noreste', text: 'Noreste' },
        { value: 'Noroeste', text: 'Noroeste' },
        { value: 'Sureste', text: 'Sureste' },
        { value: 'Suroeste', text: 'Suroeste' }
      ],
      
      headers: [
        { title: 'ID', value: 'id', width: '80px' },
        { title: 'Clave Catastral', value: 'clave_catastral', width: '150px' },
        { title: 'Clave Lindero', value: 'clave_lindero', width: '120px' },
        { title: 'Longitud (m)', value: 'longitud', width: '100px' },
        { title: 'Cardinalidad', value: 'cardinalidad', width: '120px' },
        { title: 'Orden', value: 'ord', width: '80px' },
        { title: 'Nombres/Descripción', value: 'nombres', width: '200px' }
      ]
    }
  },
  computed: { 
    ...mapGetters(['getTipoPredio', 'getClaveCatastral']),

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
    },

    canEdit() {
      const { canEdit } = useUserRoles();
      return canEdit.value; 
    }
  },
  watch: {
    // Recargar linderos automáticamente cuando cambie la clave catastral
    getClaveCatastral(nuevaClave, viejaClaven) {
      console.log('Clave catastral cambió de:', viejaClaven, 'a:', nuevaClave);
      // Solo limpiar y recargar si realmente cambió la clave (no solo se actualizó)
      if (nuevaClave !== viejaClaven) {
        // Actualizar inmediatamente el campo del formulario
        this.form.clave_catastral = nuevaClave || '';
        this.cargarLinderos();
        // Solo limpiar si no hay un lindero seleccionado para editar
        if (!this.idLindero) {
          this.limpiarFormulario();
        }
      }
    }
  },
  async mounted() {
    console.log('Componente GeoLinderos montado');
    // Cargar la clave catastral del store inmediatamente
    this.form.clave_catastral = this.getClaveCatastral || '';
    console.log('Clave catastral cargada en el formulario:', this.form.clave_catastral);
    await this.cargarLinderos();
  },
  methods: {
    async cargarLinderos() {
      try {
        const claveCatastral = this.getClaveCatastral;
        
        if (claveCatastral) {
          // Si hay clave catastral en el store, filtrar por ella
          const response = await axios.get(`${API_BASE_URL}/geo_linderos_by_clave/${claveCatastral}`);
          this.linderos = response.data;
          console.log(`Cargados ${this.linderos.length} linderos para la clave catastral: ${claveCatastral}`);
        } else {
          // Si no hay clave catastral, cargar todos (comportamiento anterior)
          const response = await axios.get(`${API_BASE_URL}/geo_linderos`);
          this.linderos = response.data;
          console.log(`Cargados ${this.linderos.length} linderos (todos)`);
        }
      } catch (error) {
        console.error('Error al cargar linderos:', error);
        this.snackbarError = 'Error al cargar la lista de linderos';
        this.snackbarErrorPush = true;
      }
    },

    seleccionarLindero(item) {
      // Extraer el lindero del item (puede venir como { raw: lindero } en Vuetify 3)
      const lindero = item.raw || item;
      
      console.log('Lindero seleccionado:', lindero);
      console.log('ID del lindero:', lindero.id);
      this.idLindero = lindero.id;
      console.log('idLindero establecido a:', this.idLindero);
      
      // Mantener la clave catastral del store, no la del lindero seleccionado
      this.form = {
        clave_catastral: this.getClaveCatastral || '', // Usar siempre la clave del store
        longitud: lindero.longitud || null,
        clave_lindero: lindero.clave_lindero || '',
        nombres: lindero.nombres || '',
        cardinalidad: lindero.cardinalidad || '',
        ord: lindero.ord || null
      };
      
      console.log('Formulario actualizado:', this.form);
      console.log('Estado de botones - Actualizar habilitado:', !!this.idLindero);
    },

    async guardar() {
      const esDuplicacion = this.esDuplicado;
      console.log(`${esDuplicacion ? 'Guardando lindero duplicado' : 'Guardando nuevo lindero'}:`, this.form);

      const nuevoLindero = {
        clave: this.form.clave_catastral || null, // Envía como 'clave' al backend
        longitud: this.form.longitud || null,
        clave_lindero: this.form.clave_lindero || null,
        nombres: this.form.nombres || null,
        cardinalidad: this.form.cardinalidad || null,
        ord: this.form.ord || null
      };

      try {
        const response = await axios.post(`${API_BASE_URL}/inserta_geo_lindero`, nuevoLindero);
        console.log('Lindero guardado con ID:', response.data.id);
        
        // Personalizar mensaje según si es duplicación o nuevo registro
        if (esDuplicacion) {
          this.snackbarOk = 'Lindero duplicado guardado exitosamente con ID: ' + response.data.id;
        } else {
          this.snackbarOk = 'Lindero guardado exitosamente';
        }
        
        this.snackbarOkPush = true;
        await this.cargarLinderos();
        this.limpiarFormulario(); // Esto también resetea esDuplicado y linderoOriginal
      } catch (error) {
        console.error('Error al guardar lindero:', error);
        this.snackbarError = `Error al ${esDuplicacion ? 'guardar lindero duplicado' : 'guardar el lindero'}`;
        this.snackbarErrorPush = true;
      }
    },

    async actualizar() {
      console.log('Actualizando lindero ID:', this.idLindero);

      const linderoActualizado = {
        clave: this.form.clave_catastral || null, // Envía como 'clave' al backend
        longitud: this.form.longitud || null,
        clave_lindero: this.form.clave_lindero || null,
        nombres: this.form.nombres || null,
        cardinalidad: this.form.cardinalidad || null,
        ord: this.form.ord || null
      };

      try {
        const response = await axios.put(`${API_BASE_URL}/actualiza_geo_lindero/${this.idLindero}`, linderoActualizado);
        console.log('Lindero actualizado:', response.data);
        this.snackbarOk = 'Lindero actualizado exitosamente';
        this.snackbarOkPush = true;
        await this.cargarLinderos();
      } catch (error) {
        console.error('Error al actualizar lindero:', error);
        this.snackbarError = 'Error al actualizar el lindero';
        this.snackbarErrorPush = true;
      }
    },

    async eliminar() {
      console.log('Eliminando lindero ID:', this.idLindero);
      
      if (!this.idLindero) {
        this.snackbarError = 'No hay un lindero seleccionado para eliminar';
        this.snackbarErrorPush = true;
        return;
      }

      if (!confirm('¿Está seguro de que desea eliminar este lindero?')) {
        return;
      }

      try {
        await axios.delete(`${API_BASE_URL}/elimina_geo_lindero/${this.idLindero}`);
        this.snackbarOk = 'Lindero eliminado exitosamente';
        this.snackbarOkPush = true;
        await this.cargarLinderos();
        this.limpiarFormulario();
      } catch (error) {
        console.error('Error al eliminar lindero:', error);
        this.snackbarError = 'Error al eliminar el lindero';
        this.snackbarErrorPush = true;
      }
    },

    limpiarFormulario() {
      const claveCatastralActual = this.getClaveCatastral; // Mantener la clave catastral del store
      
      this.form = {
        clave_catastral: claveCatastralActual || '', // Pre-llenar con la clave del store
        longitud: null,
        clave_lindero: '',
        nombres: '',
        cardinalidad: '',
        ord: null
      };
      this.idLindero = null;
      this.esDuplicado = false; // Resetear el flag de duplicación
      this.linderoOriginal = null; // Limpiar la referencia al lindero original
    },

    nuevo() {
      this.limpiarFormulario();
      // Verificar que hay una clave catastral disponible
      if (!this.getClaveCatastral) {
        this.snackbarError = 'No hay una clave catastral seleccionada. Primero debe seleccionar un predio.';
        this.snackbarErrorPush = true;
      }
    },

    getItemClass(item) {
      return item.id === this.idLindero ? 'selected-row' : '';
    },

    cancelarEdicion() {
      this.idLindero = null;
      this.limpiarFormulario(); // También resetea esDuplicado y linderoOriginal
      
      // Personalizar el mensaje según el contexto
      if (this.esDuplicado) {
        this.snackbarOk = 'Duplicación cancelada';
      } else {
        this.snackbarOk = 'Edición cancelada';
      }
      
      this.snackbarOkPush = true;
    },

    // Método alternativo para manejar el clic en la fila
    handleRowClick(event, rowData) {
      console.log('handleRowClick ejecutado:', event, rowData);
      if (rowData && rowData.item) {
        this.seleccionarLindero(rowData.item);
      }
    },
    
    duplicarLindero() {
      if (!this.idLindero) {
        this.snackbarError = 'No hay un lindero seleccionado para duplicar';
        this.snackbarErrorPush = true;
        return;
      }
      
      // Obtener el lindero seleccionado de la lista
      const linderoSeleccionado = this.linderos.find(l => l.id === this.idLindero);
      if (!linderoSeleccionado) {
        this.snackbarError = 'No se pudo encontrar el lindero seleccionado';
        this.snackbarErrorPush = true;
        return;
      }
      
      // Guardar referencia al lindero original
      this.linderoOriginal = { ...linderoSeleccionado };
      
      // Copiar los datos al formulario, pero NO el ID
      this.form = {
        clave_catastral: this.getClaveCatastral || '', // Mantener la clave catastral actual del store
        longitud: linderoSeleccionado.longitud || null,
        clave_lindero: `${linderoSeleccionado.clave_lindero || ''}_COPIA`, // Añadir sufijo para indicar que es una copia
        nombres: linderoSeleccionado.nombres || '',
        cardinalidad: linderoSeleccionado.cardinalidad || '',
        ord: linderoSeleccionado.ord || null
      };
      
      // Marcar como duplicado para cambiar la UI y el comportamiento
      this.esDuplicado = true;
      
      // Quitar el ID seleccionado para permitir guardar como nuevo registro
      this.idLindero = null;
      
      // Notificar al usuario
      this.snackbarOk = 'Lindero duplicado. Edite los campos y guarde para crear un nuevo registro';
      this.snackbarOkPush = true;
    }
  }
}
</script>

<style scoped>
.container {
  background-color: #114358;
}

.block-color {
  background-color: #F1ECE7;
  color: #114358;
}

.titulo-pantalla {
  font-size: 2rem;
  color: #ffffff;
}

.btn_app {
  background-color: #276E90;
  color: #ffffff;
}

.centered-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
}

.centered-title.urbano-title {
  background-color: #276E90;
  color: #F1ECE7;
  font-size: 1rem;
  font-weight: bold;
}

.centered-title.rural-title {
  background-color: #4C7031;
  color: #F1ECE7;
  font-size: 1rem;
  font-weight: bold;
}

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

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Estilo para la fila seleccionada */
.v-data-table :deep(.selected-row) {
  background-color: #e3f2fd !important;
}

.v-data-table :deep(.selected-row:hover) {
  background-color: #bbdefb !important;
}

/* Hacer las filas clickeables */
.v-data-table :deep(tbody tr) {
  cursor: pointer;
}

.v-data-table :deep(tbody tr:hover) {
  background-color: #f5f5f5 !important;
}
</style>
