<template>
  <v-container class="container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Listado de Predios sin Foto</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">        
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenuValidaciones">Salir</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="predios"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Predios sin Foto</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar Predio"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small @click="editItem(item)">mdi-pencil</v-icon>
          </template>
          <template v-slot:[`item.clave_catastral`]="{ item }">
            {{ item.clave_catastral }}
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
  name: 'PrediosSinFoto',
  data() {
    return {
      search: '',
      headers: [        
        { title: 'Clave Catastral', value: 'clave_catastral' },
      ],
      predios: []
    };
  },
  async created() {
    await this.cargaPredios();
  },
  methods: {
    async cargaPredios() {
      try {
        const response = await axios.get(`${API_BASE_URL}/vcontrol_predios_sin_foto`);
        this.predios = response.data;
        console.log('Listado de predios:', this.predios);
      } catch (error) {
        console.error('Error al obtener el listado de predios:', error);
      }
    },
    navigateToMenuValidaciones() {
      this.$router.push('/menu-predial');
    },
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
</style>