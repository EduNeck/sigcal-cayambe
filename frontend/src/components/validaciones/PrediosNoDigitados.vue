<template>
  <v-container class="container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Listado de Predios No Digitados</h2>
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
              <v-toolbar-title>Predios No Digitados</v-toolbar-title>
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
          <template v-slot:[`item.clave_vinculo`]="{ item }">
            {{ item.clave_vinculo }}
          </template>
          <template v-slot:[`item.cod_par`]="{ item }">
            {{ item.cod_par }}
          </template>
          <template v-slot:[`item.cod_zon`]="{ item }">
            {{ item.cod_zon }}
          </template>
          <template v-slot:[`item.cod_sec`]="{ item }">
            {{ item.cod_sec }}
          </template>
          <template v-slot:[`item.cod_man`]="{ item }">
            {{ item.cod_man }}
          </template>
          <template v-slot:[`item.cod_lote`]="{ item }">
            {{ item.cod_lote }}
          </template>
          <template v-slot:[`item.cod_bloq`]="{ item }">
            {{ item.cod_bloq }}
          </template>
          <template v-slot:[`item.cod_pis`]="{ item }">
            {{ item.cod_pis }}
          </template>
          <template v-slot:[`item.cod_uni`]="{ item }">
            {{ item.cod_uni }}
          </template>
          <template v-slot:[`item.tipo_zona`]="{ item }">
            {{ item.tipo_zona }}
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
  name: 'PrediosNoDigitados',
  data() {
    return {
      search: '',
      headers: [        
        { title: 'Clave Vinculo', value: 'clave_vinculo' },
        { title: 'Código Parroquia', value: 'cod_par' },
        { title: 'Código Zona', value: 'cod_zon' },
        { title: 'Código Sector', value: 'cod_sec' },
        { title: 'Código Manzana', value: 'cod_man' },
        { title: 'Código Lote', value: 'cod_lote' },
        { title: 'Código Bloque', value: 'cod_bloq' },
        { title: 'Código Piso', value: 'cod_pis' },
        { title: 'Código Unidad', value: 'cod_uni' },
        { title: 'Tipo Zona', value: 'tipo_zona' },
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
        const response = await axios.get(`${API_BASE_URL}/vcontrol_predios_no_digitados?tipo_zona=1`);
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