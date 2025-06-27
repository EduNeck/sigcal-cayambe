<template>
  <v-app-bar color="#F5F6FA" :elevation="2" class="d-flex justify-center app-bar-custom">
    <v-app-bar-title class="text-center text-app-bar">URBANO</v-app-bar-title>
  </v-app-bar>
  <v-container class="container-custom py-8">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Valoración Resultados</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenu">Salir</v-btn>
        <v-btn class="btn_app mx-2 my-2" color="primary" @click="fetchValoracionResultados">Refrescar</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="9">
        <v-card class="card-neutro px-2 py-4">
          <v-data-table
            :headers="headers"
            :items="valoracionResultados"
            :search="search"
            class="elevation-1 data-table-custom"
          >
            <template v-slot:top>
              <v-toolbar flat class="toolbar-custom">
                <v-toolbar-title class="toolbar-title">Valoración Resultados</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  single-line
                  hide-details
                  class="search-field"
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
  color: #114358;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.app-bar-custom {
  background: #F5F6FA !important;
  border-bottom: 1px solid #e0e0e0;
}
.text-app-bar {
  color: #114358 !important;
  font-weight: 700;
  letter-spacing: 2px;
}

.container-custom {
  min-height: 100vh;
  background: linear-gradient(135deg, #e3ecf7 0%, #f5f6fa 100%);
  padding-top: 32px;
}

.card-neutro {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px 0 rgba(44, 62, 80, 0.07);
  border: 1px solid #e0e0e0;
}

.btn_app {
  background-color: #276E90 !important;
  color: #ffffff !important;
  font-weight: 600;
  border-radius: 8px;
  min-width: 120px;
  font-size: 1rem;
  box-shadow: 0 2px 8px 0 rgba(39, 110, 144, 0.08);
  transition: background 0.2s;
}
.btn_app:hover {
  background-color: #114358 !important;
}

.data-table-custom {
  background: #fafbfc;
  border-radius: 12px;
}

.toolbar-custom {
  background: transparent;
  border-radius: 12px 12px 0 0;
  padding: 0 8px;
}
.toolbar-title {
  color: #276E90;
  font-weight: 700;
  font-size: 1.1rem;
}

.search-field {
  background: #fff;
  border-radius: 8px;
  min-width: 220px;
  max-width: 300px;
  margin-right: 8px;
}

.v-data-table {
  margin-top: 0;
}
</style>