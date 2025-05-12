<template>
  <v-app-bar color="#A9A9A9" :elevation="1" class="d-flex justify-center">
    <v-app-bar-title class="text-center">URBANO</v-app-bar-title>
  </v-app-bar>
  <v-container class="d-flex align-center justify-center fill-height" style="min-height: 50vh;">
    <v-card class="block-color" style="width: 60%;">
      <v-card-title class="text-center titulo-pantalla">Gestión Documental</v-card-title>
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
                @click ="onPredioSeleccionado"              
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
              <input                
                type="file"
                @change="cargarArchivo"
                accept=".pdf, .doc, .docx, .jpg, .png"
                required
              />
            </v-col>
          </v-row>
        </v-form>
        <v-row justify="center">
          <v-btn-toggle class="v-actions">
            <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-plus" v-if="canEdit">Nuevo</v-btn>
            <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-check" @click="guardar" v-if="canEdit">Guardar</v-btn>
            <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-pencil" v-if="canEdit">Actualizar</v-btn>
            <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-delete" v-if="canEdit">Eliminar</v-btn>
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
        id_predio: null
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
        id_predio: null
      };
      this.$refs.form.reset();
    },

    async cargarArchivo(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.form.documento = e.target.result.split(',')[1]; // Convertir a Base64 y almacenar
        };
        reader.readAsDataURL(file); // Leer el archivo como Data URL
      }
    },

    async onPredioSeleccionado() {
      console.log('Predio seleccionado:', this.form.id_predio);
    },

    salir() {
      this.$router.push('/menu-predial'); 
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
