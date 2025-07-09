<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Bienvenido al módulo de Planificación</h2>
        <v-btn color="primary" @click="irASolicitarTramite" class="mt-4">
          Solicitar Trámite
        </v-btn>
        <!-- Aquí el menú, reportes, etc. -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function irASolicitarTramite() {
  router.push('/solicitar-tramite')
}
</script>
