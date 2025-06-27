<template>
  <v-app-bar color="#A9A9A9" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">URBANO</v-app-bar-title>
  </v-app-bar>
  <v-container class="d-flex align-center justify-center fill-height" style="min-height: 50vh;">
    <v-card class="block-color" style="width: 60%;">
      <v-card-title class="text-center titulo-pantalla">Anexos Documentales</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="form.id_predio"
                :items="clavesCatastrales"
                label="Clave Catastral"
                item-text="title"
                item-value="id"
                required
                @update:model-value="onPredioSeleccionado"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.descripcion"
                label="Descripción (*)"
                required
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.nombre"
                label="Nombre del Documento (*)"
                required                
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <input                
                type="file"
                @change="cargarArchivo"
                accept=".pdf, .doc, .docx, .jpg, .png"
                required
                :class="{'is-invalid': !form.documento && valid}"
              />
              <span v-if="!form.documento && valid" class="error--text">Debe cargar un archivo</span>
            </v-col>
          </v-row>
        </v-form>
        <v-row justify="center">
          <v-btn-toggle class="v-actions">
            <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-plus" v-if="canEdit">Nuevo</v-btn>
            <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-check" @click="guardar" v-if="canEdit">Guardar</v-btn>
            <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-pencil" v-if="canEdit">Actualizar</v-btn>
            <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-delete" v-if="canEdit" @click="eliminar">Eliminar</v-btn>
            <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-exit-to-app" @click="salir">Salir</v-btn>
          </v-btn-toggle>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import useUserRoles from '@/composables/useUserRoles';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'GestionDocumental',
  data() {
    return {
      valid: false,
      form: {
        descripcion: '',
        fecha_registro: '',
        documento: null,
        id_predio: null,
        nombre: ''
      },
      idPredio: null,
      selectedClaveCatastral: '',
      clavesCatastrales: [],
      snackbar: false,
      snackbarMessage: '',
      snackbarError: false,
      snackbarErrorMessage: ''
    };
  },

  async mounted() {
    this.clavesCatastrales = await this.recuperaClaves();   
    // Si viene id_documentos por query, cargar el documento
    const idDocumento = this.$route.query.id_documentos;
    if (idDocumento) {
      this.cargarDocumentoPorId(idDocumento);
    }
  },

  computed: {
    ...mapGetters(['isConsultaPrimario', 'userName']),
    canEdit() {
      const { canEdit } = useUserRoles();
      return canEdit.value; 
    }
  },

  methods: {

    async recuperaClaves() {
      console.log('Recuperando claves catastrales...');
      try {
        const response = await axios.get(`${API_BASE_URL}/claves_catastrales`);        
        if (Array.isArray(response.data)) {
          return response.data.map(item => {
            if (item.id_predio && item.clave_catastral) {
              return {
                ...item,                
                title: `${item.clave_catastral}`,
                id: item.id_predio                
              };
            } else {
              console.warn('Elemento con datos incompletos:', item);
              return null;
            }
          }).filter(item => item !== null); 
        } else {
          throw new Error('La respuesta de la API no es un array');
        }
      } catch (error) {
        console.error('Error fetching parroquia:', error);
        return [];
      }
    },

    async guardar() {
      if (this.$refs.form.validate()) {
        const fechaActual = new Date();
        const anio = fechaActual.getFullYear();
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        const hora = String(fechaActual.getHours()).padStart(2, '0');
        const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
        const fechaRegistro = `${anio}-${mes}-${dia} ${hora}:${minutos}`;

        const formData = {
          descripcion: this.form.descripcion,
          fecha_registro: fechaRegistro,
          documento: this.form.documento, // Documento en Base64
          id_predio: this.form.id_predio,
          digitador: this.userName,
          nombre: this.form.nombre
        };

        try {
          const response = await axios.post(`${API_BASE_URL}/inserta_documento`, formData);
          console.log('Documento guardado con éxito:', response.data);
          this.snackbarMessage = 'Documento guardado con éxito';
          this.snackbar = true;
          this.resetForm();
        } catch (error) {
          console.error('Error al guardar el documento:', error);
          this.snackbarErrorMessage = 'Error al guardar el documento';
          this.snackbarError = true;
        }
      }
    },

    resetForm() {
      this.form = {
        descripcion: '',
        fecha_registro: '',
        documento: null,
        id_predio: null,
        nombre: ''
      };
      this.$refs.form.reset();
    },

    async cargarArchivo(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target.result;
          // Guarda solo el contenido base64 (sin encabezado)
          this.form.documento = result.split(',')[1];
          this.form.tipo = file.type;            // Mime type
          this.form.tamanio = file.size;         // Tamaño
          console.log('Base64 (inicio):', this.form.documento.slice(0, 100));
        };
        reader.readAsDataURL(file); // Lee como Data URL
      }
    },

    onPredioSeleccionado(value) {
      this.form.id_predio = value;
      const clave = this.clavesCatastrales.find(item => item.id === value)?.title || '';
      if (clave) {
        this.form.nombre = clave; // Solo la clave, sin guion bajo ni texto adicional
      }
      console.log('Predio seleccionado:', value);
    },

    salir() {
      this.$router.push('/menu-predial'); 
    },

    async cargarDocumentoPorId(id) {
      try {
        const response = await axios.get(`${API_BASE_URL}/documento_by_id/${id}`);
        const doc = response.data;
        console.log('Documento cargado:', doc);
        if (doc) {
          this.form.descripcion = doc.descripcion || '';
          this.form.fecha_registro = doc.fecha_registro || '';
          this.form.documento = doc.documento || null;
          this.form.id_predio = doc.id_predio || null;
          this.form.nombre = doc.nombre || '';
          // Si tienes más campos, agrégalos aquí
        }
      } catch (error) {
        console.error('Error al cargar el documento por ID:', error);
        this.snackbarErrorMessage = 'Error al cargar el documento';
        this.snackbarError = true;
      }
    },

    async eliminar() {
      const idDocumento = this.$route.query.id_documentos;
      if (!idDocumento) {
        this.snackbarErrorMessage = 'No hay documento seleccionado para eliminar';
        this.snackbarError = true;
        return;
      }
      this.snackbarMessage = '¿Está seguro de que desea eliminar este documento?';
      this.snackbar = true;
      // Esperar confirmación del usuario usando un setTimeout y luego eliminar
      setTimeout(async () => {
        if (window.confirm('¿Está seguro de que desea eliminar este documento?')) {
          try {
            await axios.delete(`${API_BASE_URL}/elimina_documento_by_id/${idDocumento}`);
            this.snackbarMessage = 'Documento eliminado con éxito';
            this.snackbar = true;
            this.resetForm();
            this.$router.push('/listado-documental');
          } catch (error) {
            console.error('Error al eliminar el documento:', error);
            this.snackbarErrorMessage = 'Error al eliminar el documento';
            this.snackbarError = true;
          }
        }
      }, 100);
    }

  },


};
</script>

<style scoped>
.container {
  background-color: #F1ECE7;
}

.block-color {
  background-color: #F1ECE7;
  color: #223770;
}

.custom-text-color {
  color: #F1ECE7;
}

.titulo-pantalla {
  font-size: 2rem;
  color: #223770;
}

.btn_app {
  background-color: #223770;
  color: #ffffff;
}

.fill-height {
  min-height: 50vh;
}
</style>
