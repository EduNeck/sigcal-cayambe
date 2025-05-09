<template>
  <v-app>
    <v-main>
      <v-container class="text-center">
        <h1>¡Proyecto SIGCAL funcionando con Vuetify!</h1>
        <v-btn color="primary" @click="saludar">Haz clic aquí</v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  methods: {
    saludar() {
      alert('¡Vuetify está funcionando correctamente!')
    }
  }
}
</script>
