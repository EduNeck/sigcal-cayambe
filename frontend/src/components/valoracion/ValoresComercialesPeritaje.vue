<template>
  <v-app-bar color="#A9A9A9" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">URBANO</v-app-bar-title>
  </v-app-bar>  
  <v-container class="container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Valores Comerciales Peritaje</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenu">Salir</v-btn>
        <v-btn class="btn_app mx-2 my-2" color="primary" @click="buscaValoresComerciales">Refresh</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="valoresComerciales"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Valores Comerciales Peritaje</v-toolbar-title>
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
  name: 'ValoresComercialesPeritaje',
  data() {
    return {
      search: '',
      headers: [
        { title: 'ID Comercial', value: 'id_comercial' },
        { title: 'Valor Suelo', value: 'valor_suelo' },
        { title: 'Valor Construcciones', value: 'valor_construcciones' },
        { title: 'Valor Adicionales', value: 'valor_adicionales' },
        { title: 'Valor Especiales', value: 'valor_especiales' },
        { title: 'Valor Total', value: 'valor_total' },
        { title: 'Fecha Registro', value: 'fecha_registro' },
        { title: 'Usuario', value: 'usuario' },
        { title: 'Observaciones', value: 'observaciones' },
        { title: 'Mandatorio', value: 'mandatorio' },
        { title: 'Tipo', value: 'tipo' },
        { title: 'ID Tenencia', value: 'id_tenencia' },
      ],
      valoresComerciales: [],
    };
  },
  methods: {
    async buscaValoresComerciales() {
      try {
        const response = await axios.get(`${API_BASE_URL}/valoresComercialesPeritaje`);
        this.valoresComerciales = response.data;
      } catch (error) {
        console.error('Error fetching valores comerciales peritaje:', error);
      }
    },
    navigateToMenu() {
      this.$router.push('/menu-predial');
    },
  },
  created() {
    this.buscaValoresComerciales();
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