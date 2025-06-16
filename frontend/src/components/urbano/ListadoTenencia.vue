<template>
  <v-container :class="['container', tipoClaseContainer]">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Listado de Tenencias</h2>
      </v-col>

      <v-row>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="tenencias"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Tenencias</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-col cols="auto">
                  <v-btn :class="tipoClaseButton" @click="recargarDatos">Recargar Datos</v-btn>
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

            <!-- Renderizar manualmente las filas -->
            <template v-slot:item="{ item }">
              <tr :class="['selected-row', tipoClaseRow]" @click="selectTenencia(item.id_tenencia)">
                <td>
                  <v-btn color="#F1ECE7" icon @click="selectTenencia(item.id_tenencia)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </td>
                <td>{{ item.id_tenencia }}</td>
                <td>{{ item.nombres }}</td>
                <td>{{ item.numero_documento }}</td>
                <td>{{ item.presenta_escritura ? 'Sí' : 'No' }}</td>
                <td>{{ item.forma_propiedad }}</td>
                <td>{{ item.tipo_persona }}</td>
                <td>{{ item.porcentaje_participacion }}%</td>
                <td>{{ item.regimen_propiedad }}</td>
                <td>{{ item.representante }}</td>
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
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'TabListadoTenencia',

  data() {
    return {
      search: '',
      tenencias: [],
      selectedTenenciaId: null,
      headers: [
        { title: 'Acción', value: 'action', sortable: false }, // Acción para el botón de editar
        { title: 'Id', value: 'id_tenecia' },
        { title: 'Nombres', value: 'nombre' },
        { title: 'Número de Documento', value: 'numero_documento' },
        { title: 'Presenta Escritura', value: 'presenta_escritura' },
        { title: 'Forma de Propiedad', value: 'forma_propiedad' },
        { title: 'Tipo de Persona', value: 'tipo_persona' },
        { title: 'Porcentaje de Participación', value: 'porcentaje_participación' },
        { title: 'Régimen de Propiedad', value: 'regimen_propiedad' },
        { title: 'Representante', value: 'representante' },
      ],
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
    tipoClaseRow() {
      return this.getTipoPredio === 1 ? 'urbano-row' : 'rural-row';
    },
  },


  async mounted() {
    try {      
      console.log('ID DEL PREDIO:', this.getIdPredio);
      await this.recuperaTenecia(this.getIdPredio);
    } catch (error) {
      console.error('Error al montar el componente:', error);
    }
  },

  methods: {
    ...mapActions(['updateIdTenencia']),

    // Método para recargar los datos de la tabla
    async recargarDatos() {
      try {
        console.log('Recargando datos...');
        await this.recuperaTenecia(this.getIdPredio);
      } catch (error) {
        console.error('Error al recargar los datos:', error);
      }
    },

    // Método para obtener las tenencias de un predio
    async recuperaTenecia(idPredio) {
      console.log('Recuperando tenencias...');
      try {
        if (!idPredio) {
          console.log('idPredio no está definido, no es una cadena de texto o está vacío');
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/tenencia_by_predio/${idPredio}`);
        this.tenencias = response.data;
      } catch (error) {
        console.error('Error al obtener el listado de tenencias:', error);
      }
    },

    selectTenencia(id_tenencia) {
      this.$store.dispatch('updateIdTenencia', id_tenencia);
      this.$emit('navigateToTenencia');
    },
  },
};
</script>

<style scoped>

.titulo-pantalla{
  color: #F1ECE7;
}

.urbano-container {
  background-color: #114358;
}
.rural-container {
  background-color: #668A4C;
}

.urbano-btn {
  background-color: #276E90;
  color: #ffffff;
}
.rural-btn {
  background-color: #4C7031;
  color: #ffffff;
}

.urbano-row {
  background-color: #276E90;
  color: #ffffff;
}
.rural-row {
  background-color: #4C7031;
  color: #ffffff;
}

.selected-row {
  font-weight: bold;
}

</style>