<template>
  <v-container :class="['container', tipoClaseContainer]">
    <v-col cols="12" class="text-center">
      <h2 class="titulo-pantalla">Foto del Predio</h2>
    </v-col>
    <v-col cols="auto" class="d-flex justify-center">
      <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-plus" @click="nuevo" :disabled="!getIdPredio" v-if="canEdit">Nuevo</v-btn>
      <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-check" @click="guardar" :disabled="!getIdPredio || !!idFoto" v-if="canEdit">Guardar</v-btn>
      <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-pencil" @click="actualiza" :disabled="!idFoto" v-if="canEdit">Actualizar</v-btn>
      <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-delete" @click="eliminar" :disabled="!idFoto" v-if="canEdit">Eliminar</v-btn>
      <v-btn :class="['btn_app', tipoClaseButton]" append-icon="mdi-refresh" @click="refrescarFotos" :disabled="!getIdPredio"></v-btn>
    </v-col>

    <!-- Imagen principal actual -->
    <v-card :class="['mb-3', 'block-color', tipoClaseBlock]" v-if="fotoRecuperadaUrl">
      <v-card-title :class="['centered-title', tipoClaseTitle]">Foto Principal del Predio</v-card-title>
      <v-card-text>
        <v-row justify="center">
          <v-col class="d-flex justify-center">
            <v-img :src="fotoRecuperadaUrl" class="my-4 custom-img"></v-img>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Grid de todas las fotos asociadas al predio -->
    <v-row>
      <v-col cols="12">
        <v-card :class="['mb-3', 'block-color', tipoClaseBlock]">
          <v-card-title :class="['centered-title', tipoClaseTitle]">Galería de Fotos del Predio</v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                v-for="(foto, idx) in fotos"
                :key="foto.id_foto"
                cols="12" sm="6" md="4" lg="3"
                class="mb-4"
              >
                <v-card elevation="2">
                  <v-img
                    :src="getFotoUrl(foto)"
                    :alt="foto.descripcion"
                    class="foto-grid"
                    cover
                    width="180"
                    height="180"
                  />
                  <v-card-title class="text-truncate" style="font-size:0.9rem;">
                    {{ foto.descripcion || 'Sin descripción' }}
                  </v-card-title>
                  <v-card-subtitle>
                    <v-chip v-if="foto.principal" color="success" size="small" label>
                      Principal
                    </v-chip>
                    <v-chip v-if="foto.certificado" color="primary" size="small" label>
                      Certificado
                    </v-chip>
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-btn icon color="primary" @click="verFoto(foto)">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="canEdit"
                      icon
                      color="warning"
                      @click="editarFoto(foto)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      v-if="canEdit"
                      icon
                      color="error"
                      @click="eliminarFoto(foto.id_foto)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Formulario de identificación y subida de foto -->
    <v-row>
      <v-col cols="12">
        <v-card :class="['mb-3', 'block-color', tipoClaseBlock]">
          <v-card-title :class="['centered-title', tipoClaseTitle]">Identificación</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-checkbox label="Principal" v-model="form.principal" class="block-color"></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-checkbox label="Certificado" v-model="form.certificado" class="block-color"></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Descripción" v-model="form.descripcion" class="block-color" required></v-text-field>
              </v-col>
              <v-col class="d-flex justify-center">
                <v-file-input label="Subir Foto" prepend-icon="mdi-camera" @change="onFileChange" accept="image/*" required></v-file-input>
                <v-img :src="form.fotoUrl" v-if="form.fotoUrl" class="my-4"></v-img>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbars -->
    <v-snackbar v-model="snackbarErrorPush" :timeout="3500" color="error" rounded="pill">
      {{ snackbarError }}
    </v-snackbar>
    <v-snackbar v-model="snackbarOkPush" :timeout="3000" color="success">
      {{ snackbarOk }}
    </v-snackbar>
    <v-snackbar v-model="snackbarNotaPush" :timeout="3500" color="info">
      {{ snackbarNota }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapMutations } from 'vuex';
