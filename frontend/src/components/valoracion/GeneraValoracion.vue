<template>
  <v-app-bar color="#A9A9A9" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">URBANO</v-app-bar-title>
  </v-app-bar>
  <v-container class="container fill-height">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Generar Valoración</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-check" @click="generaValoracion">Valorar</v-btn>
        <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-close" @click="navigateToMenu">Salir</v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
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
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <!-- Alerta -->
    <v-snackbar v-model="snackbarErrorPush" :timeout="3000" color="error" rounded="pill">
      {{ snackbarError }}
    </v-snackbar>
    <v-snackbar v-model="snackbarOkPush" :timeout="3000" color="success" rounded="pill">
      {{ snackbarOk }}
    </v-snackbar>       
    <v-snackbar v-model="snackbarNotaPush" :timeout="3000" color="success" rounded="pill">
      {{ snackbarNota }}
    </v-snackbar>       
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'GeneraValoracion',
  data() {
    return {
      valid: false,
      form: {
        clave_catastral: '',
        anio_emision: '',
        tipo: 1,
        usuario: 'SISTEMA'
      },
      snackbarErrorPush: false,
      snackbarError: '',      
      snackbarOkPush: false,
      snackbarOk: '',
      snackbarNotaPush: false,
      snackbarNota: '',      
    };
  },

  methods: {
    async generaValoracion() {
      console.log('Genera Valoración');
      if (this.$refs.form.validate()) {
        const payload = {
          pr_anio: this.form.anio_emision,
          var_tipo: this.form.tipo,
          pr_clave: this.form.clave_catastral,
          var_usuario: this.form.usuario
        };
        console.log('Datos enviados a la API:', JSON.stringify(payload, null, 2));
        try {
          const response = await axios.post(`${API_BASE_URL}/ejecuta_valoracion`, payload);
          console.log('Respuesta de la API:', response.data);
          this.snackbarOk = 'Valoración generada correctamente';
          this.snackbarOkPush = true;

        } catch (error) {
          console.error('Error al ejecutar la valoración:', error);
          this.snackbarError = 'Error al generar la valoración';
          this.snackbarErrorPush = true;
        }
      } else {
        console.log('Formulario inválido');
        this.snackbarNota = 'Formulario inválido';
        this.snackbarNotaPush = true;
      }
    },

    navigateToMenu() {
      this.$router.push('/menu-predial');
    },
  },
};
</script>

<style scoped>
.titulo-pantalla {
  font-size: 2rem;
  color: #ffffff;
}

.container {
  background-color: #114358;
}

.btn_app {
  background-color: #276E90;
  color: #ffffff;
}

.custom-text-color {
  color: #F1ECE7;
}

.v-btn {
  margin-top: 20px;
}

.white-text-field .v-input__control {
  background-color: #ffffff !important;
}

.white-text-field .v-input__slot {
  background-color: #ffffff !important;
}
</style>