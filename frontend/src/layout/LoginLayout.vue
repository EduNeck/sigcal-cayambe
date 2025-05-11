<template>
    <v-container fill-height class="background-login d-flex flex-column justify-center align-center no-padding">
      <v-card max-width="550" class="card-login elevation-12">
  
        <!-- Logo y títulos -->
        <v-card-title class="text-center">
          <v-img
            :src="logoSrc"
            height="80"
            width="80"
            class="mb-4 mx-auto"
          ></v-img>
          <h2 class="municipio-name">{{ organizationName }}</h2>
          <h4 class="system-name">{{ systemName }}</h4>
        </v-card-title>
  
        <v-divider></v-divider>
         
        <router-view />
  
        <v-divider></v-divider>
  
        <!-- Sistema y Año -->
        <v-card-text class="text-center text-caption mt-2">
          {{ systemName }} © {{ currentYear }}
        </v-card-text>
  
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { textVariables } from '@/config/textVariables';
  import logo from '@/assets/logo_ventana.png';
  import fallbackLogo from '@/assets/logo_ventana.png';

  export default {
    name: 'LoginLayout',
    data() {
      return {
        currentYear: new Date().getFullYear(),
        logoSrc: logo,
        fallbackLogo
      };
    },
    computed: {
      organizationName() {
        return textVariables.general.organizationName;
      },
      systemName() {
        return textVariables.general.systemName;
      }
    }
  };
  </script>
  
  <style scoped>
  .background-login {
    background-color: #E0E0E0 !important;
    background-size: cover;
    background-position: center;
    min-height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .card-login {
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 20px;
  }
  
  .municipio-name {
    color: #2E3A59;
    font-weight: bold;
    font-size: 1.6rem;
    margin-bottom: 4px;
    text-align: center;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  
  .system-name {
    color: #4C4C4C;
    font-size: 1.1rem;
    text-align: center;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: break-word;
  }
  
  /* Responsive */
  @media (max-width: 600px) {
    .municipio-name {
      font-size: 1.2rem;
    }
    .system-name {
      font-size: 1rem;
    }
  }
  </style>
  