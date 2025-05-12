<template>
  <v-container class="container">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Listado de Ciudadanos</h2>
      </v-col>

      <v-row>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="ciudadanos"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Ciudadanos</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-col cols="auto">
                  <v-btn class="custom-text-color"  @click="recargarDatos">Recargar Datos</v-btn>
                  <v-btn class="custom-text-color"  @click="salir">Salir</v-btn>

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
              <tr :class="{ 'selected-row': item.id_ciudadano === selectedCiudadanoId }">
                <td>
                  <v-btn color="#F1ECE7" icon @click="editItem(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </td>
                <td>{{ item.id_ciudadano }}</td>
                <td>{{ item.nombres }}</td>
                <td>{{ item.numero_documento }}</td>
                <td>{{ item.tipo_persona }}</td>
                <td>{{ item.personeria }}</td>
                <td>{{ item.tipo_docuemnto }}</td>
                <td>{{ item.fecha_registro }}</td>
                <td>{{ item.telefono }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.estado_civil }}</td>
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
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'ListadoCiudadano',

  data() {
    return {
      search: '',
      ciudadanos: [],
      selectedCiudadanoId: null,
      headers: [
        { title: 'Acción', value: 'action', sortable: false }, // Acción para el botón de editar
        { title: 'Id', value: 'id_ciudadano' },
        { title: 'Nombres', value: 'nombres' },
        { title: 'Número de Documento', value: 'numero_documento' },
        { title: 'Tipo de Persona', value: 'tipo_persona' },
        { title: 'Personería', value: 'personeria' },
        { title: 'Tipo de Documento', value: 'tipo_docuemnto' },
        { title: 'Fecha de Registro', value: 'fecha_registro' },
        { title: 'Teléfono', value: 'telefono' },
        { title: 'Email', value: 'email' },
        { title: 'Estado Civil', value: 'estado_civil' },
      ],
    };
  },

  async mounted() {
    try {
      console.log('Componente montado');
      await this.cargaDatos();
    } catch (error) {
      console.error('Error al montar el componente:', error);
    }
  },

  methods: {
    // Método para recargar los datos de la tabla
    async recargarDatos() {
      try {
        console.log('Recargando datos...');
        await this.cargaDatos();
      } catch (error) {
        console.error('Error al recargar los datos:', error);
      }
    },

    // Método para obtener los ciudadanos
    async cargaDatos() {
      console.log('Cargando datos...');
      const { nombres, numero_documento, tipo_persona, tipo_docuemnto } = this.$route.query;
      try {
        const response = await axios.get(`${API_BASE_URL}/recupera_ciudadano`, {
          params: {
            nombres,
            numero_documento,
            tipo_persona,
            tipo_docuemnto
          }
        });
        this.ciudadanos = response.data;
        console.log('Datos obtenidos:', this.ciudadanos);
      } catch (error) {
        console.error('Error al obtener el listado de ciudadanos:', error);
      }
    },

    editItem(item) {
      const idCiudadano = item.id_ciudadano;
      this.$router.push({ path: '/ciudadano', query: { id_ciudadano: idCiudadano } });
    },

    salir() {
      this.$router.push('/busqueda-ciudadanos');
    }
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

.v-data-table-header th {
  color: black !important;
}

.v-btn {
  margin-bottom: 10px;
  
}

.selected-row {
  background-color: #F1ECE7;
  color: white;
}

.custom-text-color {
  background-color: #223770;
  color: #ffffff;
}
</style>