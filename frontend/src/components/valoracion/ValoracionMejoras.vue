<template>
  <v-app-bar color="#BDBDBD" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">Valoración Mejoras</v-app-bar-title>
  </v-app-bar>
  <v-container class="container fill-height">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Valoración Mejoras</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenu">Salir</v-btn>
        <v-btn class="btn_app mx-2 my-2" color="primary" @click="fetchValoracionMejoras">Refrescar</v-btn>
      </v-col>
      <v-col cols="12" md="10">
        <v-card class="pa-4 neutral-card">
          <v-data-table
            :headers="headers"
            :items="valoracionMejoras"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Valoración Mejoras</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                  hide-details
                  class="white-text-field"
                ></v-text-field>
              </v-toolbar>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'ValoracionMejoras',
  data() {
    return {
      search: '',
      headers: [
        { title: 'ID Mejoras', value: 'id_mejoras' },
        { title: 'ID Predio', value: 'id_predio' },
        { title: 'Clave Catastral', value: 'clave_catastral' },
        { title: 'Tipo Zona', value: 'tipo_zona' },
        { title: 'ID Obra', value: 'id_obra' },
        { title: 'Obra', value: 'obra' },
        { title: 'Valor Unitario', value: 'valor_unitario' },
        { title: 'Cantidad', value: 'cantidad' },
        { title: 'ID Estado', value: 'id_estado' },
        { title: 'Estado', value: 'estado' },
        { title: 'Factor Estado', value: 'factor_estado' },
        { title: 'Valor', value: 'valor' },
        { title: 'Año Val', value: 'anio_val' },
        { title: 'Fecha Proceso', value: 'fecha_proceso' },
        { title: 'Usuario', value: 'usuario' },
      ],
      valoracionMejoras: [],
    };
  },
  methods: {
    async fetchValoracionMejoras() {
      try {
        const response = await axios.get(`${API_BASE_URL}/valoracion_mejoras_cal`);
        this.valoracionMejoras = response.data;
      } catch (error) {
        console.error('Error fetching valoracion mejoras:', error);
      }
    },
    navigateToMenu() {
      this.$router.push('/menu-predial');
    },
  },
  created() {
    this.fetchValoracionMejoras();
  },
};
</script>

<style scoped>
.titulo-pantalla {
  font-size: 2rem;
  color: #333333;
}

.container {
  background-color: #E8E8E8;
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