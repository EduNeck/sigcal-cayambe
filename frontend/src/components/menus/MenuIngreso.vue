<template>
  <v-container fill-height class="d-flex flex-column justify-center align-center no-padding">   
    <v-card class="card-style custom-background mt-16" elevation="16">
      <v-card-title class="pb-0 d-flex justify-center title-background">
        <h3>MENU</h3>
      </v-card-title>

      <v-card-subtitle class="text-center">
        Bienvenido, {{ userName }}
      </v-card-subtitle>

      <v-container fluid>
        <v-row align="center" justify="center">
          <!-- Botón Urbano -->
          <v-col cols="auto" class="mb-2 d-flex flex-column align-items-center">
            <v-img :src="logoSrcUrbano" height="175" width="250" class="mb-2" />
            <v-btn
              :disabled="!canAccessUrbano"
              color="#114358"
              density="compact"
              style="color: white;"
              @click="ingresoUrbano"
            >
              URBANO
            </v-btn>
          </v-col>

          <!-- Botón Rural -->
          <v-col cols="auto" class="mb-2 d-flex flex-column align-items-center">
            <v-img :src="logoSrcRural" height="175" width="250" class="mb-2" />
            <v-btn 
              :disabled="!canAccessRural" 
              color="#668A4C" 
              density="compact" 
              style="color: white;" 
              @click="ingresoRural"
            >
              RURAL
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-divider></v-divider>

      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="auto" class="mb-2 d-flex flex-column align-items-center">            
            <v-btn 
              :disabled="!userAdmin"
              color="#6E6E6E" 
              density="compact" 
              style="color: white;" 
              @click="$router.push('/menu-admin')"
            >
              ADMINISTRACIÓN
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import logo_urbano from '@/assets/login-urbano.png';
import logo_rural from '@/assets/login-rural.png';

export default {
  name: 'MenuIngreso',

  data() {
    return {
      logoSrcUrbano: logo_urbano,
      fallbackLogoUrbano: logo_urbano,
      logoSrcRural: logo_rural,
      fallbackLogoRural: logo_rural
    };
  },
  
  computed: {
    ...mapGetters([
      'userName',
      'userLogin',
      'userTypePrimario',
      'userTypeSecundario',
      'userAdmin'
    ]),
    canAccessUrbano() {
      return this.userTypePrimario === 'U' || this.userTypeSecundario === 'U';
    },
    canAccessRural() {
      return this.userTypePrimario === 'R' || this.userTypeSecundario === 'R';
    }
  },
  methods: {
    ingresoUrbano() {
      this.$store.commit('setTipoPredio', 1);
      this.$router.push('/menu-predial');
      
    },
    ingresoRural() {
      this.$store.commit('setTipoPredio', 2);
      this.$router.push('/menu-predial');
    }
  },
  created() {
    console.log('Usuario logueado:', this.userLogin);
    console.log('Nombre del usuario:', this.userName);
    console.log('Tipo primario:', this.userTypePrimario);
    console.log('Tipo secundario:', this.userTypeSecundario);
    console.log('Es admin:', this.userAdmin);
  }
};
</script>


<style scoped>
.custom-background {
  background-color: #A9A9A9; 
}
.card-style {  
  border-radius: 4px; 
  border: 0.5px solid #090909;
}
h3 {
  color: #ffffff;
  font-size: 2vw; 
}
</style>
