<template>
  <v-container class="container">
    <v-row justify="center" align="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Catálogo de Dominios</h2>
      </v-col>
      <v-spacer></v-spacer>
      <v-btn color="white" class="text-primary" @click="recargarTodo">
        <v-icon left>mdi-refresh</v-icon>Recargar
      </v-btn>
      <v-btn color="white" class="text-primary" @click="salirMenuAdmin">
        <v-icon left>mdi-logout</v-icon>Salir
      </v-btn>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="dominios"
          item-key="id"
          class="elevation-2 rounded-lg"
          dense
        >
          <!-- Barra superior -->
          <template v-slot:top>
            <v-toolbar flat class="bg-primary rounded-t-lg">
              <v-toolbar-title class="white--text">Dominios</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template>

          <!-- ID Tipo Atributo editable -->
          <template v-slot:item.id_tipo_atributo="{ item }">
            <v-select
              v-model="item.id_tipo_atributo"
              :items="tipoAtributos"
              item-title="descripcion"
              item-value="id"
              density="compact"
              variant="underlined"
              hide-details
              style="min-width: 260px; max-width: 320px;"
              @change="item.tipo_atributo_desc = getDescripcionTipoAtributo(item.id_tipo_atributo)"
            />
          </template>

          <!-- Descripción Tipo Atributo -->
          <template v-slot:item.tipo_atributo_desc="{ item }">
            <span>{{ item.tipo_atributo_desc }}</span>
          </template>

          <!-- Código -->
          <template v-slot:item.codigo="{ item }">
            <v-text-field v-model="item.codigo" variant="underlined" hide-details density="compact" style="max-width: 70px;" />
          </template>

          <!-- Descripción -->
          <template v-slot:item.descripcion="{ item }">
            <v-textarea
              v-model="item.descripcion"
              variant="outlined"
              hide-details
              auto-grow
              rows="1"
              class="text-md"
              style="min-width: 200px"
            />
          </template>

          <!-- Factor -->
          <template v-slot:item.factor="{ item }">
            <v-text-field
              v-model="item.factor"
              variant="underlined"
              hide-details
              density="compact"
              type="number"
              class="text-sm"
              style="max-width: 70px;"
            />
          </template>

          <!-- Factor Alt -->
          <template v-slot:item.factor_alt="{ item }">
            <v-text-field
              v-model="item.factor_alt"
              variant="underlined"
              hide-details
              density="compact"
              type="number"
              class="text-sm"
              style="max-width: 70px;"
            />
          </template>

          <!-- Tipo Exclusivo -->
          <template v-slot:item.tipo_exclusivo="{ item }">
            <v-text-field v-model="item.tipo_exclusivo" variant="underlined" hide-details density="compact" style="max-width: 70px;" />
          </template>

          <!-- Acciones -->
          <template v-slot:item.actions="{ item }">
            <v-btn icon color="primary" @click="guardarFila(item)">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" top right>
          {{ snackbarText }}
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'CatalogoDominios',
  data() {
    return {
      dominios: [],
      tipoAtributos: [],
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      headers: [
        { title: 'ID Tipo Atributo', value: 'id_tipo_atributo', align: 'start' },
        { title: 'Descripción Tipo Atributo', value: 'tipo_atributo_desc', align: 'start' },
        { title: 'Código', value: 'codigo' },
        { title: 'Descripción', value: 'descripcion' },
        { title: 'Factor', value: 'factor' },
        { title: 'Factor Alt.', value: 'factor_alt' },
        { title: 'Tipo Exclusivo', value: 'tipo_exclusivo' },
        { title: 'Acciones', value: 'actions', sortable: false, align: 'center' }
      ],
    };
  },
  methods: {
    async cargarTiposAtributo() {
      try {
        const response = await axios.get(`${API_BASE_URL}/tipo_atributo`);
        if (Array.isArray(response.data)) {
          this.tipoAtributos = response.data.map(item => ({
            id: item.id,
            descripcion: item.descripcion
          }));
        }
      } catch (error) {
        console.error('Error al cargar tipos de atributo:', error);
      }
    },

    async cargarDominios() {
      try {
        const response = await axios.get(`${API_BASE_URL}/catalogo_dominios`);
        let data = [];

        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data && typeof response.data === 'object') {
          data = [response.data];
        }

        this.dominios = data.map(item => ({
          ...item,
          tipo_atributo_desc: this.getDescripcionTipoAtributo(item.id_tipo_atributo)
        }));
      } catch (error) {
        console.error('Error al cargar dominios:', error);
      }
    },

    getDescripcionTipoAtributo(id) {
      const tipo = this.tipoAtributos.find(t => t.id === id);
      return tipo ? tipo.descripcion : '';
    },

    async guardarFila(item) {
      try {
        await axios.put(`${API_BASE_URL}/actualiza_catalogo_dominios/${item.id}`, {
          id_tipo_atributo: item.id_tipo_atributo,
          codigo: item.codigo,
          descripcion: item.descripcion,
          factor: item.factor,
          factor_alt: item.factor_alt,
          tipo_exclusivo: item.tipo_exclusivo
        });
        this.snackbarText = 'Dominio actualizado correctamente';
        this.snackbarColor = 'success';
        this.snackbar = true;
        this.$emit('dominio-guardado');
        await this.cargarDominios();
      } catch (error) {
        this.snackbarText = 'Error al actualizar el dominio';
        this.snackbarColor = 'error';
        this.snackbar = true;
        console.error('Error al actualizar el dominio:', error);
      }
    },

    async recargarTodo() {
      await this.cargarTiposAtributo();
      await this.cargarDominios();
    },
    salirMenuAdmin() {
      this.$router.push('/menu-admin');
    }
  },
  async mounted() {
    await this.recargarTodo();
  }
};
</script>

<style scoped>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-top: 20px;
}

.titulo-pantalla {
  font-weight: bold;
  font-size: 28px;
  color: #324b21;
}

.v-data-table {
  background: white;
}

.v-toolbar {
  background-color: #324b21;
}

.v-toolbar-title {
  font-weight: bold;
}
</style>
