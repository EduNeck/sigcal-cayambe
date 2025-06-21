<template>
  <v-container class="pa-4 fill-height">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12 form-card">
          <v-card-title class="headline primary--text text-center">Ingreso de Usuario</v-card-title>
          <!-- Botones de Acción arriba del formulario -->
          <v-card-actions class="justify-center">
            <v-btn
              v-if="!isEditing"
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="ingresaUsuario"
            >
              Guardar
            </v-btn>
            <v-btn
              v-if="isEditing"
              :disabled="!valid"
              color="warning"
              class="mr-4"
              @click="actualizaUsuario"
            >
              Actualizar
            </v-btn>
            <v-btn
              :color="form.active === 'Y' ? 'error' : 'success'"
              class="mr-4"
              @click="actualizarEstado"
            >
              {{ form.active === 'Y' ? 'Inactivar' : 'Activar' }}
            </v-btn>
            <v-btn
              :color="form.priv_admin === 'Y' ? 'error' : 'success'"
              class="mr-4"
              @click="actualizarPrivAdmin"
            >
              {{ form.priv_admin === 'Y' ? 'Quitar Admin' : 'Dar Admin' }}
            </v-btn>
            <v-btn color="error" @click="reset">Limpiar</v-btn>
            <v-btn color="primary" @click="salir">Salir</v-btn>
          </v-card-actions>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <!-- Información Básica -->
              <v-card-subtitle class="subtitle-1 primary--text">Información Básica</v-card-subtitle>
              <v-divider></v-divider>
              <v-row>
                <!-- Foto de Usuario -->
                <v-col cols="12" sm="4" class="text-center">
                  <v-img :src="form.photoUrl" v-if="form.photoUrl" class="my-4 photo-size"></v-img>
                  <v-file-input
                    label="Subir Foto"
                    prepend-icon="mdi-camera"
                    @change="onFileChange"
                    accept="image/*"
                    class="white-input"
                    outlined dense
                  ></v-file-input>
                </v-col>
                <!-- Campos de Información Básica -->
                <v-col cols="12" sm="8">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.login"
                        label="Login"
                        required
                        outlined
                        dense
                        :disabled="isEditing"
                        class="white-input full-width"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.pswd"
                        label="Contraseña"
                        type="password"
                        required
                        outlined
                        dense
                        class="white-input full-width"
                        :disabled="isEditing"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.name"
                        label="Nombre"
                        required
                        outlined
                        dense
                        class="white-input full-width"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="form.email"
                        label="Correo Electrónico"
                        type="email"
                        required
                        outlined
                        dense
                        class="white-input full-width"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        :value="form.priv_admin === 'Y' ? 'SI' : 'NO'"
                        label="Privilegio Administrador"
                        outlined
                        dense
                        class="white-input full-width"
                        :disabled="true"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <!-- Roles y Tipos de Usuario y Valoración -->
              <v-card-subtitle class="subtitle-1 primary--text">Roles y Tipos de Usuario</v-card-subtitle>
              <v-divider></v-divider>
              <v-row>
                <!-- Primera Columna de Roles -->
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="form.priv_rol"
                    :items="privRolOptions"
                    label="Rol Primario"
                    item-title="text"
                    item-value="value"
                    class="white-input full-width"
                    required
                    outlined
                    dense
                  ></v-select>
                  <v-select
                    v-model="form.priv_tipo"
                    :items="tipoUsuarioOptions"
                    label="Tipo Usuario"
                    item-title="text"
                    item-value="value"
                    class="white-input full-width"
                    required
                    outlined
                    dense
                  ></v-select>
                </v-col>
                <!-- Segunda Columna de Roles -->
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="form.priv_rol_sec"
                    :items="privRolOptions"
                    label="Rol Secundario"
                    item-title="text"
                    item-value="value"
                    class="white-input full-width"
                    required
                    outlined
                    dense
                  ></v-select>
                  <v-select
                    v-model="form.priv_tipo_sec"
                    :items="tipoUsuarioOptions"
                    label="Tipo Usuario Secundario"
                    item-title="text"
                    item-value="value"
                    class="white-input full-width"
                    required
                    outlined
                    dense
                  ></v-select>
                </v-col>
              </v-row>

              <!-- Valoración -->
              <v-card-subtitle class="subtitle-1 primary--text">Valoración</v-card-subtitle>
              <v-divider></v-divider>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-checkbox
                    v-model="form.val_urbano"
                    :true-value="'Y'"
                    :false-value="'N'"
                    label="Valoración Urbano"
                    class="white-input"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-checkbox
                    v-model="form.val_rural"
                    :true-value="'Y'"
                    :false-value="'N'"
                    label="Valoración Rural"
                    class="white-input"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="3000" color="success">
      {{ snackbarMessage }}
    </v-snackbar>
    <v-snackbar v-model="snackbarError" :timeout="3000" color="error">
      {{ snackbarErrorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'IngresoUsuario',
  data() {
    return {
      valid: false,
      form: {
        login: '',
        pswd: '',
        name: '',
        email: '',
        photo: null,
        photoUrl: '',
        active: 'Y',
        date_inactivo: null, 
        priv_admin: 'N',
        priv_rol: '',
        priv_tipo: '',
        priv_rol_sec: '',
        priv_tipo_sec: '',
        val_urbano: 'N',
        val_rural: 'N'
      },
      privRolOptions: [
        { text: 'Consulta', value: 'C' },
        { text: 'Edicion', value: 'E' },        
      ],
      tipoUsuarioOptions: [
        { text: 'Urbano', value: 'U' },
        { text: 'Rural', value: 'R' }
      ],
      isEditing: false,
      snackbar: false,
      snackbarMessage: '',
      snackbarError: false,
      snackbarErrorMessage: ''
    };
  },
  async mounted() {
    const login = this.$route.query.login;
    if (login) {
      this.isEditing = true;
      await this.recuperaUsuario(login);
    }
  },
  methods: {
    async recuperaUsuario(login) {
      console.log(' Recuperando usuario:', login);
      try {
        const response = await axios.get(`${API_BASE_URL}/recuperaUsuario/${login}`);
        const usuario = response.data;
        this.form.login = usuario.login;
        this.form.name = usuario.name;
        this.form.email = usuario.email;
        this.form.active = usuario.active;
        this.form.priv_admin = usuario.priv_admin;
        this.form.priv_rol = usuario.priv_rol;
        this.form.priv_tipo = usuario.priv_tipo;
        this.form.priv_rol_sec = usuario.priv_rol_sec;
        this.form.priv_tipo_sec = usuario.priv_tipo_sec;
        this.form.val_urbano = usuario.val_urbano;
        this.form.val_rural = usuario.val_rural;
        if (usuario.photo) {
          if (typeof usuario.photo === 'string') {
            this.form.photoUrl = `data:image/png;base64,${usuario.photo}`;
            this.form.photoOriginal = usuario.photo; // Guardar base64
          } else if (usuario.photo.data) {
            const byteArray = new Uint8Array(usuario.photo.data);
            const blob = new Blob([byteArray], { type: 'image/png' });
            this.form.photoUrl = URL.createObjectURL(blob);
            // No base64 disponible, no se guarda photoOriginal
          }
          console.log('Foto recuperada:', this.form.photoUrl);
        } else {
          this.form.photoUrl = '';
          this.form.photoOriginal = null;
        }
      } catch (error) {
        console.error('Error al recuperar el usuario:', error);
        this.snackbarErrorMessage = 'Error al recuperar el usuario';
        this.snackbarError = true;
      }
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.form.photo = file;
        this.form.photoUrl = URL.createObjectURL(file);
      }
    },
    async ingresaUsuario() {
      if (this.$refs.form.validate()) {
        console.log('Formulario válido:', this.form);
        try {
          const formData = new FormData();
          formData.append('login', this.form.login);
          formData.append('pswd', this.form.pswd);
          formData.append('name', this.form.name);
          formData.append('email', this.form.email);
          formData.append('photo', this.form.photo);
          formData.append('active', this.form.active);
          formData.append('priv_admin', this.form.priv_admin);
          formData.append('priv_rol', this.form.priv_rol || 'N');
          formData.append('priv_tipo', this.form.priv_tipo || 'N');
          formData.append('priv_rol_sec', this.form.priv_rol_sec || 'N');
          formData.append('priv_tipo_sec', this.form.priv_tipo_sec || 'N');
          formData.append('val_urbano', this.form.val_urbano || 'N');
          formData.append('val_rural', this.form.val_rural || 'N');

          console.log('Datos enviados:', JSON.stringify(this.form, null, 2));

          const response = await axios.post(`${API_BASE_URL}/ingresaUsuario`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('Usuario guardado:', response.data);
          this.snackbarMessage = 'Usuario guardado con éxito';
          this.snackbar = true;
          this.reset();
        } catch (error) {
          console.error('Error al guardar el usuario:', error.response ? error.response.data : error.message);
          this.snackbarErrorMessage = error.response ? error.response.data.error : 'Error al guardar el usuario';
          this.snackbarError = true;
        }
      }
    },
    async actualizaUsuario() {
      if (this.$refs.form.validate()) {
        console.log('Formulario válido:', this.form);
        try {
          const formData = new FormData();
          formData.append('login', this.form.login);
          formData.append('name', this.form.name);
          formData.append('email', this.form.email);
          // Si hay nueva foto, se envía; si no, se envía la original (base64)
          if (this.form.photo) {
            formData.append('photo', this.form.photo);
          } else if (this.form.photoOriginal) {
            formData.append('photo', this.form.photoOriginal);
          }
          formData.append('active', this.form.active);
          formData.append('priv_admin', this.form.priv_admin);
          formData.append('priv_rol', this.form.priv_rol || 'N');
          formData.append('priv_tipo', this.form.priv_tipo || 'N');
          formData.append('priv_rol_sec', this.form.priv_rol_sec || 'N');
          formData.append('priv_tipo_sec', this.form.priv_tipo_sec || 'N');
          formData.append('val_urbano', this.form.val_urbano|| 'N');
          formData.append('val_rural', this.form.val_rural|| 'N');
          // Solo enviar contraseña si NO está en edición
          if (!this.isEditing && this.form.pswd) {
            formData.append('pswd', this.form.pswd);
          }
          console.log('Datos enviados:', JSON.stringify(this.form, null, 2));
          console.log('val_urbano:', this.form.val_urbano);
          console.log('val_rural:', this.form.val_rural);
          const response = await axios.put(`${API_BASE_URL}/actualizaUsuario/${this.form.login}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('Usuario actualizado:', response.data);
          this.snackbarMessage = 'Usuario actualizado con éxito';
          this.snackbar = true;
          this.reset();
        } catch (error) {
          console.error('Error al actualizar el usuario:', error.response ? error.response.data : error.message);
          this.snackbarErrorMessage = error.response ? error.response.data.error : 'Error al actualizar el usuario';
          this.snackbarError = true;
        }
      }
    },

    async actualizarEstado() {
      try {
        const nuevoEstado = this.form.active === 'Y' ? 'N' : 'Y'; // Cambia el estado
        const response = await axios.put(`${API_BASE_URL}/cambiarEstadoUsuario/${this.form.login}`, {
          active: nuevoEstado // Enviamos 'N' o 'Y' como cadena
        });
        console.log(`Usuario ${nuevoEstado === 'N' ? 'inactivado' : 'activado'}:`, response.data);
        this.form.active = nuevoEstado; // Actualiza el estado en el formulario
        this.snackbarMessage = `Usuario ${nuevoEstado === 'N' ? 'inactivado' : 'activado'} con éxito`;
        this.snackbar = true;
      } catch (error) {
        console.error('Error al cambiar el estado del usuario:', error.response ? error.response.data : error.message);
        this.snackbarErrorMessage = error.response ? error.response.data.error : 'Error al cambiar el estado del usuario';
        this.snackbarError = true;
      }
    },
    async actualizarPrivAdmin() {
      try {
        const nuevoPrivAdmin = this.form.priv_admin === 'Y' ? 'N' : 'Y'; // Cambia el estado
        const response = await axios.put(`${API_BASE_URL}/cambiarPrivAdmin/${this.form.login}`, {
          priv_admin: nuevoPrivAdmin // Enviamos 'N' o 'Y' como cadena
        });
        console.log(`Permiso de administrador ${nuevoPrivAdmin === 'N' ? 'quitado' : 'otorgado'}:`, response.data);
        this.form.priv_admin = nuevoPrivAdmin; // Actualiza el estado en el formulario
        this.snackbarMessage = `Permiso de administrador ${nuevoPrivAdmin === 'N' ? 'quitado' : 'otorgado'} con éxito`;
        this.snackbar = true;
      } catch (error) {
        console.error('Error al cambiar el permiso de administrador:', error.response ? error.response.data : error.message);
        this.snackbarErrorMessage = error.response ? error.response.data.error : 'Error al cambiar el permiso de administrador';
        this.snackbarError = true;
      }
    },
    reset() {
      this.$refs.form.reset();
      this.form.photo = null;
      this.form.photoUrl = '';
      this.isEditing = false;
    },
    salir() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
.v-container {
  height: 80vh; 
}
.v-row {
  height: 50%; 
  align-items: center; 
}

.v-card {
  padding: 20px;
  background-color: #ffffff; 
}

.v-card-title {
  font-size: 24px;
  font-weight: bold;  
  color: #000000; 
}

.v-card-subtitle {
  background-color: rgb(70, 70, 70);   
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
    
}

.v-btn {
  margin-top: 20px;
}

.v-card-actions {
  margin-top: 20px;
}

.my-4 {
  margin: 16px 0;
}

.photo-size {
  width: 150px; 
  height: 150px; 
  object-fit: cover; 
}
</style>