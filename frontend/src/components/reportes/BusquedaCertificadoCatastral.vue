<template>
  <v-app-bar color="#BDBDBD" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">
      {{ getTipoPredio === 1 ? 'URBANO' : 'RURAL' }}
    </v-app-bar-title>
  </v-app-bar>

  <v-container class="container fill-height">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Buscar Certificado de Plusvalía</h2>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4 neutral-card">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="form.claveCatastral"
              label="Clave Catastral"
              required
              class="white-text-field"
              :rules="[rules.required]"
            ></v-text-field>

            <v-text-field
              v-model="form.anioProceso"
              label="Año Proceso"
              type="number"
              required
              class="white-text-field"
              :rules="[rules.required, rules.integer, rules.maxLength]"
            ></v-text-field>

            <v-text-field
              v-model="tipoNombre"
              label="Tipo de Predio"
              disabled
              class="white-text-field"
            ></v-text-field>

            <v-card-actions class="mt-4 d-flex justify-center flex-wrap">
              <v-btn class="btn_app mx-2" append-icon="mdi-magnify" @click="buscarCertificado">Buscar</v-btn>
              <v-btn class="btn_app mx-2" append-icon="mdi-close" @click="salir">Salir</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alertas -->
    <v-snackbar v-model="snackbarErrorPush" :timeout="3000" color="error" rounded="pill">
      {{ snackbarError }}
    </v-snackbar>
    <v-snackbar v-model="snackbarNotaPush" :timeout="3000" color="info" rounded="pill">
      {{ snackbarNota }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'BusquedaCertificadoPlusvalia',
  data() {
    return {
      valid: false,
      form: {
        claveCatastral: '',
        anioProceso: null,
      },
      snackbarErrorPush: false,
      snackbarError: '',
      snackbarNotaPush: false,
      snackbarNota: '',

      rules: {
        required: v => !!v || 'Este campo es obligatorio.',
        integer: v => Number.isInteger(+v) || 'Debe ser un número entero.',
        maxLength: v => (v && v.toString().length <= 4) || 'Máximo 4 dígitos.',
      }
    };
  },

  computed: {
    ...mapGetters(['getTipoPredio']),
    tipoNombre() {
      return this.getTipoPredio === 1 ? 'URBANO' : 'RURAL';
    }
  },

  methods: {
    buscarCertificado() {
      if (this.$refs.form.validate()) {
        console.log('✅ Enviando parámetros:', {
          clave_catastral: this.form.claveCatastral,
          anio_proceso: this.form.anioProceso,
          tipo_predio: this.getTipoPredio
        });

        this.$router.push({
          path: '/certificadoPlusvalia',
          query: {
            clave_catastral: this.form.claveCatastral,
            anio_proceso: this.form.anioProceso,
            tipo_predio: this.getTipoPredio
          }
        });
      } else {
        this.snackbarNota = 'Por favor, complete todos los campos correctamente.';
        this.snackbarNotaPush = true;
      }
    },

    salir() {
      this.$router.push('/menu-predial');
    }
  }
};
</script>

<style scoped>
.titulo-pantalla {
  font-size: 2rem;
  color: #333333;
}

.container {
  background-color: #E8E8E8;
  padding-top: 50px;
}

.btn_app {
  background-color: #8C8C8C;
  color: #FFFFFF;
}

.v-btn {
  margin-top: 20px;
}

.white-text-field .v-input__control {
  background-color: #FFFFFF !important;
}

.white-text-field .v-input__slot {
  background-color: #FFFFFF !important;
}

.neutral-card {
  background-color: #F7F6F2;
  border: 1px solid #D6D6D6;
}
</style>
