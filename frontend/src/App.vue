<template>
  <v-app>
    <!-- Componente que muestra notificación de actualización disponible -->
    <update-notification />
    
    <!-- Vista principal -->
    <router-view />
    
    <!-- Mensaje de sin conexión (se mostrará solo cuando esté offline) -->
    <v-overlay 
      v-if="!isOnline && !isInOfflinePage"
      class="offline-overlay"
      color="#000000"
      opacity="0.7"
      :model-value="true"
    >
      <v-card class="pa-5 text-center">
        <v-icon size="64" color="error" class="mb-3">mdi-wifi-off</v-icon>
        <div class="text-h5 mb-3">Sin conexión a internet</div>
        <div class="text-body-1 mb-4">
          Algunas funciones pueden estar limitadas hasta que se restablezca la conexión.
        </div>
        <v-btn color="primary" @click="reloadPage">Reintentar</v-btn>
      </v-card>
    </v-overlay>
  </v-app>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import UpdateNotification from './components/UpdateNotification.vue';

export default {
  name: "App",
  components: {
    UpdateNotification
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    
    // Estado de conexión
    const isOnline = computed(() => store.getters.isOnline);
    
    // Verificar si estamos en la página offline
    const isInOfflinePage = computed(() => route.name === 'offline');
    
    // Recargar página
    const reloadPage = () => {
      window.location.reload();
    };
    
    return {
      isOnline,
      isInOfflinePage,
      reloadPage
    };
  }
};
</script>

<style>
.v-application {
  background-color: #E0E0E0 !important;
}

.v-main {
  background-color: #E0E0E0 !important;
}

html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.offline-overlay {
  z-index: 9999;
}
</style>