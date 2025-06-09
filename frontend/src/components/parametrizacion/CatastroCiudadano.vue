<template>
  <v-container>
    <v-card class="pa-5" outlined>
      <v-card-title class="headline text-center grey lighten-2">Ingreso Ciudadano</v-card-title>

      <!-- BOTONES -->
      <v-row class="mb-4">
        <v-col cols="12" class="d-flex justify-center">
          <v-btn class="mx-2" color="primary" @click="nuevo">Nuevo</v-btn>
          <v-btn class="mx-2" color="success" @click="guardar" :disabled="idCiudadano !== null || !valid">Guardar</v-btn>
          <v-btn class="mx-2" color="success" @click="actualizar" :disabled="idCiudadano === null || !valid">Modificar</v-btn>
          <v-btn class="mx-2" color="success" @click="eliminar" :disabled="idCiudadano === null">Eliminar</v-btn>
          <v-btn class="mx-2" color="warning" @click="salir">Salir</v-btn>
        </v-col>
      </v-row>

      <!-- FORMULARIO -->
      <v-form ref="form" v-model="valid" lazy-validation>
        <!-- BLOQUE 1: Identificación -->
        <v-card class="mb-4" outlined>
          <v-card-title class="subtitle-1">Información de Identificación</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="form.id_tipo_documento"
                  :items="tipoDocumentos"
                  item-text="tipoNombre"
                  item-value="id"
                  label="Tipo de Documento"
                  :rules="[v => !!v || 'Tipo de documento es obligatorio']"
                  required
                  @change="validarCampoDocumento"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="form.id_tipo_persona"
                  :items="tipoPersonas"
                  item-text="tipoNombre"
                  item-value="id"
                  label="Tipo de Persona"
                  :rules="[v => !!v || 'Tipo de persona es obligatorio']"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="form.id_personeria"
                  :items="tipoPersonerias"
                  item-text="tipoNombre"
                  item-value="id"
                  label="Personería"
                  :rules="[v => !!v || 'Personería es obligatoria']"
                  required
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- BLOQUE 2: Datos Personales -->
        <v-card class="mb-4" outlined>
          <v-card-title class="subtitle-1">Información Personal</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  ref="campoDocumento"
                  v-model="form.numero_documento"
                  label="Número de Documento"
                  :rules="[
                    v => !!v || 'Número de documento es obligatorio',
                    () => validaNumeroDocumento()
                  ]"
                  required
                  @blur="validarCampoDocumento"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.nombre_principal"
                  label="Nombre Principal"
                  :rules="[v => !!v || 'Nombre principal es obligatorio']"
                  required
                  @input="updateNombres"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.apellido_primario"
                  label="Apellido Primario"
                  :rules="[v => !!v || 'Apellido primario es obligatorio']"
                  required
                  @input="updateNombres"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.nombre_secundario"
                  label="Nombre Secundario"
                  @input="updateNombres"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.apellido_secundario"
                  label="Apellido Secundario"
                  @input="updateNombres"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.nombres"
                  label="Nombres Completos"
                  readonly
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="form.id_estado_civil"
                  :items="estadosCiviles"
                  item-text="tipoNombre"
                  item-value="id"
                  label="Estado Civil"
                  :rules="[v => !!v || 'Estado civil es obligatorio']"
                  required
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- BLOQUE 3: Datos Adicionales -->
        <v-card class="mb-4" outlined>
          <v-card-title class="subtitle-1">Datos Adicionales</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.fecha_nacimiento"
                  label="Fecha de Nacimiento"
                  type="date"
                  :rules="[v => !!v || 'Fecha de nacimiento es obligatoria']"
                  required
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="form.telefono" label="Teléfono" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="form.email" label="Email" type="email" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="form.direccion" label="Dirección" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="form.fecha_registro"
                  label="Fecha de Registro"
                  type="date"
                  readonly
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-form>

    </v-card>

    <!-- SNACKBARS -->
    <v-snackbar v-model="snackbarOkPush" :timeout="3000" color="success">
      {{ snackbarOK }}
    </v-snackbar>
    <v-snackbar v-model="snackbarErrorPush" :timeout="3000" color="fail">
      {{ snackbarError }}
    </v-snackbar>

    <!-- DIALOGO DE CONFIRMACIÓN -->
    <template v-if="confirmDelete">
      <v-dialog v-model="confirmDelete" max-width="400">
        <v-card>
          <v-card-title class="headline">¿Está seguro de que desea eliminar este ciudadano?</v-card-title>
          <v-card-text>Esta acción no se puede deshacer.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" text @click="confirmDelete = false; snackbarError = 'Eliminación cancelada'; snackbarErrorPush = true;">Cancelar</v-btn>
            <v-btn color="red" text @click="confirmarEliminacion">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-container>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';
