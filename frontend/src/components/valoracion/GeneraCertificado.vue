<template>
  <v-app-bar color="#A9A9A9" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">URBANO</v-app-bar-title>
  </v-app-bar>  
  <v-container class="container fill-height">
      <v-row justify="center" align="center">
          <v-col cols="12" class="text-center">
              <h2 class="titulo-pantalla">Generar Valoración</h2>
          </v-col>
          <v-col cols="12" class="d-flex justify-center flex-wrap">
              <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-check" @click="generaCertificado">Generar</v-btn>
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
                      ></v-text-field>  
                      <v-text-field
                          v-model="form.anio"
                          label="Año"
                          :rules="[v => !!v || 'Año es requerido']"
                          required
                          type="number"
                      ></v-text-field> 
                  </v-form>
              </v-card>                    
          </v-col>
      </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'GeneraCertificado',
  data() {
    return {
      valid: false,
      form: {
        tipo: 'URBANO',
        clave_catastral: '',
        año: '',
        usuario: 'SISTEMA'
      },
      codigo: '' 
    };
  },
  methods: {
    generaCodigo() {
      // Generar un código secuencial único basado en la fecha y hora actual
      console.log('Generando código...');
      const now = new Date();
      return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}${now.getMilliseconds().toString().padStart(3, '0')}`;
    },

    async generaCertificado() {
      console.log('Generando certificado catastral...');
      this.codigo = this.generaCodigo(); 
      console.log('Código:', this.codigo);
      try {
        const response = await axios.put(`${API_BASE_URL}/inserta-certificado-catastral`, {
          tipo: 1,
          anio: this.form.anio,
          clave: this.form.clave_catastral,
          usuario: 'SISTEMA',
          codigo: this.codigo 
        });
        console.log('Certificado insertado:', response.data);
        this.$router.push('/certificado-catastral');
      } catch (error) {
        console.error('Error al insertar el certificado catastral:', error);
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