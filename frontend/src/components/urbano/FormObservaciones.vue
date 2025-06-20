<template>
  <v-container :class="['container', tipoClaseContainer]">
    <v-col cols="auto" class="d-flex justify-center">
      <h2 class="titulo-pantalla">Observaciones</h2>
    </v-col>
    <v-col cols="auto" class="d-flex justify-center">                 
      <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-pencil" @click="actualiza" :disabled="!getIdPredio" v-if="canEdit">Actualizar</v-btn>
    </v-col>             

    <!-- Primer Bloque -->
    <v-card :class="['mb-3', 'block-color', tipoClaseBlock, 'fill-width']">
      <v-card-title class="centered-title">
        Observaciones del Lote
      </v-card-title>
      <v-card-text>        
        <v-row>
          <v-col cols="12" sm="6" md="12">
            <v-textarea label="Observaciones" v-model="form.observaciones" class="block-color"></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>        
        <v-row>
          <v-col cols="12" sm="6" md="12">
            <v-textarea label="Descripción del Lote" v-model="form.descripcion_lote" class="block-color"></v-textarea>
          </v-col>
        </v-row>        
      </v-card-text>
    </v-card>

    <!-- Segundo Bloque -->
    <v-card :class="['mb-3', 'block-color', tipoClaseBlock, 'fill-width']">
      <v-card-title class="centered-title">
        Información Adicional
      </v-card-title>
      <v-card-text>        
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field label="Actualizador" v-model="form.actualizador" class="block-color"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Nombre Informador" v-model="form.nombre_informador" class="block-color"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Digitador" v-model="form.digitador" class="block-color"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Fecha Registro" v-model="form.fecha_registro" class="block-color" type="date"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Fecha Actualización" v-model="form.fecha_actualizacion" class="block-color" type="date"></v-text-field>
          </v-col>
        </v-row>        
      </v-card-text>
    </v-card>

    <!-- Alerta -->
    <v-snackbar v-model="snackbar" :timeout="3000" color="error">
      {{ snackbarError }}
    </v-snackbar>
    <v-snackbar v-model="snackbar" :timeout="3000" color="success">
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
  name: 'TabObservaciones',
  data() {
    return {
      form: {
        observaciones: '',
        fecha_actualizacion: '',
        actualizador: '',
        nombre_informador: '',
        digitador: '',
        fecha_registro: '',
        descripcion_lote: '',
      },      
      snackbar: false,
      snackbarOk: '',
      snackbarError: ''  
    };
  },
  computed: {
    ...mapGetters(['getIdPredio','isConsultaPrimario', 'getTipoPredio']),
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
    // Validar idPredio
    if (!this.getIdPredio) {
      console.error(`idPredio (${this.getIdPredio}) no está definido`);      
      return;
    }
    // Montar idPredio e idTenencia
    this.id_predio = this.getIdPredio;    
    console.log('ID DEL PREDIO:', this.id_predio);   
    
    // Cargar datos por idPredio
    await this.cargaDatosPorIdPredio(this.id_predio);
  },  

  methods: {
    async actualiza() {
      console.log('Actualizando observaciones...');

      // Establecer la fecha de actualización a la fecha actual
      this.form.fecha_actualizacion = new Date().toISOString().split('T')[0];

      const datosObservaciones = {             
        observaciones: this.form.observaciones || null,
        fecha_actualizacion: this.form.fecha_actualizacion || null,
        actualizador: this.form.actualizador || null,
        nombre_informador: this.form.nombre_informador || null,
        digitador: this.form.digitador || null,
        fecha_registro: this.form.fecha_registro || null,
        descripcion_lote: this.form.descripcion_lote || null
      };
      console.log('Datos a actualizar (JSON):', JSON.stringify(datosObservaciones, null, 2));
      try {
        const response = await axios.put(`${API_BASE_URL}/actualiza_observaciones/${this.getIdPredio}`, datosObservaciones);
        console.log('Respuesta del servidor:', response.data);        
        this.snackbarOk = 'Observaciones actualizadas con éxito';
        this.snackbar = true;
        
      } catch (error) {
        console.error('Error al actualizar las observaciones:', error);        
        this.snackbarError = `Error al actualizar las observaciones: ${error.message.data.detail}`;
        this.snackbar = true;
      }
    },

    async cargaDatosPorIdPredio(idPredio) {
      try {
        const response = await axios.get(`${API_BASE_URL}/catastro_predio_by_id/${idPredio}`);
        const datos = response.data;
        console.log('Datos cargados:', datos);

        // Asignar los datos al formulario
        this.form.observaciones = datos.observaciones;
        this.form.fecha_actualizacion = datos.fecha_actualizacion ? datos.fecha_actualizacion.split('T')[0] : '';
        this.form.actualizador = datos.actualizador;
        this.form.nombre_informador = datos.nombre_informador;
        this.form.digitador = datos.digitador;
        this.form.fecha_registro = datos.fecha_registro ? datos.fecha_registro.split('T')[0] : '';
        this.form.descripcion_lote = datos.descripcion_lote;
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        this.snackbarError = 'Error al cargar los datos';
        this.snackbar = true;
      }
    }
  }
}
</script>

<style scoped>
.titulo-pantalla{
  color: #F1ECE7;
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



</style>
