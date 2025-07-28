<template>
  <v-container :class="['container', tipoClaseContainer]">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Listado de Bloques</h2>
      </v-col>

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
                <v-toolbar-title>Bloques</v-toolbar-title>
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
              <tr :class="[{ 'selected-row': item.id_bloques === selectedBloqueId }, tipoClaseBlock]">
                <v-btn :class="['btn_app', tipoClaseButton]" icon @click="selectBloque(item.id_bloques)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <td>{{ item.id_bloques }}</td>
                <td>{{ item.cod_uni }}</td>
                <td>{{ item.cod_bloq }}</td>
                <td>{{ item.cod_piso }}</td>
                <td>{{ item.tipo_piso }}</td>
                <td>{{ item.condicion_fisica }}</td>
                <td>{{ item.estado_conservacion }}</td>
                <td>{{ item.ocupacion }}</td>
                <td>{{ item.anio_construccion }}</td>
                <td>{{ item.area_construida }}</td>
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
import { useBloquesEvents } from '@/composables/useBloquesEvents';
import API_BASE_URL from '@/config/apiConfig';


export default {
  name: 'TabListadoBloques',
  setup() {
    const { onBloquesUpdated } = useBloquesEvents();
    return { onBloquesUpdated };
  },
  data() {
    return {
      search: '',
      bloques: [],
      selectedBloqueId: null,
      headers: [
        { title: 'Acción', value: 'action', sortable: false },
        { title: 'ID Bloque', value: 'id_bloques' },
        { title: 'Código Unidad', value: 'cod_uni' },
        { title: 'Código Bloque', value: 'cod_bloq' },
        { title: 'Código Piso', value: 'cod_piso' },
        { title: 'Tipo de Piso', value: 'id_tipo_piso' },
        { title: 'Condición Física', value: 'id_condicion_fisica' },
        { title: 'Estado de Conservación', value: 'id_estado_conservacion' },        
        { title: 'Ocupación', value: 'id_ocupacion' },
        { title: 'Año de Construcción', value: 'anio_construccion' },        
        { title: 'Área Construida', value: 'area_construida' }
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
    },
    tipoClaseBlock() {
      return this.getTipoPredio === 1 ? 'urbano-block' : 'rural-block';
    }
  },


  async mounted() {
    try {
      console.log('Componente montado');
      if (this.getIdPredio) {
        console.log('ID DEL PREDIO:', this.getIdPredio);
        await this.recuperaBloques(this.getIdPredio);
      } else {
        console.log('No hay ID de predio disponible');
      }
      
      // 🏗️ Listener para reactividad de bloques
      this.onBloquesUpdated(() => {
        console.log('🏗️ Evento de bloques actualizado detectado, recargando listado...');
        this.recargarDatos();
      });
    } catch (error) {
      console.error('Error al montar el componente:', error);
    }
  },
  methods: {

    ...mapActions(['updateIdBloque']), 

    // Método para recargar los datos de la tabla
    async recargarDatos() {
      try {
        console.log('Recargando datos...');
        if (this.getIdPredio) {
          await this.recuperaBloques(this.getIdPredio);
        } else {
          console.log('No hay ID de predio disponible');
        }
      } catch (error) {
        console.error('Error al recargar los datos:', error);
      }
    },

    // Método para obtener los bloques de un predio
    async recuperaBloques(idPredio) {
      console.log('recuperaBloques ejecutado con idPredio:', idPredio);
      try {
        if (idPredio === undefined || idPredio === null || idPredio === '') {
          console.log('idPredio no está definido o está vacío');
          return;
        }
        console.log('Obteniendo bloques...');
        const response = await axios.get(`${API_BASE_URL}/vista_bloques_by_idPredio/${idPredio}`);
        if (response.data.length === 0) {
            console.log('No se encontraron bloques para el ID de predio proporcionado');
        }
        this.bloques = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Error al obtener el listado de bloques:', error);
        this.bloques = []; 
      }
    },

    selectBloque(id_bloques) {
      this.$store.dispatch('updateIdBloque', id_bloques);
      this.$emit('navigateToBloques'); 
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

.urbano-container {
  background-color: #114358;
}
.rural-container {
  background-color: #668A4C;
}

.btn_app {
  margin-bottom: 10px;
}
.urbano-btn {
  background-color: #276E90;
  color: #ffffff;
}
.rural-btn {
  background-color: #4C7031;
  color: #ffffff;
}

.urbano-block {
  background-color: #F1ECE7;
  color: #114358;
}
.rural-block {
  background-color: #F1ECE7;
  color: #4C7031;
}

.selected-row {
  background-color: #114358;
  color: white;
}

.v-data-table-header th {
  color: black !important;
}
</style>

