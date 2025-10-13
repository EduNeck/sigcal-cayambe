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
              />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.descripcion" label="Descripción (*)" required/>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="form.nombre" label="Nombre del Documento (*)" required/>
            </v-col>
            <v-col cols="12">
              <input
                type="file"
                @change="cargarArchivo"
                accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                required
                :class="{'is-invalid': !form.documento && valid}"
              />
              <span v-if="!form.documento && valid" class="error--text">Debe cargar un archivo</span>
            </v-col>
          </v-row>
        </v-form>
        <v-row justify="center">
          <v-btn-toggle class="v-actions">
            <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-plus" v-if="canEdit" @click="resetForm">Nuevo</v-btn>
            <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-check" @click="guardar" v-if="canEdit">Guardar</v-btn>
            <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-pencil" v-if="canEdit" :disabled="!idDocumento" @click="actualizar">Actualizar</v-btn>
            <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-delete" v-if="canEdit" @click="eliminar">Eliminar</v-btn>
            <v-btn class="btn_app mx-2 custom-text-color" append-icon="mdi-exit-to-app" @click="salir">Salir</v-btn>
          </v-btn-toggle>
        </v-row>

        <v-snackbar v-model="snackbar" :color="snackbarError ? 'error' : 'success'">
          {{ snackbarError ? snackbarErrorMessage : snackbarMessage }}
        </v-snackbar>
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
        documento: null,   // base64 puro
        id_predio: null,
        nombre: '',
        tipo: null,
        tamanio: null,
      },
      idDocumento: null,
      clavesCatastrales: [],
      snackbar: false,
      snackbarMessage: '',
      snackbarError: false,
      snackbarErrorMessage: ''
    };
  },
  computed: {
    ...mapGetters(['isConsultaPrimario', 'userName']),
    canEdit() {
      const { canEdit } = useUserRoles();
      return canEdit.value;
    }
  },
  async mounted() {
    this.clavesCatastrales = await this.recuperaClaves();
    const idDoc = this.$route.query.id_documentos;
    if (idDoc) {
      this.idDocumento = idDoc;
      await this.cargarDocumentoPorId(idDoc);
    }
  },
  methods: {
    async recuperaClaves() {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/claves_catastrales`);
        return Array.isArray(data)
          ? data.map(i => i?.id_predio && i?.clave_catastral
              ? { ...i, title: `${i.clave_catastral}`, id: i.id_predio }
              : null
            ).filter(Boolean)
          : [];
      } catch (e) {
        console.error('Error recuperando claves:', e);
        return [];
      }
    },

    onPredioSeleccionado(value) {
      this.form.id_predio = value;
      const clave = this.clavesCatastrales.find(i => i.id === value)?.title || '';
      if (clave) this.form.nombre = clave;
    },

    async cargarArchivo(event) {
      const file = event.target.files[0];
      if (!file) return;
      const maxMB = 25;
      if (file.size > maxMB * 1024 * 1024) {
        this.snackbarErrorMessage = `Archivo supera ${maxMB} MB`;
        this.snackbarError = true; this.snackbar = true;
        return;
      }
      const permitidos = [
        'application/pdf','image/jpeg','image/png',
        'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!permitidos.includes(file.type)) {
        this.snackbarErrorMessage = 'Tipo de archivo no permitido';
        this.snackbarError = true; this.snackbar = true;
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result; // data:<mime>;base64,<contenido>
        this.form.documento = result.split(',')[1]; // base64 puro
        this.form.tipo = file.type;
        this.form.tamanio = file.size;
        if (!this.form.nombre) this.form.nombre = file.name;
      };
      reader.readAsDataURL(file);
    },

    async guardar() {
      if (!this.$refs.form.validate()) return;
      const f = new Date();
      const fechaRegistro =
        `${f.getFullYear()}-${String(f.getMonth()+1).padStart(2,'0')}-${String(f.getDate()).padStart(2,'0')} ${String(f.getHours()).padStart(2,'0')}:${String(f.getMinutes()).padStart(2,'0')}`;

      const payload = {
        descripcion: this.form.descripcion,
        fecha_registro: fechaRegistro,
        documento: this.form.documento,
        id_predio: this.form.id_predio,
        digitador: this.userName,
        nombre: this.form.nombre,
        tipo: this.form.tipo,
        tamanio: this.form.tamanio
      };

      try {
        const { data } = await axios.post(`${API_BASE_URL}/inserta_documento`, payload);
        this.idDocumento = data?.id_documentos || null;
        this.snackbarMessage = 'Documento guardado con éxito';
        this.snackbarError = false; this.snackbar = true;
        this.resetForm();
      } catch (e) {
        console.error('Error al guardar:', e);
        this.snackbarErrorMessage = 'Error al guardar el documento';
        this.snackbarError = true; this.snackbar = true;
      }
    },

    async actualizar() {
      if (!this.idDocumento) return;
      try {
        const payload = { ...this.form, digitador: this.userName };
        const { data } = await axios.put(`${API_BASE_URL}/actualiza_documento_by_id/${this.idDocumento}`, payload);
        if (data) {
          this.snackbarMessage = 'Documento actualizado con éxito';
          this.snackbarError = false; this.snackbar = true;
        }
      } catch (e) {
        console.error('Error al actualizar:', e);
        this.snackbarErrorMessage = 'Error al actualizar el documento';
        this.snackbarError = true; this.snackbar = true;
      }
    },

    async cargarDocumentoPorId(id) {
      try {
        const { data: doc } = await axios.get(`${API_BASE_URL}/documento_by_id/${id}`);
        if (doc) {
          this.form.descripcion = doc.descripcion || '';
          this.form.fecha_registro = doc.fecha_registro || '';
          this.form.documento = doc.documento || null; // base64 para edición si hiciera falta
          this.form.id_predio = doc.id_predio || null;
          this.form.nombre = doc.nombre || '';
          this.form.tipo = doc.tipo || null;
          this.form.tamanio = doc.tamanio || null;
        }
      } catch (e) {
        console.error('Error al cargar por ID:', e);
        this.snackbarErrorMessage = 'Error al cargar el documento';
        this.snackbarError = true; this.snackbar = true;
      }
    },

    async eliminar() {
      if (!this.idDocumento) {
        this.snackbarErrorMessage = 'No hay documento seleccionado para eliminar';
        this.snackbarError = true; this.snackbar = true;
        return;
      }
      if (!window.confirm('¿Está seguro de eliminar este documento?')) return;
      try {
        await axios.delete(`${API_BASE_URL}/elimina_documento_by_id/${this.idDocumento}`);
        this.snackbarMessage = 'Documento eliminado con éxito';
        this.snackbarError = false; this.snackbar = true;
        this.resetForm();
        this.$router.push('/listado-documental');
      } catch (e) {
        console.error('Error al eliminar:', e);
        this.snackbarErrorMessage = 'Error al eliminar el documento';
        this.snackbarError = true; this.snackbar = true;
      }
    },

    resetForm() {
      this.form = {
        descripcion: '',
        fecha_registro: '',
        documento: null,
        id_predio: null,
        nombre: '',
        tipo: null,
        tamanio: null
      };
      this.$refs.form?.reset?.();
    },

    salir() {
      this.$router.push('/menu-predial');
    }
  }
};
</script>

<style scoped>
.container { background-color: #F1ECE7; }
.block-color { background-color: #F1ECE7; color: #223770; }
.custom-text-color { color: #F1ECE7; }
.titulo-pantalla { font-size: 2rem; color: #223770; }
.btn_app { background-color: #223770; color: #ffffff; }
.fill-height { min-height: 50vh; }
</style>
