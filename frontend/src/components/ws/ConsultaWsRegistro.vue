<template>
  <v-container>
    <v-card class="mx-auto my-6" max-width="700">
      <v-card-title>
        <v-icon class="mr-2">mdi-magnify</v-icon>
        Consulta Registro de la Propiedad
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="consultar">
          <v-select
            v-model="form.op"
            :items="tiposBusqueda"
            label="Tipo de Búsqueda"
            item-title="label"
            item-value="value"
            required
            prepend-icon="mdi-format-list-bulleted"
          />

          <v-text-field
            v-model="form.param"
            :label="etiquetaCampo"
            :prepend-icon="iconoCampo"
            required
            clearable
          />

          <v-btn type="submit" color="primary" block>
            Consultar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-alert v-if="mensaje" type="info" class="my-4">
      {{ mensaje }}
    </v-alert>

    <v-card v-if="respuesta" class="my-4">
      <v-card-title>Resultado</v-card-title>
      <v-card-text>
        <pre>{{ JSON.stringify(respuesta, null, 2) }}</pre>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  data() {
    return {
      form: {
        op: 3,
        param: '',
      },
      mensaje: '',
      respuesta: null,
      tiposBusqueda: [
        { value: 1, label: 'Cédula / RUC' },
        { value: 2, label: 'Nombre completo' },
        { value: 3, label: 'Clave catastral' },
      ],
    };
  },
  computed: {
    etiquetaCampo() {
      switch (this.form.op) {
        case 1: return 'Ingrese cédula o RUC';
        case 2: return 'Ingrese nombre completo';
        case 3: return 'Ingrese clave catastral';
        default: return 'Ingrese valor';
      }
    },
    iconoCampo() {
      switch (this.form.op) {
        case 1: return 'mdi-card-account-details';
        case 2: return 'mdi-account';
        case 3: return 'mdi-key';
        default: return 'mdi-text';
      }
    },
  },
  methods: {
    async consultar() {
      this.mensaje = '';
      this.respuesta = null;

      try {
        console.log('Enviando:', this.form);
        const { data } = await axios.post(`${API_BASE_URL}/consulta-rp`, {
            op: this.form.op,
            param: this.form.param
        });

        console.log('Respuesta:', data);

        if (
          !data.listapredio &&
          !data.listalcabalaplusva &&
          !data.listaDatosInscripcion &&
          !data.listacomparecientes
        ) {
          this.mensaje = 'No se encontraron resultados.';
        } else {
          this.respuesta = data;
        }
      } catch (error) {
        this.mensaje = 'Error al consultar el servicio.';
        console.error(error);
      }
    },
  },
};
</script>
