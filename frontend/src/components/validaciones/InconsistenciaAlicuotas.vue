<template>
  <v-container class="container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Listado de Inconsistencias de Alícuotas</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">        
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenuValidaciones">Salir</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="inconsistencias"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Inconsistencias de Alícuotas</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar Inconsistencia"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small @click="editItem(item)">mdi-pencil</v-icon>
          </template>
          <template v-slot:[`item.clave`]="{ item }">
            {{ item.clave }}
          </template>
          <template v-slot:[`item.alicuota`]="{ item }">
            {{ item.alicuota }}
          </template>
          <template v-slot:[`item.id_tipo_predio`]="{ item }">
            {{ item.id_tipo_predio }}
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
  name: 'InconsistenciaAlicuotas',
  data() {
    return {
      search: '',
      headers: [        
        { title: 'Clave', value: 'clave' },
        { title: 'Alicuota', value: 'alicuota' },
        { title: 'ID Tipo Predio', value: 'id_tipo_predio' },
      ],
      inconsistencias: []
    };
  },
  async created() {
    await this.cargaInconsistencias();
  },
  methods: {
    async cargaInconsistencias() {
      try {
        const response = await axios.get(`${API_BASE_URL}/vcontrol_inconsistencia_alicuotas?id_tipo_predio=1`);
        this.inconsistencias = response.data;
        console.log('Listado de inconsistencias:', this.inconsistencias);
      } catch (error) {
        console.error('Error al obtener el listado de inconsistencias:', error);
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