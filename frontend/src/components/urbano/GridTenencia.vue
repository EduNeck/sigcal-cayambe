<template>
  <v-container :class="['container', tipoClaseContainer]">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h3 class="titulo-pantalla">Registro de Tenencias</h3>
      </v-col>

      <v-col cols="12" class="d-flex justify-space-between align-center">
        <v-btn :class="tipoClaseBtn" icon @click="agregarFila">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn :class="tipoClaseBtn" prepend-icon="mdi-content-save" @click="guardarTenencias">
          Guardar
        </v-btn>
      </v-col>

      <v-col cols="12">
        <v-data-table :headers="headers" :items="filas" item-value="id_propietario" dense class="elevation-1">

          <template v-slot:item.id_propietario="{ item }">
            <v-autocomplete
              v-model="item.id_propietario"
              :items="ciudadanos"
              :item-title="ciudadanoLabel"
              item-value="id_ciudadano"
              label="Seleccione propietario"
              dense
              :rules="[rules.required]"
              style="min-width: 300px"
            />
          </template>

          <template v-slot:item.porcentaje_participacion="{ item }">
            <v-text-field
              v-model.number="item.porcentaje_participacion"
              type="number"
              placeholder="%"
              :rules="[rules.required, rules.porcentaje]"
              dense
              style="max-width: 120px"
              @blur="item.porcentaje_participacion = formatDecimal(item.porcentaje_participacion)"
            />
          </template>

          <template v-slot:item.representante="{ item }">
            <v-checkbox v-model="item.representante" :true-value="1" :false-value="2" />
          </template>

          <template v-slot:item.acciones="{ item, index }">
            <v-btn color="red" icon @click="eliminarFila(index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>

        </v-data-table>

        <v-snackbar v-model="snackbarError" :timeout="3000" color="error" rounded="pill">
          {{ mensajeError }}
        </v-snackbar>

        <v-snackbar v-model="snackbarOk" :timeout="3000" color="success" rounded="pill">
          {{ mensajeOk }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      filas: [],
      mensajeError: '',
      snackbarError: false,
      snackbarOk: false,
      mensajeOk: '',
      ciudadanos: [],
      headers: [
        { title: 'Propietario', value: 'id_propietario' },
        { title: 'Participación (%)', value: 'porcentaje_participacion' },
        { title: 'Representante', value: 'representante' },
        { title: 'Acciones', value: 'acciones', sortable: false }
      ],
      rules: {
        required: v => !!v || 'Requerido',
        porcentaje: v => (v >= 0 && v <= 100) || 'Debe estar entre 0 y 100'
      }
    };
  },
  computed: {
    ...mapGetters(['getIdPredio', 'getTipoPredio']),
    tipoClaseContainer() {
      return this.getTipoPredio === 1 ? 'urbano-container' : 'rural-container';
    },
    tipoClaseBtn() {
      return this.getTipoPredio === 1 ? 'urbano-btn' : 'rural-btn';
    }
  },
  methods: {
    async cargarCiudadanos() {
      try {
        const res = await axios.get(`${API_BASE_URL}/ciudadano_tenencia`);
        this.ciudadanos = res.data;
      } catch (error) {
        console.error('Error cargando ciudadanos:', error);
      }
    },
    ciudadanoLabel(ciudadano) {
    if (!ciudadano) return '';
    return `${ciudadano.nombres} - ${ciudadano.numero_documento}`;
    },
    agregarFila() {
      this.filas.push({
        id_predio: this.getIdPredio,
        id_propietario: null,
        porcentaje_participacion: 0,
        representante: 2
      });
    },
    eliminarFila(index) {
      this.filas.splice(index, 1);
    },
    async guardarTenencias() {
      this.mensajeError = '';
      this.snackbarError = false;
      this.snackbarOk = false;

      const porcentajeTotal = this.filas.reduce((sum, f) => sum + Number(f.porcentaje_participacion), 0);

      if (porcentajeTotal > 100) {
        this.mensajeError = 'El total de participación no puede ser mayor al 100%.';
        this.snackbarError = true;
        return;
      }

      if (this.filas.some(f => !f.id_propietario || f.porcentaje_participacion === null)) {
        this.mensajeError = 'Complete todos los campos requeridos.';
        this.snackbarError = true;
        return;
      }

      try {
        await axios.post(`${API_BASE_URL}/inserta_varias_tenencias`, this.filas);
        this.mensajeOk = '✅ Tenencias guardadas con éxito';
        this.snackbarOk = true;
        this.filas = [];
      } catch (error) {
        this.mensajeError = 'Error al guardar: ' + (error.response?.data?.message || error.message);
        this.snackbarError = true;
      }
    },
    formatDecimal(value) {
      if (value === null || value === undefined || value === '') return '';
      const num = Number(value);
      if (isNaN(num)) return '';
      return num.toFixed(2);
    }
  },
  mounted() {
    this.cargarCiudadanos();
  }
};
</script>

<style scoped>
.titulo-pantalla {
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

.v-data-table {
  background: #f9f9f9;
}
</style>
