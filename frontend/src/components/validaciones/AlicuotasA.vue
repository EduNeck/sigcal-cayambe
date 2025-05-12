<template>
  <v-container class="container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Listado de Alicuotas A</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">        
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenuValidaciones">Salir</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="alicuotas"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Alicuotas A</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar Alicuota"
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
  name: 'AlicuotasA',
  data() {
    return {
      search: '',
      headers: [        
        { title: 'Clave', value: 'clave' },
        { title: 'Alicuota', value: 'alicuota' },
        { title: 'ID Tipo Predio', value: 'id_tipo_predio' },
      ],
      alicuotas: []
    };
  },
  async created() {
    await this.cargaAlicuotas();
  },
  methods: {
    async cargaAlicuotas() {
      try {
        const response = await axios.get(`${API_BASE_URL}/vcontrol_alicuotas_a?id_tipo_predio=1`);
        this.alicuotas = response.data;
        console.log('Listado de alicuotas:', this.alicuotas);
      } catch (error) {
        console.error('Error al obtener el listado de alicuotas:', error);
      }
    },
    navigateToFormAlicuotasA() {
      
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