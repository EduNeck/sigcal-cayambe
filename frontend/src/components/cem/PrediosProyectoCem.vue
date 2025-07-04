<template>
  <v-app-bar color="#F5F6FA" :elevation="2" class="d-flex justify-center app-bar-custom">
    <v-app-bar-title class="text-center text-app-bar">PREDIOS POR PROYECTO</v-app-bar-title>
  </v-app-bar>

  <v-container class="container-custom py-8">
    <v-row justify="center">
      <v-col cols="12" md="12" lg="12">
        <v-card class="card-neutro px-6 py-4">
          <v-row>
            <!-- Filtros -->
            <v-col cols="12" class="mb-4">
              <v-row align="center" justify="space-between">
                <v-col cols="12" md="4">
                  <v-select
                    v-model="filtroProyecto"
                    :items="proyectos"
                    item-title="proyecto"
                    item-value="id_proyec"
                    label="Filtrar por Proyecto"
                    variant="outlined"
                    density="comfortable"
                    clearable
                    @update:model-value="filtrarPredios"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="busqueda"
                    append-icon="mdi-magnify"
                    label="Buscar"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    class="search-field"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>

            <!-- Tabla -->
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="prediosFiltrados"
                :search="busqueda"
                :loading="loading"
                loading-text="Cargando datos... Por favor espere"
                no-data-text="No hay predios disponibles"
                class="elevation-1"
              >
                <!-- Slots corregidos: -->
                <template v-slot:item.valor_cem="{ item }">
                  {{ formatearMoneda(item.valor_cem) }}
                </template>
                <template v-slot:item.fecha="{ item }">
                  {{ formatearFecha(item.fecha) }}
                </template>
                <template v-slot:item.clave_vinculo="{ item }">
                  <span class="font-weight-medium">{{ item.clave_vinculo }}</span>
                </template>
              </v-data-table>
            </v-col>

            <!-- Botón Volver -->
            <v-col cols="12" class="d-flex justify-end mt-4">
              <v-btn
                color="error"
                variant="elevated"
                @click="volverAlMenu"
                append-icon="mdi-exit-to-app"
              >
                Salir
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar para mensajes -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'PrediosProyectoCem',
  data() {
    return {
      loading: true,
      busqueda: '',
      filtroProyecto: null,
      predios: [],
      proyectos: [],
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },
      headers: [
        { title: 'Clave Catastral', key: 'clave_vinculo', align: 'start', sortable: true },
        { title: 'ID Proyecto', key: 'id_proyec', align: 'start', sortable: true },
        { title: 'Proyecto', key: 'proyecto', align: 'start', sortable: true },
        { title: 'Año Inicio', key: 'cem_anio_inicio_obligaciones', align: 'center', sortable: true },
        { title: 'Año Fin', key: 'cem_anio_finalizacion_obligaciones', align: 'center', sortable: true },
        { title: 'Alcance', key: 'alcance', align: 'start', sortable: true },
        { title: 'Valor CEM', key: 'valor_cem', align: 'end', sortable: true },
        { title: 'Fecha', key: 'fecha', align: 'center', sortable: true }
      ]
    };
  },
  computed: {
    prediosFiltrados() {
      if (!this.filtroProyecto) return this.predios;
      return this.predios.filter(predio => predio.id_proyec === this.filtroProyecto);
    }
  },
  methods: {
    async cargarPredios() {
      try {
        const response = await axios.get(`${API_BASE_URL}/cem-predios-proyecto`);
        this.predios = response.data;

        // Extraer proyectos únicos para el filtro
        const proyectosUnicos = [...new Map(
          response.data.map(item => [item.id_proyec, {
            id_proyec: item.id_proyec,
            proyecto: item.proyecto
          }])
        ).values()];
        this.proyectos = proyectosUnicos;
      } catch (error) {
        console.error('Error al cargar predios:', error);
        this.mostrarSnackbar('Error al cargar los predios', 'error');
      } finally {
        this.loading = false;
      }
    },

    filtrarPredios() {
      // La filtración la maneja el computed prediosFiltrados
    },

    formatearMoneda(valor) {
      return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(valor || 0);
    },

    formatearFecha(fecha) {
      if (!fecha) return 'N/A';
      return new Date(fecha).toLocaleDateString('es-EC');
    },

    mostrarSnackbar(mensaje, color = 'success') {
      this.snackbar.message = mensaje;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },

    volverAlMenu() {
      this.$router.push('/menu-predial');
    }
  },
  async created() {
    await this.cargarPredios();
  }
};
</script>

<style scoped>
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

.search-field {
  max-width: 300px;
}
</style>
