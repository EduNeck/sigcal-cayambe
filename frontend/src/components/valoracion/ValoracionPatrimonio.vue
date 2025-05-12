<template>
  <v-app-bar color="#A9A9A9" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">URBANO</v-app-bar-title>
  </v-app-bar>  
  <v-container class="container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Valoración Patrimonio</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenu">Salir</v-btn>
        <v-btn class="btn_app mx-2 my-2" color="primary" @click="fetchValoracionPatrimonio">Refresh</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="valoracionPatrimonio"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Valoración Patrimonio</v-toolbar-title>
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
  name: 'ValoracionPatrimonio',
  data() {
    return {
      search: '',
      headers: [
        { title: 'Tipo Predio', value: 'tipo_predio' },
        { title: 'PH', value: 'ph' },
        { title: 'Clave Catastral', value: 'clave_catastral' },
        { title: 'Clave Anterior', value: 'clave_anterior' },
        { title: 'Parroquia', value: 'parroquia' },
        { title: 'Número Documento', value: 'numero_documento' },
        { title: 'Alicuota', value: 'alicuota' },
        { title: 'Porcentaje Participación', value: 'porcentaje_participacion' },
        { title: 'Área Suelo Porcentual', value: 'area_suelo_porcentual' },
        { title: 'Área Construcciones Porcentual', value: 'area_construcciones_porcentual' },
        { title: 'Valor Suelo Porcentual', value: 'valor_suelo_porcentual' },
        { title: 'Valor Construcciones Porcentual', value: 'valor_construcciones_porcentual' },
        { title: 'Valor Instalaciones Porcentual', value: 'valor_instalaciones_porcentual' },
        { title: 'Valor Adicionales Porcentual', value: 'valor_adicionales_porcentual' },
        { title: 'Avalúo Predio Porcentual', value: 'avaluo_predio_porcentual' },
        { title: 'Año Proceso', value: 'anio_proceso' },
        { title: 'ID Tenencia Propiedad', value: 'id_tenencia_propiedad' },
        { title: 'ID Predio', value: 'id_predio' },
        { title: 'Propietario', value: 'propietario' },
        { title: 'Fecha Proceso', value: 'fecha_proceso' },
      ],
      valoracionPatrimonio: [],
    };
  },
  methods: {
    async fetchValoracionPatrimonio() {
      try {
        const response = await axios.get(`${API_BASE_URL}/valores_patrimonio_urb`);
        this.valoracionPatrimonio = response.data;
      } catch (error) {
        console.error('Error fetching valoracion patrimonio:', error);
      }
    },
    navigateToMenu() {
      this.$router.push('/menu-predial');
    },
  },
  created() {
    this.fetchValoracionPatrimonio();
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