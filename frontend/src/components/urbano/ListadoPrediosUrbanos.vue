<template>
  <v-container class="container">
    <!-- Overlay de carga -->
    <v-overlay
      :model-value="loading"
      class="d-flex align-center justify-center"
      persistent
      style="z-index: 1000"
    >
      <v-card class="pa-4 text-center" color="#F1ECE7">
        <v-progress-circular indeterminate color="primary" size="50" class="mb-2" />
        <div aria-live="polite">Cargando predios, por favor espere...</div>
      </v-card>
    </v-overlay>


    <!-- Contenido principal -->
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Listado de Predios</h2>
      </v-col>
      <v-col cols="12" class="d-flex justify-center flex-wrap">
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-plus" @click="navigateToFormFichaPredial">Nuevo</v-btn>
        <v-btn class="btn_app mx-2 my-2" append-icon="mdi-close" @click="navigateToMenuUrbano">Salir</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="filteredPredios"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Predios Urbanos</v-toolbar-title>
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
          <template v-for="header in headers.slice(1)" v-slot:[`item.${header.value}`]="{ item }">
            {{ item[header.value] || '' }}
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
  name: 'ListadoPrediosUrbanos',
  data() {
    return {
      search: '',
      predios: [],
      filtros: {},
      loading: false,
      headers: [
        { title: 'Acciones', value: 'actions', sortable: false },
        { title: 'ID Predio', value: 'id_predio' },
        { title: 'Clave Catastral', value: 'clave_catastral' },
        { title: 'Clave Catastral Anterior', value: 'clave_catastral_anterior' },
        { title: 'Tipo Predio', value: 'tipo_predio' },
        { title: 'Régimen Propiedad', value: 'regimen_propiedad' },
        { title: 'Parroquia', value: 'parroquia' },
        { title: 'Eje Principal', value: 'eje_principal' },
        { title: 'Eje Secundario', value: 'eje_secundario' },
        { title: 'Sector', value: 'sector' },
      ],
    };
  },
  async mounted() {
    try {
      console.log('Componente montado');
      await this.cargaPredios();
    } catch (error) {
      console.error('Error al montar el componente:', error);
    }
  },
  computed: {
    filteredPredios() {
      if (!this.predios) return [];
      return this.predios.filter(predio => {
        return Object.keys(this.filtros).every(key => {
          const val = String(predio[key] ?? '');
          const filtro = String(this.filtros[key] ?? '');
          return val.toLowerCase().includes(filtro.toLowerCase());
        });
      });
    },
  },
  methods: {
    async cargaPredios() {
      console.log('Cargando predios...');
      this.loading = true;
      console.log('loading (inicio):', this.loading);

      const {
        clave_catastral,
        clave_catastral_anterior,
        numero_documento,
        nombres,
        id_regimen_propiedad
      } = this.$route.query;

      const tipoPredioStore = this.$store.state.tipoPredio;
      const tipoPredioTexto = tipoPredioStore === 1 ? 'URBANO' : 'RURAL';

      try {
        const response = await axios.get(`${API_BASE_URL}/ficha_predio`, {
          params: {
            clave_catastral,
            clave_catastral_anterior,
            numero_documento,
            nombres,
            id_regimen_propiedad,
            tipo_predio: tipoPredioTexto
          }
        });

        this.predios = response.data;
        console.log('Listado de predios:', this.predios);
      } catch (error) {
        console.error('Error al obtener el listado de predios:', error);
      } finally {
        this.loading = false;
        console.log('loading (fin):', this.loading);
      }
    },

    editItem(item) {
      const idPredio = item.id_predio;
      this.$router.push({ path: '/ficha-predial', query: { id_predio: idPredio } });
    },

    aplicarFiltros(filtros) {
      this.filtros = filtros;
    },

    navigateToFormFichaPredial() {
      this.$router.push('/ficha-predial');
    },

    navigateToMenuUrbano() {
      this.$router.push('/menu-predial');
    },
  },
};
</script>

<style scoped>
.titulo-pantalla {
  font-size: 2rem;
  color: #000000;
}
.container {
  background-color: #F1ECE7;
}
.btn_app {
  background-color: #223770;
  color: #ffffff;
}

</style>
