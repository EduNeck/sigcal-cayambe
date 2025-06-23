<template>
    <v-app class="background">
      <v-app-bar app class="app-bar" density="comfortable">
        <!-- Contenedor del logo + nombre -->
        <div class="d-flex align-center mr-auto">
          <v-img
            :src="logoSrc"
            alt="Logo"
            height="40"
            width="40"
            class="ml-3"
          ></v-img>          
        </div>
        <!-- Contenedor del usuario + logout -->
        <div class="d-flex align-center mr-3">
          <v-avatar v-if="userPhoto" size="36" class="mr-2 avatar-bordered">
            <v-img :src="`data:image/png;base64,${userPhoto}`" alt="Avatar"></v-img>
          </v-avatar>
          <span v-if="userName" class="user-name mr-2">{{ userName }}</span>
          <v-btn @click="goToConfig" color="primary" variant="plain" class="mr-2">
            <v-icon start>mdi-cog</v-icon>
          </v-btn>
          <v-btn @click="logout" color="error" variant="plain">
            <v-icon start>mdi-logout</v-icon>
            Salir
          </v-btn>
        </div>
      </v-app-bar>

      <v-main>
        <router-view />
      </v-main>
  
      <v-footer app class="footer">
        <v-col class="text-center">
          <span>SIGCAL © {{ currentYear }}</span>
        </v-col>
      </v-footer>
    </v-app>

    <v-snackbar v-model="snackbarSuccess" :timeout="3000" color="success" rounded="pill">
        {{ successMessage }}
    </v-snackbar>

    <v-snackbar v-model="snackbarError" :timeout="3000" color="error" rounded="pill">
        {{ errorMessage }}
    </v-snackbar>

  </template>
  
  <script>
    import { mapGetters } from 'vuex';
    import logo from '@/assets/logo_ventana.png';
  
  export default {
    name: 'SistemaLayout',
    data() {
      return {
        currentYear: new Date().getFullYear(),        
        successMessage: '',
        snackbarSuccess: false,
        errorMessage: '',
        snackbarError: false,
        logoSrc: logo,
        fallbackLogo: logo
      };

    },
    computed: {
      ...mapGetters(['userName', 'userPhoto'])
    },
    methods: {      
        logout() {
            this.$store.dispatch('clearUser');
            this.successMessage = '¡Sesión cerrada correctamente!';
            this.snackbarSuccess = true;

            setTimeout(() => {
                this.$router.push('/login');
            }, 1000);
        },
        goToConfig() {
            this.$router.push('/configuracion-usuario');
        }
    },

  };
  </script>
  
  <style scoped>
  .background {    
    min-height: 100vh;
  }

  .app-bar {
    background-color: #383838;
    color: #000000;
  }
  .footer {
    background-color: #383838;
  }
  .title-responsive {
    color: #000000;
    flex: 18;
    font-size: 1.5rem;
    max-width: 70%;
  }
  .user-name {
    margin-left: 10px;
    color: #484e48cc;
    font-size: 1.1rem;
  }
  .text-center {
    text-align: center;
    color: #ffffff; 
  }
  .avatar-bordered {
    border: 2px solid #1976d2;
    box-shadow: 0 0 4px #1976d233;
  }
  </style>
