<template>
  <v-app-bar color="#A9A9A9" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">RURAL</v-app-bar-title>
  </v-app-bar>
  <v-container class="container">
    <v-card class="mb-3 block-color fill-width">
      <v-card-title>Busqueda de Certificado Catastral</v-card-title>      
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="form.claveCatastral"
          label="Clave Catastral"
          required
          :rules="[rules.required]"
        ></v-text-field>

        <v-text-field
          v-model="form.anioProceso"
          label="Año Proceso"
          required
          :rules="[rules.required, rules.integer, rules.maxLength]"
          type="number"
        ></v-text-field>

        <v-card-actions>
          <v-btn color="primary" @click="buscarCertificado">Busqueda</v-btn>
          <v-btn color="secondary" @click="salir">Salir</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'BusquedaCertificadoCatastralRur',
  data() {
    return {
      valid: false,
      form: {
        claveCatastral: '',
        anioProceso: null,
      }, 

      rules: {
        required: (value) => !!value || 'Este campo es obligatorio.',
        integer: (value) => Number.isInteger(+value) || 'Debe ser un número entero.',
        maxLength: (value) => (value && value.toString().length <= 4) || 'Máximo 4 dígitos.',
      },
    };
  },
  
  methods: {
    buscarCertificado() {
      if (this.$refs.form.validate()) {
        this.$router.push({
          path: '/certificadoCatastralRur',
          query: {
            claveCatastral: this.form.claveCatastral,
            anioProceso: this.form.anioProceso,
          },
        });
      } else {
        alert('Por favor, complete todos los campos correctamente.');
      }
    },

    salir() {
      this.$router.push('/menu-rural');
    },
  },

  mounted() {
    if (process.env.NODE_ENV === 'development') {
      console.log('Refs disponibles:', this.$refs);
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #668A4C;
  border: 4; 
  padding: 50px 0 0; 
  margin: 0 auto; 
  max-width: 800px; 
}

.block-color {
  background-color: #F1ECE7;
  color: #324b21; 
}

.fill-width { 
  width: 100%;
}
</style>