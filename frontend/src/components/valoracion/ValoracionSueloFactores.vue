<template>
  <v-app-bar color="#F5F6FA" :elevation="2" class="d-flex justify-center app-bar-custom">
    <v-app-bar-title class="text-center text-app-bar">URBANO</v-app-bar-title>
  </v-app-bar>
  <v-container class="container-custom py-8">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Valoración Suelo Factores</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenu">Salir</v-btn>
        <v-btn class="btn_app mx-2 my-2" color="primary" @click="fetchValoracionSuelo">Refrescar</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="9">
        <v-card class="card-neutro px-2 py-4">
          <v-data-table
            :headers="headers"
            :items="valoracionSuelo"
            :search="search"
            class="elevation-1 data-table-custom"
          >
            <template v-slot:top>
              <v-toolbar flat class="toolbar-custom">
                <v-toolbar-title class="toolbar-title">Valoración Suelo Factores</v-toolbar-title>
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