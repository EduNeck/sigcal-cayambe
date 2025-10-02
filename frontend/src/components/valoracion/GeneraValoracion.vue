<template>
  <v-app-bar color="#BDBDBD" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">
      {{ getTipoPredio === 1 ? 'URBANO' : 'RURAL' }}
    </v-app-bar-title>
  </v-app-bar>

  <v-container class="container fill-height">
    <!-- Overlay de carga durante la valoración -->
    <v-overlay
      :model-value="loading"
      class="d-flex align-center justify-center"
      persistent
    >
      <v-card class="pa-4 text-center loading-card" max-width="400">
        <v-progress-circular indeterminate color="primary" size="64" width="7" class="mb-3"></v-progress-circular>
        <h3 class="text-h6 mb-2">{{ loadingMessage }}</h3>
        <p class="text-body-2 text-medium-emphasis">
          Este proceso puede tomar unos momentos. Por favor espere...
        </p>
      </v-card>
    </v-overlay>

    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Generar Valoración</h2>
      </v-col>

      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn 
          class="btn_app mx-2" 
          append-icon="mdi-check" 
          @click="generaValoracion"
          :loading="loading"
          :disabled="loading"
        >
          Valorar
        </v-btn>
        <v-btn 
          class="btn_app mx-2" 
          append-icon="mdi-close" 
          @click="navigateToMenu"
          :disabled="loading"
        >
          Salir
        </v-btn>
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
              :disabled="loading"
            ></v-text-field>

            <v-text-field
              v-model="form.anio_emision"
              label="Año Emisión"
              :rules="[v => !!v || 'Año Emisión es requerido']"
              required
              class="white-text-field"
              :disabled="loading"
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
      loading: false,
      loadingMessage: 'Generando valoración...',
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
    // Obtener parámetros de URL si existen
    const { clave_catastral } = this.$route.query;
    if (clave_catastral) {
      this.form.clave_catastral = clave_catastral;
    }
    
    // Establecer año actual como valor predeterminado
    const currentYear = new Date().getFullYear();
    this.form.anio_emision = currentYear.toString();
    
    this.form.var_tipo = this.getTipoPredio;
  },

  methods: {
    async generaValoracion() {
      this.form.var_tipo = this.getTipoPredio;

      if (this.$refs.form.validate()) {
        this.loading = true;
        this.loadingMessage = `Generando valoración para clave ${this.form.clave_catastral}...`;
        
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
          
          // Evento para notificar a componentes padre
          this.$emit('valoracion-completada', {
            clave: this.form.clave_catastral,
            anio: this.form.anio_emision,
            success: true
          });
        } catch (error) {
          console.error('Error al generar valoración:', error);
          this.snackbarError = error.response?.data?.mensaje || 'Error al generar la valoración';
          this.snackbarErrorPush = true;
          
          this.$emit('valoracion-completada', {
            clave: this.form.clave_catastral,
            anio: this.form.anio_emision,
            success: false,
            error: error.message
          });
        } finally {
          this.loading = false;
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

.loading-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
