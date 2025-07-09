<template>
  <v-container fluid class="fill-height pa-0" style="background: linear-gradient(120deg, #e2f1fa, #fff)">
    <div class="d-flex align-center justify-center" style="height: 100vh; width: 100vw;">
      <v-card
        elevation="10"
        class="pa-7 rounded-2xl"
        max-width="400"
        width="100%"
        style="position: relative;"
      >
        <!-- Botón salir -->
        <v-btn
          icon
          color="grey-darken-1"
          variant="text"
          class="position-absolute"
          style="top: 12px; right: 12px;"
          @click="salir"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card-title class="text-center text-secondary text-h6 font-weight-bold mb-5">
          Solicitar Trámite
        </v-card-title>
        <v-form @submit.prevent="solicitarTramite" ref="formTramite">
          <v-text-field
            v-model="cedula"
            label="Cédula"
            prepend-inner-icon="mdi-card-account-details-outline"
            variant="outlined"
            density="compact"
            maxlength="10"
            required
            class="mb-3"
          />
          <v-text-field
            v-model="nombres"
            label="Nombres"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            density="compact"
            required
            class="mb-3"
          />
          <v-text-field
            v-model="claveCatastral"
            label="Clave Catastral"
            prepend-inner-icon="mdi-key-variant"
            variant="outlined"
            density="compact"
            required
            class="mb-5"
          />
          <v-btn
            color="secondary"
            block
            size="large"
            rounded="xl"
            type="submit"
            class="mb-2"
          >
            Solicitar
          </v-btn>
          <v-alert
            v-if="mensaje"
            type="success"
            class="mt-4"
            border="start"
            elevation="2"
          >
            {{ mensaje }}
          </v-alert>
        </v-form>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cedula = ref('')
const nombres = ref('')
const claveCatastral = ref('')
const mensaje = ref('')

function solicitarTramite() {
  mensaje.value = `Trámite solicitado:\nCédula: ${cedula.value}\nNombres: ${nombres.value}\nClave Catastral: ${claveCatastral.value}`
  cedula.value = ''
  nombres.value = ''
  claveCatastral.value = ''
  setTimeout(() => (mensaje.value = ''), 5000)
}

function salir() {
  router.push('/login')
}
</script>
