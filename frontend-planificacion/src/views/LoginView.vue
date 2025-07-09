<template>
  <v-container class="fill-height d-flex align-center justify-center" style="background: linear-gradient(120deg, #d1eaff, #fafafa)">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card elevation="10" class="pa-7 rounded-2xl">
          <v-card-title class="text-center text-primary text-h5 font-weight-bold mb-4">
            Acceso a Planificación
          </v-card-title>
          <Login @login-success="onLoginSuccess" />
          <v-divider class="my-5" />
          <div class="text-center">
            <div class="mb-2 mt-3">
              <span class="text-secondary text-h6 font-weight-bold" style="letter-spacing: 2px;">SOLICITAR TRÁMITE</span>
            </div>
            <v-btn
              color="secondary"
              variant="outlined"
              prepend-icon="mdi-file-document-edit"
              size="large"
              rounded="xl"
              @click="goSolicitarTramite"
              class="mt-1"
            >
              Ingresar
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import Login from '../components/Login.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

function onLoginSuccess() {
  router.push('/')
}
function goSolicitarTramite() {
  router.push('/solicitar-tramite')
}
</script>
