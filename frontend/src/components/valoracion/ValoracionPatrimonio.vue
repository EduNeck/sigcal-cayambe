<template>
  <v-app-bar color="#BDBDBD" :elevation="1" class="app-bar-custom">
    <v-app-bar-title class="app-bar-title-custom">Valoración Patrimonio</v-app-bar-title>
  </v-app-bar>

  <v-container class="container fill-height">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Valoración Patrimonio</h2>
      </v-col>

      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenu">Salir</v-btn>
        <v-btn class="btn_app mx-2 my-2" color="primary" @click="generaValoracion">Refrescar</v-btn>
      </v-col>

      <v-col cols="12" md="10" lg="9">
        <v-card class="pa-4 neutral-card table-wrapper" style="position:relative;">
          <v-overlay :value="loading" absolute>
            <v-progress-circular indeterminate color="primary" size="64" />
          </v-overlay>
          <v-data-table
            :headers="headers"
            :items="valoracionPatrimonio"
            :search="search"
            item-value="id_predio"
            show-expand
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat class="d-flex flex-wrap justify-center align-center">
                <v-toolbar-title class="toolbar-title text-center mr-4">Valoración Patrimonial</v-toolbar-title>
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

            <!-- Slots personalizados con formato -->
            <template v-slot:item.area_suelo_porcentual="{ item }">
              {{ formatValue(item.area_suelo_porcentual, 'area_suelo_porcentual') }}
            </template>
            <template v-slot:item.avaluo_predio_porcentual="{ item }">
              {{ formatValue(item.avaluo_predio_porcentual, 'avaluo_predio_porcentual') }}
            </template>
            <template v-slot:item.valor_suelo_porcentual="{ item }">
              {{ formatValue(item.valor_suelo_porcentual, 'valor_suelo_porcentual') }}
            </template>
            <template v-slot:item.valor_construcciones_porcentual="{ item }">
              {{ formatValue(item.valor_construcciones_porcentual, 'valor_construcciones_porcentual') }}
            </template>
            <template v-slot:item.valor_instalaciones_porcentual="{ item }">
              {{ formatValue(item.valor_instalaciones_porcentual, 'valor_instalaciones_porcentual') }}
            </template>

            <!-- Detalle expandido -->
            <template v-slot:expanded-row="{ item }">
              <td :colspan="headers.length">
                <v-card flat class="pa-3">
                  <v-row>
                    <v-col cols="12" sm="6" v-for="(value, key) in item" :key="key">
                      <strong>{{ formatLabel(key) }}:</strong> {{ formatValue(value, key) }}
                    </v-col>
                  </v-row>
                </v-card>
              </td>
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
  name: 'ValoracionPatrimonio',
  data() {
    return {
      search: '',
      valoracionPatrimonio: [],
      loading: false,
      headers: [
        { title: 'Clave Catastral', value: 'clave_catastral' },
        { title: 'Propietario', value: 'propietario' },
        { title: 'Parroquia', value: 'parroquia' },
        { title: 'PH', value: 'ph' },
        { title: 'Área Suelo', value: 'area_suelo_porcentual' },
        { title: 'Avalúo', value: 'avaluo_predio_porcentual' },
        { title: 'Valor Suelo', value: 'valor_suelo_porcentual' },
        { title: 'Valor Construcción', value: 'valor_construcciones_porcentual' },
        { title: 'Valor Instalación', value: 'valor_instalaciones_porcentual' },
        { title: 'Año', value: 'anio_proceso' },
        { title: 'Expandir', value: 'data-table-expand' },
      ],
    };
  },
  methods: {
    async generaValoracion() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_BASE_URL}/valores_patrimonio_urb`);
        this.valoracionPatrimonio = response.data;
      } catch (error) {
        console.error('Error fetching valoracion patrimonio:', error);
      } finally {
        this.loading = false;
      }
    },
    navigateToMenu() {
      this.$router.push('/menu-predial');
    },
    formatLabel(key) {
      return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    },
    formatValue(value, key = '') {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        if (key.toLowerCase().includes('valor') || key.toLowerCase().includes('avaluo')) {
          return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
          }).format(num);
        }
        return num.toFixed(2);
      }
      return value;
    },
  },
  created() {
    this.generaValoracion();
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

.app-bar-custom {
  background-color: #BDBDBD;
}

.app-bar-title-custom {
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333333;
  letter-spacing: 1px;
}

.btn_app {
  background-color: #8C8C8C;
  color: #FFFFFF;
  font-weight: 600;
  border-radius: 8px;
  min-width: 120px;
  font-size: 1rem;
}

.v-btn {
  margin-top: 20px;
}

.white-text-field {
  background-color: #FFFFFF !important;
  border-radius: 8px;
  min-width: 250px;
  max-width: 300px;
}

.neutral-card {
  background-color: #F7F6F2;
  border: 1px solid #D6D6D6;
  margin: 0 auto;
}

.toolbar-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.table-wrapper {
  overflow-x: auto;
  max-width: 100%;
}

.v-data-table {
  min-width: 1000px;
}
</style>
