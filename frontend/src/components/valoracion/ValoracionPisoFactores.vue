<template>
  <v-app-bar color="#A9A9A9" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">URBANO</v-app-bar-title>
  </v-app-bar>  
  <v-container class="container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Valoración Piso Factores</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenu">Salir</v-btn>
        <v-btn class="btn_app mx-2 my-2" color="primary" @click="fetchValoracionPiso">Refresh</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="valoracionPiso"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Valoración Piso Factores</v-toolbar-title>
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
  name: 'ValoracionPisoFactores',
  data() {
    return {
      search: '',
      headers: [
        { title: 'ID', value: 'id' },
        { title: 'Cod Cat', value: 'cod_cat' },
        { title: 'Clave Catastral', value: 'clave_catastral' },
        { title: 'ID Predio', value: 'id_predio' },
        { title: 'ID Bloque', value: 'id_bloque' },
        { title: 'Area', value: 'area' },
        { title: 'Cod Uni', value: 'cod_uni' },
        { title: 'Cod Bloq', value: 'cod_bloq' },
        { title: 'ID Tipo Piso', value: 'id_tipo_piso' },
        { title: 'Cod Piso', value: 'cod_piso' },
        { title: 'Año Construcción', value: 'anio_construccion' },
        { title: 'Año Remodelación', value: 'anio_remodelacion' },
        { title: 'Area Alfa', value: 'area_alfa' },
        { title: 'Condición', value: 'condicion' },
        { title: 'F Condición', value: 'f_condicion' },
        { title: 'Estado Conservación', value: 'estado_conservacion' },
        { title: 'F Estado Conservación', value: 'f_estado_conservacion' },
        { title: 'Condición Patrimonial', value: 'condicion_patrimonial' },
        { title: 'F Condición Patrimonial', value: 'f_condicion_patrimonial' },
        { title: 'Ocupación', value: 'ocupacion' },
        { title: 'F Ocupación', value: 'f_ocupacion' },
        { title: 'Instalaciones Especiales', value: 'instalaciones_especiales' },
        { title: 'F Instalaciones Especiales', value: 'f_instalaciones_especiales' },
        { title: 'Estructura', value: 'estructura' },
        { title: 'F Estructura', value: 'f_estructura' },
        { title: 'Paredes', value: 'paredes' },
        { title: 'F Paredes', value: 'f_paredes' },
        { title: 'Cubierta', value: 'cubierta' },
        { title: 'F Cubierta', value: 'f_cubierta' },
        { title: 'Acabados Vivienda', value: 'acabados_vivienda' },
        { title: 'F Acabados Vivienda', value: 'f_acabados_vivienda' },
        { title: 'Revestimiento Paredes', value: 'revestimiento_paredes' },
        { title: 'F Revestimiento Paredes', value: 'f_revestimiento_paredes' },
        { title: 'Revestimiento Cubierta', value: 'revestimiento_cubierta' },
        { title: 'F Revestimiento Cubierta', value: 'f_revestimiento_cubierta' },
        { title: 'Marco Ventanas', value: 'marco_ventanas' },
        { title: 'F Marco Ventanas', value: 'f_marco_ventanas' },
        { title: 'Vidrios', value: 'vidrios' },
        { title: 'F Vidrios', value: 'f_vidrios' },
        { title: 'Puertas', value: 'puertas' },
        { title: 'F Puertas', value: 'f_puertas' },
        { title: 'Permiso', value: 'permiso' },
        { title: 'Usuario', value: 'usuario' },
        { title: 'Año Val', value: 'anio_val' },
        { title: 'Fecha Proceso', value: 'fecha_proceso' },
        { title: 'Tipo Zona', value: 'tipo_zona' },
        { title: 'Acabado', value: 'acabado' },
        { title: 'Cod Acabado', value: 'cod_acabado' },
        { title: 'Factor Acabado', value: 'factor_acabado' },
        { title: 'Estado Factor', value: 'estado_factor' },
        { title: 'Tot Pisos', value: 'tot_pisos' },
        { title: 'Tipo Prop', value: 'tipo_prop' },
        { title: 'De', value: 'de' },
        { title: 'Cod Tipología', value: 'cod_tipologia' },
        { title: 'Tipología', value: 'tipologia' },
        { title: 'Valor Unitario', value: 'valor_unitario' },
        { title: 'Vida Útil', value: 'vida_util' },
        { title: 'Residual', value: 'residual' },
        { title: 'D', value: 'd' },
        { title: 'FDP', value: 'fdp' },
        { title: 'Valor Piso Min', value: 'valor_piso_min' },
        { title: 'Valor Piso Uni', value: 'valor_piso_uni' },
        { title: 'Valor Piso', value: 'valor_piso' },
      ],
      valoracionPiso: [],
    };
  },
  methods: {
    async fetchValoracionPiso() {
      try {
        const response = await axios.get(`${API_BASE_URL}/valoracion_suelo_cal`);
        this.valoracionPiso = response.data;
      } catch (error) {
        console.error('Error fetching valoracion piso:', error);
      }
    },
    navigateToMenu() {
      this.$router.push('/menu-predial');
    },
  },
  created() {
    this.fetchValoracionPiso();
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