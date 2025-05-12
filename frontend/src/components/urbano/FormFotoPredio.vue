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
    </v-col>

    <v-card :class="['mb-3', 'block-color', tipoClaseBlock]" v-if="fotoRecuperadaUrl">
      <v-card-title :class="['centered-title', tipoClaseTitle]">Foto de Predio</v-card-title>
      <v-card-text>
        <v-row justify="center">
          <v-col class="d-flex justify-center">
            <v-img v-if="fotoRecuperadaUrl" :src="fotoRecuperadaUrl" class="my-4 custom-img"></v-img>
            <v-alert v-else type="warning">No hay imagen disponible</v-alert>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-row>
      <v-col cols="12">
        <v-card :class="['mb-3', 'block-color', tipoClaseBlock]">
          <v-card-title :class="['centered-title', tipoClaseTitle]">Identificación</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Descripción" v-model="form.descripcion" class="block-color" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-checkbox label="Principal" v-model="form.principal" class="block-color"></v-checkbox>
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
    <!-- Alerta -->
    <v-snackbar v-model="snackbarErrorPush" :timeout="3000" color="error" rounded="pill">
      {{ snackbarError }}
    </v-snackbar>
    <v-snackbar v-model="snackbarOkPush" :timeout="3000" color="success">
      {{ snackbarOk }}
    </v-snackbar>
    <v-snackbar v-model="snackbarNotaPush" :timeout="3000" color="info">
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
        id_foto : null,
        descripcion: '',
        foto: null,
        principal: false,
        fotoUrl: ''
      },
      fotos: [],
      id_predio: null,
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
      console.log('Id foto:', this.getIdFoto);
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
      console.log('Guardando foto...');
      const formData = new FormData();
      formData.append('descripcion', this.form.descripcion);
      formData.append('foto', this.form.foto);
      formData.append('principal', this.form.principal);
      formData.append('id_predio', this.getIdPredio);
      formData.append('fecha_registro', new Date().toISOString().split('T')[0]);

      try {
        const response = await axios.post(`${API_BASE_URL}/inserta_foto`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Respuesta del servidor:', response.data);
        this.idFoto = response.data.id_foto;
        console.log('ID de la foto guardada:', this.idFoto);
        this.snackbarOk = 'Foto guardada correctamente';
        this.snackbarOkPush = true;
      } catch (error) {
        console.error('Error al guardar la foto:', error);
        this.snackbarError = 'Error al guardar la foto';
        this.snackbarErrorPush = true;
      }
    },

    async recuperaFotos(id_predio) {
      console.log('Recuperando fotos...');
      try {
        const response = await axios.get(`${API_BASE_URL}/fotos_by_idPredio/${id_predio}`);
        const data = response.data;
        if (data.length > 0) {
          const fotosPredio = data[0]; 
          
          this.form.descripcion = fotosPredio.descripcion;
          this.form.principal = fotosPredio.principal;
          this.idFoto = fotosPredio.id_foto;
          this.setIdFoto(fotosPredio.id_foto);

          if (fotosPredio.foto) {
            // Verificar si la imagen ya está en Base64
            if (typeof fotosPredio.foto === "string") {
              this.fotoRecuperadaUrl = `data:image/png;base64,${fotosPredio.foto}`;              
            } else if (fotosPredio.foto.data) {
              // Convertir bytea a Blob y luego a URL
              const byteArray = new Uint8Array(fotosPredio.foto.data);
              const blob = new Blob([byteArray], { type: 'image/png' });
              this.fotoRecuperadaUrl = URL.createObjectURL(blob);
            }            
            this.fotoRecuperadaUrl = `data:image/png;base64,${fotosPredio.foto}`;
          } else {
            this.fotoRecuperadaUrl = '';
            this.snackbarNota = 'No se encontró una imagen asociada';
            this.snackbarNotaPush = true;
          }
        } else {
          this.snackbarNota = 'No se encontraron fotos para este predio';
          this.snackbarNotaPush = true;
          this.fotoRecuperadaUrl = '';
        }
      } catch (error) {
        console.error('Error al recuperar la foto:', error);
        this.snackbarError = 'Error al recuperar la foto';
        this.snackbarErrorPush = true;
      }
    },


    async actualiza() {
      console.log('Actualizando foto...');
      try {
        const formData = new FormData();
        formData.append('id_foto', this.idFoto);
        formData.append('descripcion', this.form.descripcion);
        formData.append('foto', this.form.foto);
        formData.append('principal', this.form.principal);
        formData.append('id_predio', this.getIdPredio);
        formData.append('fecha_registro', new Date().toISOString().split('T')[0]);
        
        const response = await axios.put(`${API_BASE_URL}/actualiza_foto/${this.idFoto}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Respuesta del servidor:', response.data);
        this.snackbarOk = 'Foto actualizada correctamente';
        this.snackbarOkPush = true;
        await this.recuperaFotos(this.id_predio);
      } catch (error) {
        console.error('Error al actualizar la foto:', error);
        this.snackbarError = 'Error al actualizar la foto';
        this.snackbarErrorPush = true;
      }
    },

    async eliminar() {
      try {
        const response = await axios.post(`${API_BASE_URL}/elimina_foto_by_id/${this.idFoto}`);
        console.log('Respuesta del servidor:', response.data);
        this.snackbarOk = 'Foto eliminada correctamente';
        this.snackbarOkPush = true;
        this.nuevo();
      } catch (error) {
        console.error('Error al eliminar la foto:', error);
        this.snackbarError = 'Error al eliminar la foto';
        this.snackbarErrorPush = true;
      }
    },

    nuevo() {
      this.form = {
        id_foto: null,
        descripcion: '',
        foto: null,
        fotoUrl: '',
        principal: false
      };
      this.idFoto = null;
      this.fotoRecuperadaUrl = '';
    }
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


</style>