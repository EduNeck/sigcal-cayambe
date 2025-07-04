<template>
  <v-app-bar color="#BDBDBD" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">ALCANCE DE OBRA</v-app-bar-title>
  </v-app-bar>

  <v-container class="container fill-height">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="titulo-pantalla">Gestión de Alcance de Obra</h2>
      </v-col>
      
      <v-col cols="12" md="8">
        <v-card class="pa-4 neutral-card">
          <v-row justify="center">

            <!-- Formulario -->
            <v-col cols="12" sm="8">
              <v-form ref="form" v-model="formValido" @submit.prevent="guardarAlcance">
                <v-text-field
                  v-model="alcance.descripcion"
                  label="Descripción"
                  :rules="[v => !!v || 'La descripción es requerida']"
                  class="white-text-field"
                  required
                ></v-text-field>

                <v-row class="mt-4">
                  <v-col cols="12" class="d-flex justify-center gap-4">
                    <v-btn
                      class="btn_app"
                      :disabled="!formValido"
                      @click="guardarAlcance"
                      append-icon="mdi-check"
                    >
                      {{ modoEdicion ? 'Actualizar' : 'Crear' }}
                    </v-btn>
                    <v-btn
                      class="btn_app"
                      @click="limpiarFormulario"
                      append-icon="mdi-close"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      class="btn_app"
                      @click="volverAlMenu"
                      append-icon="mdi-exit-to-app"
                    >
                      Salir
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
                  :items="alcances"
                  :search="busqueda"
                  class="elevation-1"
                >
                  <template v-slot:top>
                    <v-toolbar flat class="toolbar-custom">
                      <v-toolbar-title class="toolbar-title">Alcances de Obra</v-toolbar-title>
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
                      @click="editarAlcance(item.raw)"
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
          ¿Está seguro que desea eliminar este alcance de obra?
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
            @click="eliminarAlcance"
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
  name: 'AlcanceObraCem',
  data() {
    return {
      formValido: true,
      busqueda: '',
      modoEdicion: false,
      dialogoEliminar: false,
      alcanceAEliminar: null,
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },
      headers: [
        { title: 'ID', key: 'cem_alcance_id', align: 'start', sortable: true },
        { title: 'Descripción', key: 'descripcion', align: 'start', sortable: true },
        { title: 'Acciones', key: 'acciones', sortable: false, align: 'center' }
      ],
      alcances: [],
      alcance: {
        cem_alcance_id: null,
        descripcion: ''
      }
    };
  },
  methods: {
    async cargarAlcances() {
      try {
        console.log('📫 Solicitando lista de alcances de obra...');
        const response = await axios.get(`${API_BASE_URL}/cem-obtieneAlcances`);
        console.log('✅ Alcances cargados:', response.data);
        this.alcances = response.data;
      } catch (error) {
        console.error('❌ Error al cargar alcances:', error);
        this.mostrarSnackbar('Error al cargar los alcances de obra', 'error');
      }
    },

    async guardarAlcance() {
      if (!this.$refs.form.validate()) return;

      try {
        if (this.modoEdicion) {
          console.log('📝 Actualizando alcance:', this.alcance);
          const response = await axios.put(
            `${API_BASE_URL}/cem-actualizaAlcance/${this.alcance.cem_alcance_id}`,
            { descripcion: this.alcance.descripcion }
          );
          console.log('✅ Alcance actualizado:', response.data);
          this.mostrarSnackbar('Alcance de obra actualizado exitosamente');
        } else {
          console.log('📝 Creando nuevo alcance:', this.alcance);
          const response = await axios.post(
            `${API_BASE_URL}/cem-creaAlcance`,
            { descripcion: this.alcance.descripcion }
          );
          console.log('✅ Alcance creado:', response.data);
          this.mostrarSnackbar('Alcance de obra creado exitosamente');
        }
        
        this.limpiarFormulario();
        await this.cargarAlcances();
      } catch (error) {
        console.error('❌ Error al guardar alcance:', error);
        this.mostrarSnackbar(
          `Error al ${this.modoEdicion ? 'actualizar' : 'crear'} el alcance de obra`,
          'error'
        );
      }
    },

    editarAlcance(item) {
      this.alcance = { ...item };
      this.modoEdicion = true;
    },

    confirmarEliminacion(item) {
      this.alcanceAEliminar = item;
      this.dialogoEliminar = true;
    },

    async eliminarAlcance() {
      try {
        console.log('🗑️ Eliminando alcance:', this.alcanceAEliminar);
        const response = await axios.delete(
          `${API_BASE_URL}/cem-eliminaAlcance/${this.alcanceAEliminar.cem_alcance_id}`
        );
        console.log('✅ Alcance eliminado:', response.data);
        this.mostrarSnackbar('Alcance de obra eliminado exitosamente');
        await this.cargarAlcances();
      } catch (error) {
        console.error('❌ Error al eliminar alcance:', error);
        this.mostrarSnackbar('Error al eliminar el alcance de obra', 'error');
      }
      this.dialogoEliminar = false;
      this.alcanceAEliminar = null;
    },

    limpiarFormulario() {
      this.alcance = {
        cem_alcance_id: null,
        descripcion: ''
      };
      this.modoEdicion = false;
      this.$refs.form.resetValidation();
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
  created() {
    this.cargarAlcances();
  }
};
</script>

<style scoped>
.titulo-pantalla {
  font-size: 2rem;
  color: #333333;
  margin: 0.5rem 0 1.5rem 0;
}

.container {
  background-color: #E8E8E8;
  min-height: 100vh;
  padding-top: 16px;
}

.btn_app {
  background-color: #8C8C8C;
  color: #FFFFFF;
  min-width: 120px;
  margin: 0 8px;
}

.white-text-field .v-input__control {
  background-color: #FFFFFF !important;
}

.white-text-field .v-input__slot {
  background-color: #FFFFFF !important;
}

.neutral-card {
  background-color: #F7F6F2;
  border: 1px solid #D6D6D6;
}

.data-table-card {
  background-color: #FFFFFF;
  border: 1px solid #D6D6D6;
  margin-top: 2rem;
}

.toolbar-custom {
  background: transparent;
  padding: 8px;
}

.toolbar-title {
  color: #333333;
  font-weight: 600;
}

.search-field {
  background: #FFFFFF;
  min-width: 220px;
  max-width: 300px;
  margin-right: 8px;
}
</style>
