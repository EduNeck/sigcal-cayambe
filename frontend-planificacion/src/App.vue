<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
onMounted(() => {
  // Aquí puedes poner lógicas globales
})
</script>

<style>
/* Estilos globales opcionales */
</style>
