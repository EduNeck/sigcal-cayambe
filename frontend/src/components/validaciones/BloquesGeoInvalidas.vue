<template>
  <v-container class="container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Listado de Bloques con Geometrías Inválidas</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">        
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenuValidaciones">Salir</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="bloques"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Bloques con Geometrías Inválidas</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar Bloque"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small @click="editItem(item)">mdi-pencil</v-icon>
          </template>
          <template v-slot:[`item.id`]="{ item }">
            {{ item.id }}
          </template>
          <template v-slot:[`item.cod_cat`]="{ item }">
            {{ item.cod_cat }}
          </template>
          <template v-slot:[`item.num_bloq`]="{ item }">
            {{ item.num_bloq }}
          </template>
          <template v-slot:[`item.tipo_piso`]="{ item }">
            {{ item.tipo_piso }}
          </template>
          <template v-slot:[`item.num_piso`]="{ item }">
            {{ item.num_piso }}
          </template>
          <template v-slot:[`item.cod_uni`]="{ item }">
            {{ item.cod_uni }}
          </template>
          <template v-slot:[`item.tipo_zona`]="{ item }">
            {{ item.tipo_zona }}
          </template>
          <template v-slot:[`item.area`]="{ item }">
            {{ item.area }}
          </template>
          <template v-slot:[`item.valido`]="{ item }">
            {{ item.valido }}
          </template>
          <template v-slot:[`item.poligono`]="{ item }">
            {{ item.poligono }}
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
  name: 'BloquesGeoInvalidas',
  data() {
    return {
      search: '',
      headers: [        
        { title: 'ID', value: 'id' },
        { title: 'Código Catastral', value: 'cod_cat' },
        { title: 'Número de Bloque', value: 'num_bloq' },
        { title: 'Tipo de Piso', value: 'tipo_piso' },
        { title: 'Número de Piso', value: 'num_piso' },
        { title: 'Código de Unidad', value: 'cod_uni' },
        { title: 'Tipo de Zona', value: 'tipo_zona' },
        { title: 'Área', value: 'area' },
        { title: 'Válido', value: 'valido' },
        { title: 'Polígono', value: 'poligono' },
      ],
      bloques: []
    };
  },
  async created() {
    await this.cargaBloques();
  },
  methods: {
    async cargaBloques() {
      try {
        const response = await axios.get(`${API_BASE_URL}/vcontrol_bloques_geometrias_invalidas?tipo_zona=1`);
        this.bloques = response.data;
        console.log('Listado de bloques:', this.bloques);
      } catch (error) {
        console.error('Error al obtener el listado de bloques:', error);
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