<template>
  <v-app-bar color="#A9A9A9" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">URBANO</v-app-bar-title>
  </v-app-bar>  
  <v-container class="container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Valoración Resultados</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenu">Salir</v-btn>
        <v-btn class="btn_app mx-2 my-2" color="primary" @click="fetchValoracionResultados">Refresh</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="valoracionResultados"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Valoración Resultados</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'ValoracionResultados',
  data() {
    return {
      search: '',
      headers: [
        { title: 'ID', value: 'id' },
        { title: 'ID Predio', value: 'id_predio' },
        { title: 'Clave Catastral', value: 'clave_catastral' },
        { title: 'Año Val', value: 'anio_val' },
        { title: 'Fecha Proceso', value: 'fecha_proceso' },
        { title: 'Procesador', value: 'procesador' },
        { title: 'Tipo Zona', value: 'tipo_zona' },
        { title: 'Area Gráfica', value: 'area_grafica' },
        { title: 'Valor Suelo', value: 'valor_suelo' },
        { title: 'Area Construida', value: 'area_construida' },
        { title: 'Valor Construcciones', value: 'valor_construcciones' },
        { title: 'Valor Adicionales', value: 'valor_adicionales' },
        { title: 'Valor Predio', value: 'valor_predio' },
        { title: 'Tipo Prop', value: 'tipo_prop' },
        { title: 'Alicuota', value: 'alicuota' },
      ],
      valoracionResultados: [],
    };
  },
  methods: {
    async fetchValoracionResultados() {
      try {
        const response = await axios.get(`${API_BASE_URL}/predio_resultado_urb`);
        this.valoracionResultados = response.data;
      } catch (error) {
        console.error('Error fetching valoracion resultados:', error);
      }
    },
    navigateToMenu() {
      this.$router.push('/menu-predial');
    },
  },
  created() {
    this.fetchValoracionResultados();
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

.v-data-table {
  margin-top: 20px;
}
</style>