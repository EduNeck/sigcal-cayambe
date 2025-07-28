<template>
  <v-container :class="['container', tipoClaseContainer]">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Listado de Vías</h2>
      </v-col>

      <v-row>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="vias"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Vías</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-col cols="auto">
                  <v-btn :class="['btn_app', tipoClaseButton]" @click="recargarDatos">Recargar Datos</v-btn>
                </v-col>
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
            <template v-slot:item="{ item }">
              <tr :class="{ 'selected-row': item.id_vias === selectedViaId }">
                <v-btn :class="['btn_app', tipoClaseButton]" icon @click="selectVia(item.id_vias)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <td>{{ item.id_vias }}</td>
                <td>{{ item.via_principal }}</td>
                <td>{{ item.via_secundaria }}</td>
                <td>{{ item.nombre_via }}</td>
                <td>{{ item.longitud }}</td>
                <td>{{ item.tipo_via }}</td>
                <td>{{ item.material_via }}</td>
                <td>{{ item.aceras_bordillos }}</td>
                <td>{{ item.num_inmueble }}</td>
                <td></td>
              </tr>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import { useViasEvents } from '@/composables/useViasEvents';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'TabListadoVias',
  setup() {
    const { onViasUpdated } = useViasEvents();
    return { onViasUpdated };
  },

  data() {
    return {
      search: '',
      vias: [],
      selectedViaId: null,    
      headers: [
        { title: 'Acción', value: 'action', sortable: false },
        { title: 'ID Vía', value: 'id_vias' },
        { title: 'Vía Principal', value: 'via_principal' },
        { title: 'Vía Secundaria', value: 'via_secundaria' },
        { title: 'Nombre de Vía', value: 'nombre_via' },
        { title: 'Longitud', value: 'longitud' },
        { title: 'Tipo de Vía', value: 'tipo_via' },
        { title: 'Aceras y Bordillos', value: 'aceras_bordillos' },
        { title: 'Material de Vía', value: 'material_via' },        
        { title: 'Número de Inmueble', value: 'num_inmueble' }
      ]
    };
  },

  computed: {
    ...mapGetters(['getIdPredio', 'getTipoPredio']),
    tipoClaseContainer() {
      return this.getTipoPredio === 1 ? 'urbano-container' : 'rural-container';
    },
    tipoClaseButton() {
      return this.getTipoPredio === 1 ? 'urbano-btn' : 'rural-btn';
    }
  },


  async mounted() {
    try {
      console.log('Componente montado');
      console.log('ID DEL PREDIO:', this.getIdPredio);
      await this.recuperaVias(this.getIdPredio);
      
      // 🛣️ Listener para reactividad de vías
      this.onViasUpdated(() => {
        console.log('🛣️ Evento de vías actualizado detectado, recargando listado...');
        this.recargarDatos();
      });
    } catch (error) {
      console.error('Error al montar el componente:', error);
    }
  },

  methods: {    
    ...mapActions(['updateIdVia']), 

    // Método para recargar los datos de la tabla
    async recargarDatos() {
      try {
        console.log('Recargando datos...');
        await this.recuperaVias(this.getIdPredio);
      } catch (error) {
        console.error('Error al recargar los datos:', error);
      }
    },

    // Método para obtener las vías de un predio
    async recuperaVias(idPredio) {
      console.log('Obteniendo vías del predio con ID:', idPredio);
        try {
            if (!idPredio || String(idPredio).trim() === '') {
                console.log('idPredio no está definido o está vacío');
                return;
            }            
            const response = await axios.get(`${API_BASE_URL}/vista_vias_by_idPredio/${idPredio}`);            
            this.vias = response.data;
            console.log('Vías obtenidas:', this.vias);
            console.log('JSON recuperado:', JSON.stringify(this.vias, null, 2));
        } catch (error) {
            console.error('Error al obtener el listado de vías:', error);        
        }
    },

    // Método para seleccionar el id de la vía
    selectVia(id_vias) {
      this.$store.dispatch('updateIdVia', id_vias);
      this.$emit('navigateToVias'); 
    },
  }
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

.v-data-table-header th {
  color: black !important;
}

.selected-row {
  background-color: #114358;
  color: white;
}

/* Botón general */
.btn_app {
  margin-bottom: 10px;
  color: #ffffff;
}

/* Dinámicos urbano/rural */
.urbano-container {
  background-color: #114358;
}
.rural-container {
  background-color: #668A4C;
}

.urbano-btn {
  background-color: #276E90;
}
.rural-btn {
  background-color: #4C7031;
}
</style>