import useUserRoles from '@/composables/useUserRoles';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'TabFotoPredio',
  data() {
    return {
      form: {
        id_foto: null,
        descripcion: '',
        foto: null,
        principal: false,
        certificado: false,
        fotoUrl: ''
      },
      fotos: [],
      idFoto: null,
      fotoRecuperadaUrl: '',
      snackbarErrorPush: false,
      snackbarNotaPush: false,
      snackbarOkPush: false,
      snackbarError: '',
      snackbarNota: '',
      snackbarOk: '',
    };
  },

  computed: {
    ...mapGetters(['getIdPredio', 'getIdFoto', 'isConsultaPrimario', 'getTipoPredio']),
    canEdit() {
      const { canEdit } = useUserRoles();
      return canEdit.value;
    },
    tipoClaseContainer() {
      return this.getTipoPredio === 1 ? 'urbano-container' : 'rural-container';
    },
    tipoClaseButton() {
      return this.getTipoPredio === 1 ? 'urbano-btn' : 'rural-btn';
    },
    tipoClaseBlock() {
      return this.getTipoPredio === 1 ? 'urbano-block' : 'rural-block';
    },
    tipoClaseTitle() {
      return this.getTipoPredio === 1 ? 'urbano-title' : 'rural-title';
    }
  },

  async mounted() {
    if (!this.getIdPredio) {
      this.snackbarNota = 'No se ha seleccionado un predio';
      this.snackbarNotaPush = true;
    } else {
      await this.recuperaFotos(this.getIdPredio);
    }
  },

  methods: {
    ...mapMutations(['setIdFoto']),

    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.form.foto = file;
        this.form.fotoUrl = URL.createObjectURL(file);
      }
    },

    async guardar() {
      const formData = new FormData();
      formData.append('descripcion', this.form.descripcion);
      formData.append('foto', this.form.foto);
      formData.append('principal', this.form.principal);
      formData.append('id_predio', this.getIdPredio);
      formData.append('certificado', this.form.certificado || false);
      formData.append('fecha_registro', new Date().toISOString().split('T')[0]);

      try {
        const response = await axios.post(`${API_BASE_URL}/inserta_foto`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.idFoto = response.data.id_foto;
        this.snackbarOk = 'Foto guardada correctamente';
        this.snackbarOkPush = true;
        await this.recuperaFotos(this.getIdPredio);
        this.nuevo();
      } catch (error) {S
        
        this.snackbarError = 'Error al guardar la foto';
        this.snackbarErrorPush = true;
      }
    },

    async recuperaFotos(id_predio) {
      try {
        const response = await axios.get(`${API_BASE_URL}/fotos_by_idPredio/${id_predio}`);
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          this.fotos = data;
          // Busca la principal, si hay
          const principal = data.find(f => f.principal);
          if (principal) {
            this.fotoRecuperadaUrl = this.getFotoUrl(principal);
          } else {
            this.fotoRecuperadaUrl = this.getFotoUrl(data[0]);
          }
        } else {
          this.fotos = [];
          this.fotoRecuperadaUrl = '';
          this.snackbarNota = 'No se encontraron fotos para este predio';
          this.snackbarNotaPush = true;
        }
      } catch (error) {
        this.snackbarError = 'Error al recuperar las fotos';
        this.snackbarErrorPush = true;
      }
    },

    getFotoUrl(foto) {
      if (!foto) return '';
      if (typeof foto.foto === "string") {
        return `data:image/png;base64,${foto.foto}`;
      } else if (foto.foto && foto.foto.data) {
        const byteArray = new Uint8Array(foto.foto.data);
        const blob = new Blob([byteArray], { type: 'image/png' });
        return URL.createObjectURL(blob);
      }
      return '';
    },

    verFoto(foto) {
      this.fotoRecuperadaUrl = this.getFotoUrl(foto);
    },

    editarFoto(foto) {
      this.form = {
        id_foto: foto.id_foto,
        descripcion: foto.descripcion,
        principal: !!foto.principal,
        certificado: !!foto.certificado,
        foto: null,
        fotoUrl: this.getFotoUrl(foto),
      };
      this.idFoto = foto.id_foto;
      this.setIdFoto(foto.id_foto);
      this.fotoRecuperadaUrl = this.getFotoUrl(foto);
    },

    async eliminarFoto(id_foto) {
      if (confirm('¿Está seguro que desea eliminar esta foto?')) {
        try {
          await axios.post(`${API_BASE_URL}/elimina_foto_by_id/${id_foto}`);
          this.snackbarOk = 'Foto eliminada correctamente';
          this.snackbarOkPush = true;
          await this.recuperaFotos(this.getIdPredio);
          this.nuevo();
        } catch (error) {
          this.snackbarError = 'Error al eliminar la foto';
          this.snackbarErrorPush = true;
        }
      }
    },

    async actualiza() {
      try {
        const formData = new FormData();
        formData.append('id_foto', this.idFoto);
        formData.append('descripcion', this.form.descripcion);
        if (this.form.foto) {
          formData.append('foto', this.form.foto);
        };
        formData.append('principal', this.form.principal);
        formData.append('id_predio', this.getIdPredio);
        formData.append('fecha_registro', new Date().toISOString().split('T')[0]);
        formData.append('certificado', this.form.certificado || false);

        await axios.put(`${API_BASE_URL}/actualiza_foto/${this.idFoto}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.snackbarOk = 'Foto actualizada correctamente';
        this.snackbarOkPush = true;
        await this.recuperaFotos(this.getIdPredio);
        this.nuevo();
      } catch (error) {
        this.snackbarError = 'Error al actualizar la foto';
        this.snackbarErrorPush = true;
      }
    },

    async eliminar() {
      if (this.idFoto) {
        try {
          await axios.post(`${API_BASE_URL}/elimina_foto_by_id/${this.idFoto}`);
          this.snackbarOk = 'Foto eliminada correctamente';
          this.snackbarOkPush = true;
          await this.recuperaFotos(this.getIdPredio);
          this.nuevo();
        } catch (error) {
          this.snackbarError = 'Error al eliminar la foto';
          this.snackbarErrorPush = true;
        }
      }
    },

    nuevo() {
      this.form = {
        id_foto: null,
        descripcion: '',
        foto: null,
        fotoUrl: '',
        principal: false,
        certificado: false,
      };
      this.idFoto = null;
      this.fotoRecuperadaUrl = '';
    },

    refrescarFotos() {
      this.recuperaFotos(this.getIdPredio);
    },
  },
};
</script>

<style scoped>
.titulo-pantalla{
  color: #F1ECE7;
}
.urbano-container {
  background-color: #114358;
}
.rural-container {
  background-color: #668A4C;
}
.urbano-btn {
  background-color: #276E90;
  color: #ffffff;
}
.rural-btn {
  background-color: #4C7031;
  color: #ffffff;
}
.urbano-block {
  background-color: #F1ECE7;
  color: #114358;
}
.rural-block {
  background-color: #F1ECE7;
  color: #4C7031;
}
.centered-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  font-size: 1rem;
}
.urbano-title {
  background-color: #276E90;
  color: #F1ECE7;
  font-weight: bold;
}
.rural-title {
  background-color: #4C7031;
  color: #F1ECE7;
  font-weight: bold;
}
.custom-img {
  max-width: 400px;
  max-height: 300px;
  width: auto;
  height: auto;
  border: 2px solid #ccc;
  border-radius: 8px;
}

.foto-grid {
  border-radius: 10px;
  border: 1.5px solid #ccc;
  box-shadow: 1px 1px 8px #0002;
  object-fit: cover;
}
</style>
