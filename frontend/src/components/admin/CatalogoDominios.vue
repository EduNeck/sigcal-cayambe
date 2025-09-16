<template>
  <!-- Overlay de carga catálogo dominios -->
  <v-overlay
    :model-value="loadingCatalogo"
    class="d-flex align-center justify-center"
    persistent
    style="z-index: 2000"
  >
    <v-card class="pa-4 text-center" color="#f5f5f5">
      <v-progress-circular indeterminate color="primary" size="50" class="mb-2" />
      <div aria-live="polite">Cargando catálogo, por favor espere...</div>
    </v-card>
  </v-overlay>
  <v-container class="container">
    <v-row justify="center" align="center">
      <v-col cols="12" class="pb-0">
        <v-card elevation="2" class="header-card rounded-lg mb-4">
          <v-row align="center" no-gutters>
            <v-col cols="12" md="6" class="text-center text-md-start px-4 py-3">
              <h2 class="titulo-pantalla mb-0">Catálogo de Dominios</h2>
            </v-col>
            <v-col cols="12" md="6" class="d-flex justify-end px-4 py-3 gap-2">
              <v-btn color="secondary" variant="elevated" prepend-icon="mdi-refresh" @click="recargarTodo" class="action-button">
                Recargar
              </v-btn>
              <v-btn color="primary" variant="elevated" prepend-icon="mdi-logout" @click="salirMenuAdmin" class="action-button">
                Salir
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="filteredDominios"
          :search="search"
          item-key="id"
          class="elevation-3 rounded-lg table-dominios"
          :items-per-page="15"
          :footer-props="{
            'items-per-page-options': [10, 15, 25, 50, -1],
            'items-per-page-text': 'Registros por página',
          }"
        >
          <!-- Barra superior -->
          <template v-slot:top>
            <v-toolbar flat class="bg-primary rounded-t-lg">
              <v-toolbar-title class="white--text font-weight-bold">Dominios</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                prepend-icon="mdi-magnify"
                label="Buscar en el catálogo"
                single-line
                hide-details
                clearable
                variant="solo"
                density="comfortable"
                bg-color="white"
                class="search-field mx-2"
                style="max-width: 320px;"
              ></v-text-field>
            </v-toolbar>
          </template>

          <!-- ID Tipo Atributo editable -->
          <template v-slot:item.id_tipo_atributo="{ item }">
            <v-select
              v-model="item.id_tipo_atributo"
              :items="tipoAtributos"
              item-title="descripcion"
              item-value="id"
              density="comfortable"
              variant="outlined"
              hide-details
              class="field-select"
              style="min-width: 260px; max-width: 320px;"
              @change="item.tipo_atributo_desc = getDescripcionTipoAtributo(item.id_tipo_atributo)"
            />
          </template>

          <!-- Descripción Tipo Atributo -->
          <template v-slot:item.tipo_atributo_desc="{ item }">
            <div class="text-body-1 font-weight-medium">{{ item.tipo_atributo_desc }}</div>
          </template>

          <!-- Código -->
          <template v-slot:item.codigo="{ item }">
            <v-text-field 
              v-model="item.codigo" 
              variant="outlined" 
              hide-details 
              density="comfortable" 
              class="field-input"
              style="max-width: 80px;" 
            />
          </template>

          <!-- Descripción -->
          <template v-slot:item.descripcion="{ item }">
            <v-textarea
              v-model="item.descripcion"
              variant="outlined"
              hide-details
              auto-grow
              rows="1"
              class="field-textarea"
              style="min-width: 200px"
            />
          </template>

          <!-- Factor -->
          <template v-slot:item.factor="{ item }">
            <v-text-field
              v-model="item.factor"
              variant="outlined"
              hide-details
              density="comfortable"
              type="number"
              class="field-input"
              style="max-width: 80px;"
            />
          </template>

          <!-- Factor Alt -->
          <template v-slot:item.factor_alt="{ item }">
            <v-text-field
              v-model="item.factor_alt"
              variant="outlined"
              hide-details
              density="comfortable"
              type="number"
              class="field-input"
              style="max-width: 80px;"
            />
          </template>

          <!-- Tipo Exclusivo -->
          <template v-slot:item.tipo_exclusivo="{ item }">
            <v-text-field 
              v-model="item.tipo_exclusivo" 
              variant="outlined" 
              hide-details 
              density="comfortable" 
              class="field-input"
              style="max-width: 80px;" 
            />
          </template>

          <!-- Acciones -->
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-center">
              <v-btn 
                icon 
                color="primary" 
                variant="elevated" 
                class="action-icon mr-2" 
                @click="guardarFila(item)" 
                title="Guardar"
              >
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
              <!-- Botón eliminar oculto -->
              <v-btn 
                v-if="false" 
                icon 
                color="error" 
                variant="elevated" 
                class="action-icon" 
                @click="confirmarEliminar(item)" 
                title="Eliminar"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
        
        <!-- Diálogo de confirmación para eliminar -->
        <v-dialog v-model="dialogEliminar" max-width="400">
          <v-card>
            <v-card-title class="text-h5">Confirmar eliminación</v-card-title>
            <v-card-text>
              ¿Está seguro que desea eliminar este dominio?
              <v-alert type="warning" dense class="mt-2">
                Esta acción no se puede deshacer y podría afectar a otros registros que usen este dominio.
              </v-alert>
              <div class="mt-2">
                <strong>Tipo:</strong> {{ dominioAEliminar?.tipo_atributo_desc || 'N/A' }}<br>
                <strong>Código:</strong> {{ dominioAEliminar?.codigo || 'N/A' }}<br>
                <strong>Descripción:</strong> {{ dominioAEliminar?.descripcion || 'N/A' }}
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="text" @click="dialogEliminar = false">Cancelar</v-btn>
              <v-btn color="error" @click="eliminarDominio">Eliminar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        
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
      search: '',
      loadingCatalogo: false,
      dialogEliminar: false,
      dominioAEliminar: null,
      headers: [
        { title: 'Tipo Atributo', value: 'id_tipo_atributo', align: 'start' },
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
  computed: {
    filteredDominios() {
      if (!this.dominios) return [];
      if (!this.search) return this.dominios;
      const searchLower = this.search.toLowerCase();
      return this.dominios.filter(item =>
        Object.values(item).some(val =>
          String(val ?? '').toLowerCase().includes(searchLower)
        )
      );
    },
  },
  methods: {
    async cargarTiposAtributo() {
      try {
        this.loadingCatalogo = true;
        const response = await axios.get(`${API_BASE_URL}/tipo_atributo`);
        if (Array.isArray(response.data)) {
          this.tipoAtributos = response.data.map(item => ({
            id: item.id,
            descripcion: item.descripcion
          }));
        }
      } catch (error) {
        console.error('Error al cargar tipos de atributo:', error);
      } finally {
        this.loadingCatalogo = false;
      }
    },

    async cargarDominios() {
      try {
        this.loadingCatalogo = true;
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
      } finally {
        this.loadingCatalogo = false;
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
    },
    
    confirmarEliminar(item) {
      this.dominioAEliminar = item;
      this.dialogEliminar = true;
    },
    
    async eliminarDominio() {
      if (!this.dominioAEliminar || !this.dominioAEliminar.id) {
        this.snackbarText = 'Error: No se ha seleccionado un dominio para eliminar';
        this.snackbarColor = 'error';
        this.snackbar = true;
        this.dialogEliminar = false;
        return;
      }
      
      try {
        await axios.delete(`${API_BASE_URL}/elimina_catalogo_dominios/${this.dominioAEliminar.id}`);
        this.snackbarText = 'Dominio eliminado correctamente';
        this.snackbarColor = 'success';
        this.snackbar = true;
        this.dialogEliminar = false;
        
        // Recargar la lista de dominios
        await this.cargarDominios();
      } catch (error) {
        console.error('Error al eliminar el dominio:', error);
        
        let mensajeError = 'Error al eliminar el dominio';
        
        // Manejar mensajes específicos de error
        if (error.response && error.response.data) {
          if (error.response.data.error) {
            mensajeError = error.response.data.error;
          }
        }
        
        this.snackbarText = mensajeError;
        this.snackbarColor = 'error';
        this.snackbar = true;
      } finally {
        this.dialogEliminar = false;
      }
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

/* Nuevos estilos para el diseño mejorado */
.header-card {
  background-color: white;
  border-left: 5px solid #324b21;
}

.search-field {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.search-field:focus-within {
  box-shadow: 0 0 8px rgba(50, 75, 33, 0.3);
}

.field-input {
  border-radius: 6px;
  transition: all 0.2s ease;
}

.field-input:hover, .field-select:hover, .field-textarea:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.field-input:focus-within, .field-select:focus-within, .field-textarea:focus-within {
  border-color: #324b21;
  box-shadow: 0 2px 8px rgba(50, 75, 33, 0.2);
}

.field-textarea {
  border-radius: 6px;
}

.field-select {
  border-radius: 6px;
}

.action-button {
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: transform 0.2s ease;
}

.action-button:hover {
  transform: translateY(-2px);
}

.action-icon {
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-icon:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.table-dominios {
  border-radius: 8px;
  overflow: hidden;
}

.table-dominios :deep(.v-data-table__tr:hover) {
  background-color: #f8fcf5;
}
</style>
