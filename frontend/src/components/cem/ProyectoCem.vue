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
            <v-col cols="12">
              <v-form ref="form" v-model="formValido" @submit.prevent="guardarProyecto">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="proyecto.cem_nombre"
                      label="Nombre del Proyecto"
                      :rules="[v => !!v || 'El nombre es requerido']"
                      class="input-field"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-select
                      v-model="proyecto.cem_id_tipo_proyecto"
                      :items="tiposProyecto"
                      :item-title="(item) => item.descripcion || ''"
                      :item-value="(item) => item.cem_id_tipo_proyecto"
                      label="Tipo de Proyecto"
                      :rules="[v => !!v || 'El tipo de proyecto es requerido']"
                      class="input-field"
                      variant="outlined"
                      density="comfortable"
                      return-object
                    ></v-select>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-select
                      v-model="proyecto.cem_alcance_id"
                      :items="alcances"
                      :item-title="(item) => item.descripcion || ''"
                      :item-value="(item) => item.cem_alcance_id"
                      label="Alcance de Obra"
                      :rules="[v => !!v || 'El alcance es requerido']"
                      class="input-field"
                      variant="outlined"
                      density="comfortable"
                      return-object
                    ></v-select>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="proyecto.cem_base_calculo"
                      label="Base de Cálculo"
                      type="number"
                      :rules="[v => v >= 0 || 'El valor debe ser mayor o igual a 0']"
                      class="input-field"
                      variant="outlined"
                      density="comfortable"
                      prefix="$"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="proyecto.cem_porc_subsidio"
                      label="Porcentaje de Subsidio"
                      type="number"
                      :rules="[v => (v >= 0 && v <= 100) || 'El porcentaje debe estar entre 0 y 100']"
                      class="input-field"
                      variant="outlined"
                      density="comfortable"
                      suffix="%"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="proyecto.cem_plazo_retorno_anios"
                      label="Plazo de Retorno (Años)"
                      type="number"
                      :rules="[v => v > 0 || 'El plazo debe ser mayor a 0']"
                      class="input-field"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="proyecto.cem_anio_inicio_obra"
                      label="Año de Inicio de Obra"
                      type="number"
                      :rules="[v => v >= 2000 || 'Ingrese un año válido']"
                      class="input-field"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="proyecto.cem_anio_inicio_obligaciones"
                      label="Año Inicio Obligaciones"
                      type="number"
                      :rules="[v => v >= proyecto.cem_anio_inicio_obra || 'Debe ser mayor o igual al año de inicio']"
                      class="input-field"
                      variant="outlined"
                      density="comfortable"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="proyecto.cem_base_imponible"
                      label="Base Imponible"
                      type="number"
                      :rules="[v => v >= 0 || 'El valor debe ser mayor o igual a 0']"
                      class="input-field"
                      variant="outlined"
                      density="comfortable"
                      prefix="$"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="proyecto.cem_valor_anualizado"
                      label="Valor Anualizado"
                      type="number"
                      :rules="[v => v >= 0 || 'El valor debe ser mayor o igual a 0']"
                      class="input-field"
                      variant="outlined"
                      density="comfortable"
                      prefix="$"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="proyecto.cem_porc_frente"
                      label="Porcentaje por Frente"
                      type="number"
                      :rules="[v => (v >= 0 && v <= 100) || 'El porcentaje debe estar entre 0 y 100']"
                      class="input-field"
                      variant="outlined"
                      density="comfortable"
                      suffix="%"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.number="proyecto.cem_porc_avaluo"
                      label="Porcentaje por Avalúo"
                      type="number"
                      :rules="[v => (v >= 0 && v <= 100) || 'El porcentaje debe estar entre 0 y 100']"
                      class="input-field"
                      variant="outlined"
                      density="comfortable"
                      suffix="%"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-switch
                      v-model="proyecto.cem_proyecto_finalizado"
                      label="Proyecto Finalizado"
                      color="success"
                      class="input-field"
                    ></v-switch>
                  </v-col>
                </v-row>

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
                    <v-btn
                      class="btn-action"
                      @click="volverAlMenu"
                      color="error"
                      variant="elevated"
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
                  :items="proyectos"
                  :search="busqueda"
                  class="elevation-1"
                >
                  <!-- Mostrar el ID en la columna -->
                  <template v-slot:item.cem_proyecto_id="{ item }">
                    <span>{{ item.cem_proyecto_id }}</span>
                  </template>

                  <!-- Tipo de proyecto -->
                  <template v-slot:item.tipo_proyecto="{ item }">
                    {{ getTipoProyectoDescripcion(item.cem_id_tipo_proyecto) }}
                  </template>
                  
                  <!-- Alcance -->
                  <template v-slot:item.alcance_descripcion="{ item }">
                    {{ getAlcanceDescripcion(item.cem_alcance_id) }}
                  </template>

                  <!-- Estado del proyecto -->
                  <template v-slot:item.cem_proyecto_finalizado="{ item }">
                    {{ item.cem_proyecto_finalizado ? 'SI' : 'NO' }}
                  </template>

                  <!-- Acciones -->
                  <template v-slot:item.acciones="{ item }">
                    <v-icon
                      size="small"
                      class="me-2"
                      @click="editarProyecto(item)"
                      color="#276E90"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon
                      size="small"
                      @click="confirmarEliminacion(item)"
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
  name: 'ProyectoCem',
  data() {
    return {
      formValido: true,
      busqueda: '',
      modoEdicion: false,
      dialogoEliminar: false,
      proyectoAEliminar: null,
      loading: true,
      alcances: [],
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },
      headers: [
        { title: 'ID', key: 'cem_proyecto_id', align: 'start', sortable: true, width: '80px' },
        { title: 'Nombre', key: 'cem_nombre', align: 'start', sortable: true },
        { title: 'Tipo Proyecto', key: 'tipo_proyecto', align: 'start', sortable: true },
        { title: 'Alcance', key: 'alcance_descripcion', align: 'start', sortable: true },
        { title: 'Finalizado', key: 'cem_proyecto_finalizado', align: 'start', sortable: true, width: '100px' },
        { title: 'Acciones', key: 'acciones', sortable: false, align: 'center', width: '100px' }
      ],
      tiposProyecto: [],
      proyectos: [],
      proyecto: {
        cem_proyecto_id: null,
        cem_nombre: '',
        cem_id_tipo_proyecto: null,
        cem_base_calculo: 0,
        cem_porc_subsidio: 0,
        cem_plazo_retorno_anios: 0,
        cem_fecha_registro: new Date().toISOString().split('T')[0],
        cem_proyecto_finalizado: false,
        cem_anio_inicio_obligaciones: new Date().getFullYear(),
        cem_base_imponible: 0,
        cem_anio_finalizacion_obligaciones: new Date().getFullYear(),
        cem_valor_anualizado: 0,
        cem_anio_inicio_obra: new Date().getFullYear(),
        cem_alcance_id: null,
        cem_porc_frente: 0,
        cem_porc_avaluo: 0,
        cem_usuario_sistema: ''
      }
    };
  },
  methods: {
    async cargarTiposProyecto() {
      try {
        const response = await axios.get(`${API_BASE_URL}/cem-obtieneTipoProyectos`);
        this.tiposProyecto = response.data || [];
      } catch (error) {
        console.error('Error al cargar tipos de proyecto:', error);
        this.mostrarSnackbar('Error al cargar los tipos de proyecto', 'error');
        this.tiposProyecto = [];
      }
    },

    async cargarAlcances() {
      try {
        const response = await axios.get(`${API_BASE_URL}/cem-obtieneAlcances`);
        this.alcances = response.data || [];
      } catch (error) {
        console.error('Error al cargar alcances:', error);
        this.mostrarSnackbar('Error al cargar los alcances de obra', 'error');
        this.alcances = [];
      }
    },

    async cargarProyectos() {
      try {
        const response = await axios.get(`${API_BASE_URL}/cem-proyectos`);
        this.proyectos = (response.data || []).map(proyecto => ({
          ...proyecto,
          cem_proyecto_id: proyecto.cem_proyecto_id,
          cem_nombre: proyecto.cem_nombre ?? '',
          cem_base_calculo: proyecto.cem_base_calculo ?? 0,
          cem_porc_subsidio: proyecto.cem_porc_subsidio ?? 0,
          cem_proyecto_finalizado: !!proyecto.cem_proyecto_finalizado
        }));
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
        this.mostrarSnackbar('Error al cargar los proyectos', 'error');
        this.proyectos = [];
      }
    },

    async guardarProyecto() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;

      try {
        if (this.modoEdicion) {
          if (!this.proyecto.cem_proyecto_id) {
            this.mostrarSnackbar('Error: el proyecto a actualizar no tiene un ID válido.', 'error');
            return;
          }
          await axios.put(
            `${API_BASE_URL}/actualiza-cem-proyectos/${this.proyecto.cem_proyecto_id}`,
            this.proyecto
          );
          this.mostrarSnackbar('Proyecto actualizado exitosamente');
        } else {
          await axios.post(`${API_BASE_URL}/inserta-proyectos-cem`, this.proyecto);          
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
          `${API_BASE_URL}/elimina-cem-proyectos/${this.proyectoAEliminar.cem_proyecto_id}`
        );
        this.mostrarSnackbar('Proyecto eliminado exitosamente');
        await this.cargarProyectos();
      } catch (error) {
        this.mostrarSnackbar('Error al eliminar el proyecto', 'error');
      }
      this.dialogoEliminar = false;
      this.proyectoAEliminar = null;
    },

    getTipoProyectoDescripcion(item) {
      if (!item || !this.tiposProyecto.length) {
        return 'No disponible';
      }
      const id = typeof item === 'object' ? item.cem_id_tipo_proyecto : item;
      const tipo = this.tiposProyecto.find(t => t.cem_id_tipo_proyecto === id);
      return tipo ? tipo.descripcion : 'No encontrado';
    },

    getAlcanceDescripcion(item) {
      if (!item || !this.alcances.length) {
        return 'No disponible';
      }
      const id = typeof item === 'object' ? item.cem_alcance_id : item;
      const alcance = this.alcances.find(a => a.cem_alcance_id === id);
      return alcance ? alcance.descripcion : 'No encontrado';
    },

    limpiarFormulario() {
      this.proyecto = {
        cem_proyecto_id: null,
        cem_nombre: '',
        cem_id_tipo_proyecto: null,
        cem_base_calculo: 0,
        cem_porc_subsidio: 0,
        cem_plazo_retorno_anios: 0,
        cem_fecha_registro: new Date().toISOString().split('T')[0],
        cem_proyecto_finalizado: false,
        cem_anio_inicio_obligaciones: new Date().getFullYear(),
        cem_base_imponible: 0,
        cem_anio_finalizacion_obligaciones: new Date().getFullYear(),
        cem_valor_anualizado: 0,
        cem_anio_inicio_obra: new Date().getFullYear(),
        cem_alcance_id: null,
        cem_porc_frente: 0,
        cem_porc_avaluo: 0,
        cem_usuario_sistema: ''
      };
      this.modoEdicion = false;
      if (this.$refs.form) this.$refs.form.resetValidation();
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
    try {
      await Promise.all([
        this.cargarTiposProyecto(),
        this.cargarAlcances(),
        this.cargarProyectos()
      ]);
    } catch (error) {
      console.error('Error al cargar los datos iniciales:', error);
      this.mostrarSnackbar('Error al cargar los datos. Por favor, intente nuevamente.', 'error');
    } finally {
      this.loading = false;
    }
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
