<template>
  <v-app-bar color="#F5F6FA" :elevation="2" class="d-flex justify-center app-bar-custom">
    <v-app-bar-title class="text-center text-app-bar">GESTIÓN DE PROYECTOS</v-app-bar-title>
  </v-app-bar>

  <v-container class="container-custom py-8">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="card-neutro px-6 py-4">
          <v-row justify="center">
            <v-col cols="12" class="text-center">
              <h2 class="text-h5 font-weight-bold mb-4">Registro de Proyectos</h2>
            </v-col>

            <!-- Formulario -->
            <v-col cols="12" sm="10">
              <v-form ref="form" v-model="formValido" @submit.prevent="guardarProyecto">
                <v-select
                  v-model="proyecto.cem_id_tipo_proyecto"
                  :items="tiposProyecto"
                  item-title="descripcion"
                  item-value="cem_id_tipo_proyecto"
                  label="Tipo de Proyecto"
                  :rules="[v => !!v || 'El tipo de proyecto es requerido']"
                  class="input-field mb-4"
                  variant="outlined"
                  density="comfortable"
                ></v-select>

                <v-text-field
                  v-model="proyecto.nombre"
                  label="Nombre del Proyecto"
                  :rules="[v => !!v || 'El nombre es requerido']"
                  class="input-field mb-4"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>

                <v-textarea
                  v-model="proyecto.descripcion"
                  label="Descripción"
                  :rules="[v => !!v || 'La descripción es requerida']"
                  class="input-field mb-4"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                ></v-textarea>

                <v-text-field
                  v-model="proyecto.ubicacion"
                  label="Ubicación"
                  :rules="[v => !!v || 'La ubicación es requerida']"
                  class="input-field mb-4"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>

                <v-text-field
                  v-model="proyecto.responsable"
                  label="Responsable"
                  :rules="[v => !!v || 'El responsable es requerido']"
                  class="input-field mb-4"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>

                <v-row class="mt-4">
                  <v-col cols="12" class="d-flex justify-center gap-4">
                    <v-btn
                      class="btn-action"
                      :disabled="!formValido"
                      @click="guardarProyecto"
                      color="#276E90"
                      variant="elevated"
                    >
                      {{ modoEdicion ? 'Actualizar' : 'Crear' }}
                    </v-btn>
                    <v-btn
                      class="btn-action"
                      @click="limpiarFormulario"
                      color="grey-lighten-1"
                      variant="elevated"
                    >
                      Cancelar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>

            <!-- Tabla -->
            <v-col cols="12">
              <v-card class="mt-6 data-table-card">
                <v-data-table
                  :headers="headers"
                  :items="proyectos"
                  :search="busqueda"
                  class="elevation-1"
                >
                  <template v-slot:top>
                    <v-toolbar flat class="toolbar-custom">
                      <v-toolbar-title class="toolbar-title">Listado de Proyectos</v-toolbar-title>
                      <v-divider class="mx-4" inset vertical></v-divider>
                      <v-spacer></v-spacer>
                      <v-text-field
                        v-model="busqueda"
                        append-icon="mdi-magnify"
                        label="Buscar"
                        single-line
                        hide-details
                        class="search-field"
                        variant="outlined"
                        density="comfortable"
                      ></v-text-field>
                    </v-toolbar>
                  </template>

                  <template v-slot:item.acciones="{ item }">
                    <v-icon
                      size="small"
                      class="me-2"
                      @click="editarProyecto(item.raw)"
                      color="#276E90"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon
                      size="small"
                      @click="confirmarEliminacion(item.raw)"
                      color="error"
                    >
                      mdi-delete
                    </v-icon>
                  </template>

                  <template v-slot:item.tipo_proyecto="{ item }">
                    {{ getTipoProyectoDescripcion(item.raw.cem_id_tipo_proyecto) }}
                  </template>
                </v-data-table>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de confirmación -->
    <v-dialog v-model="dialogoEliminar" max-width="400">
      <v-card>
        <v-card-title class="text-h5 pa-4">
          Confirmar eliminación
        </v-card-title>
        <v-card-text>
          ¿Está seguro que desea eliminar este proyecto?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-lighten-1"
            variant="elevated"
            @click="dialogoEliminar = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="eliminarProyecto"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  name: 'Proyecto',
  data() {
    return {
      formValido: true,
      busqueda: '',
      modoEdicion: false,
      dialogoEliminar: false,
      proyectoAEliminar: null,
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },
      headers: [
        { title: 'ID', key: 'cem_id_proyecto', align: 'start', sortable: true },
        { title: 'Tipo', key: 'tipo_proyecto', align: 'start', sortable: true },
        { title: 'Nombre', key: 'nombre', align: 'start', sortable: true },
        { title: 'Descripción', key: 'descripcion', align: 'start', sortable: true },
        { title: 'Ubicación', key: 'ubicacion', align: 'start', sortable: true },
        { title: 'Responsable', key: 'responsable', align: 'start', sortable: true },
        { title: 'Acciones', key: 'acciones', sortable: false, align: 'center' }
      ],
      tiposProyecto: [],
      proyectos: [],
      proyecto: {
        cem_id_proyecto: null,
        cem_id_tipo_proyecto: null,
        nombre: '',
        descripcion: '',
        ubicacion: '',
        responsable: ''
      }
    };
  },
  methods: {
    async cargarTiposProyecto() {
      try {
        const response = await axios.get(`${API_BASE_URL}/cem-tipo-proyecto`);
        this.tiposProyecto = response.data;
      } catch (error) {
        this.mostrarSnackbar('Error al cargar los tipos de proyecto', 'error');
      }
    },

    async cargarProyectos() {
      try {
        const response = await axios.get(`${API_BASE_URL}/cem-proyectos`);
        this.proyectos = response.data;
      } catch (error) {
        this.mostrarSnackbar('Error al cargar los proyectos', 'error');
      }
    },

    async guardarProyecto() {
      if (!this.$refs.form.validate()) return;

      try {
        if (this.modoEdicion) {
          await axios.put(
            `${API_BASE_URL}/cem-proyectos/${this.proyecto.cem_id_proyecto}`,
            this.proyecto
          );
          this.mostrarSnackbar('Proyecto actualizado exitosamente');
        } else {
          await axios.post(`${API_BASE_URL}/cem-proyectos`, this.proyecto);
          this.mostrarSnackbar('Proyecto creado exitosamente');
        }
        
        this.limpiarFormulario();
        await this.cargarProyectos();
      } catch (error) {
        this.mostrarSnackbar(
          `Error al ${this.modoEdicion ? 'actualizar' : 'crear'} el proyecto`,
          'error'
        );
      }
    },

    editarProyecto(item) {
      this.proyecto = { ...item };
      this.modoEdicion = true;
    },

    confirmarEliminacion(item) {
      this.proyectoAEliminar = item;
      this.dialogoEliminar = true;
    },

    async eliminarProyecto() {
      try {
        await axios.delete(
          `${API_BASE_URL}/cem-proyectos/${this.proyectoAEliminar.cem_id_proyecto}`
        );
        this.mostrarSnackbar('Proyecto eliminado exitosamente');
        await this.cargarProyectos();
      } catch (error) {
        this.mostrarSnackbar('Error al eliminar el proyecto', 'error');
      }
      this.dialogoEliminar = false;
      this.proyectoAEliminar = null;
    },

    getTipoProyectoDescripcion(id) {
      const tipo = this.tiposProyecto.find(t => t.cem_id_tipo_proyecto === id);
      return tipo ? tipo.descripcion : 'No especificado';
    },

    limpiarFormulario() {
      this.proyecto = {
        cem_id_proyecto: null,
        cem_id_tipo_proyecto: null,
        nombre: '',
        descripcion: '',
        ubicacion: '',
        responsable: ''
      };
      this.modoEdicion = false;
      this.$refs.form.resetValidation();
    },

    mostrarSnackbar(mensaje, color = 'success') {
      this.snackbar.message = mensaje;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  },
  created() {
    this.cargarTiposProyecto();
    this.cargarProyectos();
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

.data-table-card {
  background: #fafbfc;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.toolbar-custom {
  background: transparent;
  border-radius: 12px 12px 0 0;
  padding: 0 8px;
}

.toolbar-title {
  color: #276E90;
  font-weight: 700;
  font-size: 1.1rem;
}

.search-field {
  max-width: 300px;
  margin-right: 16px;
}

.btn-action {
  min-width: 120px;
}

.input-field {
  border-radius: 8px;
}
</style>
