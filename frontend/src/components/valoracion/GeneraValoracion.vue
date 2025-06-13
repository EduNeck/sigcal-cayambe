<template>
  <v-app-bar color="#BDBDBD" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">
      {{ getTipoPredio === 1 ? 'URBANO' : 'RURAL' }}
    </v-app-bar-title>
  </v-app-bar>

  <v-container class="container fill-height">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Generar Valoración</h2>
      </v-col>

      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2" append-icon="mdi-check" @click="generaValoracion">Valorar</v-btn>
        <v-btn class="btn_app mx-2" append-icon="mdi-close" @click="navigateToMenu">Salir</v-btn>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4 neutral-card">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="form.clave_catastral"
              label="Clave Catastral"
              :rules="[v => !!v || 'Clave Catastral es requerida']"
              required
              class="white-text-field"
            ></v-text-field>

            <v-text-field
              v-model="form.anio_emision"
              label="Año Emisión"
              :rules="[v => !!v || 'Año Emisión es requerido']"
              required
              class="white-text-field"
            ></v-text-field>

            <v-text-field
              v-model="tipoNombre"
              label="Tipo de Predio"
              disabled
              class="white-text-field"
            ></v-text-field>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alertas -->
    <v-snackbar v-model="snackbarErrorPush" :timeout="3000" color="error" rounded="pill">
      {{ snackbarError }}
    </v-snackbar>
    <v-snackbar v-model="snackbarOkPush" :timeout="3000" color="success" rounded="pill">
      {{ snackbarOk }}
    </v-snackbar>
    <v-snackbar v-model="snackbarNotaPush" :timeout="3000" color="info" rounded="pill">
      {{ snackbarNota }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'GeneraValoracion',
  data() {
    return {
      valid: false,
      form: {
        clave_catastral: '',
        anio_emision: '',
        var_tipo: '',
        usuario: 'SISTEMA'
      },
      snackbarErrorPush: false,
      snackbarError: '',
      snackbarOkPush: false,
      snackbarOk: '',
      snackbarNotaPush: false,
      snackbarNota: ''
    };
  },

  computed: {
    ...mapGetters(['getTipoPredio']),
    tipoNombre() {
      return this.getTipoPredio === 1 ? 'URBANO' : 'RURAL';
    }
  },

  mounted() {
    this.form.var_tipo = this.getTipoPredio;
  },

  methods: {
    async generaValoracion() {
      this.form.var_tipo = this.getTipoPredio;

      if (this.$refs.form.validate()) {
        const payload = {
          pr_anio: this.form.anio_emision,
          var_tipo: this.form.var_tipo,
          pr_clave: this.form.clave_catastral,
          var_usuario: this.form.usuario
        };
        try {
          const response = await axios.post(`${API_BASE_URL}/ejecuta_valoracion`, payload);
          this.snackbarOk = 'Valoración generada correctamente';
          this.snackbarOkPush = true;
        } catch (error) {
          this.snackbarError = 'Error al generar la valoración';
          this.snackbarErrorPush = true;
        }
      } else {
        this.snackbarNota = 'Formulario inválido';
        this.snackbarNotaPush = true;
      }
    },

    navigateToMenu() {
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
  background-color: #E8E8E8; /* Gris claro */
}

.btn_app {
  background-color: #8C8C8C; /* Gris medio */
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
