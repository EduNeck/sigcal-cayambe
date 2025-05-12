<template>
  <v-app-bar color="#A9A9A9" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">URBANO</v-app-bar-title>
  </v-app-bar>  
  <v-container class="container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Valoración Suelo Factores</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenu">Salir</v-btn>
        <v-btn class="btn_app mx-2 my-2" color="primary" @click="fetchValoracionSuelo">Refresh</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="valoracionSuelo"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Valoración Suelo Factores</v-toolbar-title>
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
  name: 'ValoracionSueloFactores',
  data() {
    return {
      search: '',
      headers: [
        { title: 'ID', value: 'id' },
        { title: 'Cod Cat', value: 'cod_cat' },
        { title: 'Area Dibujo', value: 'area_dibujo' },
        { title: 'Area Parcial', value: 'area_parcial' },
        { title: 'Predio Zona', value: 'predio_zona' },
        { title: 'Cod Zon', value: 'cod_zon' },
        { title: 'Nombre', value: 'nombre' },
        { title: 'Año', value: 'anio' },
        { title: 'Valor 1', value: 'valor1' },
        { title: 'Valor 2', value: 'valor2' },
        { title: 'Valor 3', value: 'valor3' },
        { title: 'Valor 4', value: 'valor4' },
        { title: 'Valor 5', value: 'valor5' },
        { title: 'Area Tipo', value: 'areatipo' },
        { title: 'Frente Tipo', value: 'frentetipo' },
        { title: 'Fondo Tipo', value: 'fondotipo' },
        { title: 'Tipo Zona', value: 'tipo_zona' },
        { title: 'Fecha Proceso', value: 'fecha_proceso' },
        { title: 'Usuario', value: 'usuario' },
        { title: 'Area Gráfica', value: 'area_grafica' },
        { title: 'Frente Relativo', value: 'frente_relativo' },
        { title: 'Fondo Relativo', value: 'fondo_relativo' },
        { title: 'ID Alfa', value: 'id_alfa' },
        { title: 'FTAM', value: 'ftam' },
        { title: 'Forma', value: 'forma' },
        { title: 'FForma', value: 'fforma' },
        { title: 'Localización', value: 'localizacion' },
        { title: 'FLoc', value: 'floc' },
        { title: 'FFrente', value: 'ffrente' },
        { title: 'FFondo', value: 'ffondo' },
        { title: 'Acceso', value: 'acceso' },
        { title: 'FAcceso', value: 'facceso' },
        { title: 'Agua', value: 'agua' },
        { title: 'FAgua', value: 'fagua' },
        { title: 'Alcantarillado', value: 'alcantarillado' },
        { title: 'FAlcantarillado', value: 'falcantarillado' },
        { title: 'Energía', value: 'energia' },
        { title: 'FEnergía', value: 'fenergia' },
        { title: 'Teléfono', value: 'telefono' },
        { title: 'FTeléfono', value: 'ftelefono' },
        { title: 'Celular', value: 'celular' },
        { title: 'FCelular', value: 'fcelular' },
        { title: 'Internet', value: 'internet' },
        { title: 'FInternet', value: 'finternet' },
        { title: 'Uso', value: 'uso' },
        { title: 'FUso', value: 'fuso' },
        { title: 'FCorrección', value: 'fcorreccion' },
        { title: 'Valor Parcial', value: 'valor_parcial' },
        { title: 'Número Frentes', value: 'numero_frentes' },
        { title: 'Riego', value: 'riego' },
        { title: 'FRiego', value: 'friego' },
        { title: 'Ocupación', value: 'ocupacion' },
        { title: 'Topografía', value: 'topografia' },
        { title: 'FOcupación', value: 'focupacion' },
        { title: 'FTopografía', value: 'ftopografia' },
        { title: 'Recolección', value: 'recoleccion' },
        { title: 'FRecolección', value: 'frecoleccion' },
        { title: 'ID Cobertura', value: 'id_cobertura' },
        { title: 'FTitularidad', value: 'ftitularidad' },
        { title: 'Año Cultivo', value: 'anio_cultivo' },
        { title: 'FTecnificación', value: 'ftecnificacion' },
        { title: 'FCultProducción', value: 'fcultproduccion' },
      ],
      valoracionSuelo: [],
    };
  },
  methods: {
    async fetchValoracionSuelo() {
      try {
        const response = await axios.get(`${API_BASE_URL}/valoracion_suelo_cal`);
        this.valoracionSuelo = response.data;
      } catch (error) {
        console.error('Error fetching valoracion suelo:', error);
      }
    },
    navigateToMenu() {
      this.$router.push('/menu-predial');
    },
  },
  created() {
    this.fetchValoracionSuelo();
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