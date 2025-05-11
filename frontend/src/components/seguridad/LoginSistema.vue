<template>
  <v-card-text>
    <v-form @submit.prevent="login">
      <v-text-field
        v-model="username"
        label="Usuario"
        prepend-icon="mdi-account"
        required
      />
      <v-text-field
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        label="Contraseña"
        prepend-icon="mdi-lock"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        required
      />
      <v-card-actions class="d-flex justify-center mt-4">
        <v-btn color="primary" variant="tonal" type="submit">
          Ingresar
        </v-btn>
      </v-card-actions>
    </v-form>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbarSuccess" color="success" timeout="3000">
      {{ successMessage }}
    </v-snackbar>
    <v-snackbar v-model="snackbarError" color="error" timeout="3000">
      {{ errorMessage }}
    </v-snackbar>
  </v-card-text>

  <v-snackbar v-model="snackbarSuccess" :timeout="3000" color="success" rounded="pill">
    {{ successMessage }}
  </v-snackbar>

  <v-snackbar v-model="snackbarError" :timeout="3000" color="error" rounded="pill">
    {{ errorMessage }}
  </v-snackbar>

</template>

<script>
import { mapActions } from 'vuex';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';


export default {
  name: 'LoginSistema',
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      snackbarSuccess: false,
      snackbarError: false,
      successMessage: '',
      errorMessage: '',
    };
  },
  methods: {
    ...mapActions(['updateUser']),

    async login() {
      console.log('Intentando login con usuario:', this.username);

      if (!this.username || !this.password) {
        this.errorMessage = 'Debe ingresar usuario y contraseña';
        this.snackbarError = true;
        return;
      }

      try {
        console.log('Enviando solicitud de autenticación al servidor...');
        const response = await axios.post(`${API_BASE_URL}/autenticarUsuario`, {
          login: this.username,
          pswd: this.password
        });

        console.log('Respuesta del servidor:', response.data);

        const data = response.data;

        if (data.success) {
          if (data.data.active === 'Y') {
            this.updateUser({
              login: data.data.login,
              name: data.data.name,
              photo: data.data.photo,
              priv_rol: data.data.priv_rol,
              priv_rol_sec: data.data.priv_rol_sec,
              priv_tipo: data.data.priv_tipo,
              priv_tipo_sec: data.data.priv_tipo_sec,
              valoraUrb: data.data.val_urbano,
              valoraRur: data.data.val_rural,
              priv_admin: data.data.priv_admin,
              active: data.data.active,
            });

            this.successMessage = '¡Sesión iniciada correctamente!';
            this.snackbarSuccess = true;

            setTimeout(() => {
              const redirect = this.$route.query.redirect || '/menu-ingreso'; 
              this.$router.push(redirect);
            }, 1000);

          } else {
            this.errorMessage = 'Usuario inactivo';
            this.snackbarError = true;
          }
        } else {
          this.errorMessage = 'Usuario o contraseña incorrectos';
          this.snackbarError = true;
        }
      } catch (error) {
        console.error('Error en la conexión:', error);
        this.errorMessage = 'Error de conexión con el servidor';
        this.snackbarError = true;
      }

    }
  },
  created() {
    // Verifica si ya está autenticado
    if (this.$store.getters.isAuthenticated) {
      const redirectPath = this.$route.query.redirect;
      if (redirectPath) {
        console.log('Usuario ya autenticado, redirigiendo a:', redirectPath);
        this.$router.push(redirectPath);
      } else {
        console.log('Usuario ya autenticado, redirigiendo al menú ingreso...');
        this.$router.push('/menu-ingreso');
      }
    }
  },

};
</script>