import API_BASE_URL from '@/config/apiConfig';

// -------------------------
// Validación de Cédula
// -------------------------
function validarCedula(cedula) {
  if (!/^\d{10}$/.test(cedula)) return false;

  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) return false;

  const digitos = cedula.split('').map(Number);
  const verificador = digitos[9];

  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let valor = digitos[i];
    if (i % 2 === 0) {
      valor *= 2;
      if (valor > 9) valor -= 9;
    }
    suma += valor;
  }

  const modulo = suma % 10;
  const digitoCalculado = modulo === 0 ? 0 : 10 - modulo;

  return digitoCalculado === verificador;
}

// -------------------------
// Validación de RUC persona natural
// -------------------------
function validarRUC(ruc) {
  if (!/^\d{13}$/.test(ruc)) return false;

  const cedulaParte = ruc.substring(0, 10);
  const sufijo = ruc.substring(10);

  return validarCedula(cedulaParte) && sufijo === '001';
}

export default {
  name: 'CatastroCiudadano',
  data() {
    return {
      valid: false,
      form: {
        id_ciudadano: null,
        id_tipo_documento: '',
        id_tipo_persona: '',
        id_personeria: '',
        numero_documento: '',
        nombre_principal: '',
        nombre_secundario: '',
        apellido_primario: '',
        apellido_secundario: '',
        nombres: '',
        fecha_nacimiento: '',
        telefono: '',
        email: '',
        direccion: '',
        id_estado_civil: '',
        fecha_registro: ''
      },
      tipoDocumentos: [],
      tipoPersonas: [],
      tipoPersonerias: [],
      estadosCiviles: [],
      idCiudadano: null,
      snackbarOkPush: false,
      snackbarOK: '',
      snackbarErrorPush: false,
      snackbarError: '',
      confirmDelete: false
    };
  },

  created() {
    const idCiudadano = this.$route.query.id_ciudadano;
    if (idCiudadano) {
      this.idCiudadano = idCiudadano;
      this.updateIdCiudadano(idCiudadano);
    } else {
      this.resetIdCiudadano();
    }
  },

  computed: {
    isUpdateMode() {
      return this.idCiudadano !== null;
    }
  },

  async mounted() {
    try {
      this.tipoDocumentos = await this.cargaCatalogos(7, 0);
      this.tipoPersonas = await this.cargaCatalogos(5, 0);
      this.tipoPersonerias = await this.cargaCatalogos(6, 0);
      this.estadosCiviles = await this.cargaCatalogos(4, 0);

      if (this.idCiudadano) {
        this.snackbarOK = 'Recuperando datos del ciudadano';
        this.snackbarOkPush = true;
        await this.recuperaCiudadano(this.idCiudadano);
      } else {
        this.snackbarOK = 'Nuevo Ciudadano';
        this.snackbarOkPush = true;
      }
    } catch (error) {
      console.error('Error al montar el componente:', error);
    }
  },

  methods: {
    ...mapActions(['setIdCiudadano', 'updateIdCiudadano', 'resetIdCiudadano']),

    async cargaCatalogos(id_tipo_atributo, tipo) {
      try {
        const response = await axios.get(`${API_BASE_URL}/catalogo/${id_tipo_atributo}/${tipo}`);
        if (Array.isArray(response.data)) {
          const uniqueData = response.data.filter((item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
          );
          return uniqueData.map(item => ({
            ...item,
            tipoNombre: item.descripcion,
            title: item.descripcion
          }));
        } else {
          throw new Error('La respuesta de la API no es un array');
        }
      } catch (error) {
        console.error('Error fetching catalogo:', error);
        throw new Error('No se pudo obtener el catálogo');
      }
    },

    updateNombres() {
      this.form.nombres = `${this.form.apellido_primario} ${this.form.apellido_secundario} ${this.form.nombre_principal} ${this.form.nombre_secundario}`.trim();
    },

    async guardar() {
      const esValido = await this.$refs.form.validate();
      if (!esValido) {
        this.snackbarError = 'Por favor, complete todos los campos requeridos correctamente';
        this.snackbarErrorPush = true;
        return;
      }

      this.updateNombres();

      const tipo = this.tipoDocumentos.find(t => t.id === this.form.id_tipo_documento)?.descripcion?.toUpperCase();
      if (tipo === 'CEDULA' && !validarCedula(this.form.numero_documento)) {
        this.snackbarError = 'Número de cédula no válido';
        this.snackbarErrorPush = true;
        return;
      }
      if (tipo === 'RUC' && !validarRUC(this.form.numero_documento)) {
        this.snackbarError = 'Número de RUC no válido';
        this.snackbarErrorPush = true;
        return;
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/inserta_ciudadano`, { ...this.form });
        this.idCiudadano = response.data;
        this.snackbarOK = 'Ciudadano guardado exitosamente';
        this.snackbarOkPush = true;
      } catch (error) {
        console.error('Error al guardar el ciudadano:', error);
        this.snackbarError = 'Error al guardar el ciudadano';
        this.snackbarErrorPush = true;
      }
    },

    async actualizar() {
      const esValido = await this.$refs.form.validate();
      if (!esValido) {
        this.snackbarError = 'Por favor, complete todos los campos requeridos correctamente';
        this.snackbarErrorPush = true;
        return;
      }

      this.updateNombres();

      const tipo = this.tipoDocumentos.find(t => t.id === this.form.id_tipo_documento)?.descripcion?.toUpperCase();
      if (tipo === 'CEDULA' && !validarCedula(this.form.numero_documento)) {
        this.snackbarError = 'Número de cédula no válido';
        this.snackbarErrorPush = true;
        return;
      }
      if (tipo === 'RUC' && !validarRUC(this.form.numero_documento)) {
        this.snackbarError = 'Número de RUC no válido';
        this.snackbarErrorPush = true;
        return;
      }

      try {
        const response = await axios.put(`${API_BASE_URL}/actualiza_ciudadano/${this.idCiudadano}`, { ...this.form });
        this.snackbarOK = 'Datos actualizados exitosamente';
        this.snackbarOkPush = true;
        await this.recuperaCiudadano(this.idCiudadano);
      } catch (error) {
        console.error('Error al actualizar el ciudadano:', error);
        this.snackbarError = 'Error al actualizar el ciudadano';
        this.snackbarErrorPush = true;
      }
    },

    async eliminar() {
      // Mostrar confirmación con snackbar personalizado
      this.confirmDelete = true;
    },

    async confirmarEliminacion() {
      this.confirmDelete = false;
      try {
        const response = await axios.delete(`${API_BASE_URL}/elimina_ciudadano_by_id/${this.idCiudadano}`);
        this.snackbarOK = 'Ciudadano eliminado exitosamente';
        this.snackbarOkPush = true;
        this.nuevo();
      } catch (error) {
        console.error('Error al eliminar el ciudadano:', error);
        this.snackbarError = 'Error al eliminar el ciudadano';
        this.snackbarErrorPush = true;
      }
    },

    nuevo() {
      this.form = {
        id_ciudadano: null,
        id_tipo_documento: '',
        id_tipo_persona: '',
        id_personeria: '',
        numero_documento: '',
        nombre_principal: '',
        nombre_secundario: '',
        apellido_primario: '',
        apellido_secundario: '',
        nombres: '',
        fecha_nacimiento: '',
        telefono: '',
        email: '',
        direccion: '',
        id_estado_civil: '',
        fecha_registro: ''
      };
      this.idCiudadano = null;
      // Elimina la llamada a setIdCiudadano, ya que no existe en Vuex
    },

    salir() {
      this.$router.push('/listado-ciudadanos');
    },

    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const month = '' + (d.getMonth() + 1);
      const day = '' + d.getDate();
      const year = d.getFullYear();
      return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
    },

    validaNumeroDocumento() {
      const doc = this.form.numero_documento;
      const tipo = this.tipoDocumentos.find(t => t.id === this.form.id_tipo_documento)?.descripcion?.toUpperCase();

      if (!doc) return 'Debe ingresar un número';

      if (tipo === 'CEDULA' && !validarCedula(doc)) {
        return 'Cédula no válida';
      }

      if (tipo === 'RUC' && !validarRUC(doc)) {
        return 'RUC no válido';
      }

      return true;
    },

    validarCampoDocumento() {
      this.$refs.campoDocumento?.validate?.();
    },

    async recuperaCiudadano(idCiudadano) {
      try {
        const response = await axios.get(`${API_BASE_URL}/recupera_ciudadano_by_id/${idCiudadano}`);
        if (response.data) {
          // Formatear fechas a yyyy-MM-dd si existen
          const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            if (isNaN(d)) return dateStr; // fallback
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          };
          this.form = {
            ...this.form,
            ...response.data,
            fecha_nacimiento: formatDate(response.data.fecha_nacimiento),
            fecha_registro: formatDate(response.data.fecha_registro)
          };
        } else {
          this.snackbarError = 'No se encontraron datos para el ciudadano';
          this.snackbarErrorPush = true;
        }
      } catch (error) {
        console.error('Error al recuperar el ciudadano:', error);
        this.snackbarError = 'Error al recuperar el ciudadano';
        this.snackbarErrorPush = true;
      }
    }
  }
};
</script>

<style scoped>
.v-card {
  background-color: white;
}

.v-btn {
  font-weight: bold;
}

.v-snackbar {
  font-weight: bold;
}
</style>

