<template>
  <v-container class="d-flex justify-center align-center fill-height" fluid>
    <v-card class="pa-8 rounded-xl elevation-10" max-width="420" width="100%">
      <v-card-title class="text-h5 font-weight-bold text-primary mb-2">
        <v-icon start class="mr-2">mdi-lock</v-icon>
        Configuración
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="claveActual"
            label="Clave actual"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="togglePassword"
            variant="outlined"
            density="compact"
            class="mb-4"
            required
          ></v-text-field>
          <v-text-field
            v-model="claveNueva"
            label="Nueva clave"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-reset"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="togglePassword"
            variant="outlined"
            density="compact"
            class="mb-4"
            required
          ></v-text-field>
          <v-text-field
            v-model="claveConfirmar"
            label="Confirmar nueva clave"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-check"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="togglePassword"
            variant="outlined"
            density="compact"
            class="mb-4"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-center mt-4">
        <v-btn color="primary" @click="aceptar" class="me-2" variant="elevated" rounded>
          <v-icon start>mdi-check</v-icon>
          Aceptar
        </v-btn>
        <v-btn color="grey-darken-1" @click="salir" variant="text" rounded>
          <v-icon start>mdi-close</v-icon>
          Cancelar
        </v-btn>
      </v-card-actions>
      <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3500" rounded="pill">
        {{ snackbarMsg }}
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import API_BASE_URL from '@/config/apiConfig';

export default {
  name: 'ConfiguracionUsuario',
  data() {
    return {
      valid: false,
      claveActual: '',
      claveNueva: '',
      claveConfirmar: '',
      showPassword: false,
      snackbar: false,
      snackbarColor: 'success',
      snackbarMsg: ''
    };
  },
  computed: {
    ...mapGetters(['userName', 'userLogin']),
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async aceptar() {
      if (this.claveNueva !== this.claveConfirmar) {
        this.snackbarColor = 'error';
        this.snackbarMsg = 'Las claves no coinciden';
        this.snackbar = true;
        return;
      }
      if (!this.claveActual || !this.claveNueva) {
        this.snackbarColor = 'error';
        this.snackbarMsg = 'Todos los campos son obligatorios';
        this.snackbar = true;
        return;
      }
      try {
        console.log('Actualizando clave para el usuario:', this.userLogin);
        const response = await axios.put(`${API_BASE_URL}/actualizarClaveUsuario`, {
          login: this.userLogin,
          claveAnterior: this.claveActual,
          claveNueva: this.claveNueva
        });
        if (response.data.success) {
          this.snackbarColor = 'success';
          this.snackbarMsg = 'Contraseña actualizada correctamente. Cerrando sesión...';
          this.snackbar = true;
          this.claveActual = '';
          this.claveNueva = '';
          this.claveConfirmar = '';
          // Cerrar sesión tras un breve delay
          setTimeout(() => {
            this.$store.dispatch('clearUser');
            this.$router.push('/login');
          }, 1200);
        } else {
          this.snackbarColor = 'error';
          this.snackbarMsg = response.data.error || 'Error al actualizar la contraseña';
          this.snackbar = true;
        }
      } catch (err) {
        this.snackbarColor = 'error';
        this.snackbarMsg = err.response?.data?.error || 'Error al actualizar la contraseña';
        this.snackbar = true;
      }
    },
    salir() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
  font-size: 1.3rem;
}
</style>
