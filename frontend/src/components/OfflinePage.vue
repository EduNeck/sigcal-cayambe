<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" md="6">
        <v-card class="text-center pa-5" elevation="4">
          <v-card-title class="text-h5 mb-3">
            Sin conexión a internet
          </v-card-title>
          <v-icon size="80" color="grey" class="mb-4">mdi-wifi-off</v-icon>
          <v-card-text>
            <p class="text-body-1 mb-3">
              No se puede conectar al servidor de SIGCAL Cayambe. 
              Algunas funciones están disponibles en modo offline.
            </p>
            <p class="text-body-2 text-medium-emphasis">
              Estado de la red: {{ isOnline ? 'Conectado' : 'Desconectado' }}
            </p>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn color="primary" @click="checkConnection">
              Reintentar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'OfflinePage',
  setup() {
    const store = useStore();
    const router = useRouter();
    const isOnline = computed(() => store.state.pwa.isOnline);

    function checkConnection() {
      if (navigator.onLine) {
        router.push('/');
      }
    }

    return {
      isOnline,
      checkConnection
    };
  }
};
</script>