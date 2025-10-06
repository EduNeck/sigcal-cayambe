<template>
  <v-snackbar
    v-model="showUpdateNotification"
    :timeout="-1"
    color="primary"
    class="update-notification"
  >
    <div class="d-flex align-center">
      <v-icon class="mr-2">mdi-update</v-icon>
      <span>Nueva versión disponible</span>
      <v-spacer></v-spacer>
      <v-btn
        text
        @click="updateApplication"
        color="white"
      >
        Actualizar
      </v-btn>
    </div>
  </v-snackbar>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'UpdateNotification',
  setup() {
    const store = useStore();

    const showUpdateNotification = computed(() => store.state.pwa.updateAvailable);

    function updateApplication() {
      if (window.updateSW) {
        window.updateSW();
        store.commit('setPwaUpdateAvailable', false);
      }
    }

    return {
      showUpdateNotification,
      updateApplication
    };
  }
};
</script>

<style scoped>
.update-notification {
  z-index: 9999;
}
</style>