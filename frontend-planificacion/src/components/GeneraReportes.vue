<template>
  <v-container
    fluid
    class="fill-height d-flex align-center justify-center"
    style="background: linear-gradient(120deg,#e2f1fa,#fff)"
  >
    <!-- Menú engranaje arriba a la derecha -->
    <v-menu
      location="top end"
      offset="12"
    >
      <template #activator="{ props }">
        <v-btn
          icon
          color="primary"
          class="position-absolute"
          style="top: 32px; right: 48px; z-index: 2"
          v-bind="props"
        >
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="cambiarContrasena">
          <v-list-item-title>Cambiar contraseña</v-list-item-title>
        </v-list-item>
        <v-list-item @click="cerrarSesion">
          <v-list-item-title>Salir</v-list-item-title>
        </v-list-item>
        <v-list-item
          v-if="user.rol === 'admin'"
          @click="goControlUsuarios"
        >
          <v-list-item-title>Control de usuarios</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Card principal de reportes -->
    <v-card
      elevation="10"
      class="pa-10 rounded-2xl"
      max-width="500"
      width="100%"
    >
      <v-row dense>
        <!-- Bloque 1: Regulación Municipal -->
        <v-col cols="12" class="mb-6">
          <v-sheet elevation="2" class="pa-6 rounded-xl text-center">
            <h3 class="mb-3 text-h5 font-weight-bold text-primary">
              REGULACIÓN MUNICIPAL
            </h3>
            <v-btn
              color="primary"
              size="large"
              rounded="xl"
              @click="onRegulacionMunicipal"
            >
              Generar Regulación
            </v-btn>
          </v-sheet>
        </v-col>
        <!-- Bloque 2: Certificado Usos -->
        <v-col cols="12">
          <v-sheet elevation="2" class="pa-6 rounded-xl text-center">
            <h3 class="mb-3 text-h5 font-weight-bold text-secondary">
              CERTIFICADO USOS
            </h3>
            <v-btn
              color="secondary"
              size="large"
              rounded="xl"
              @click="onCertificadoUsos"
            >
              Generar
            </v-btn>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menuOpen = ref(false)
const menuActivator = ref(null)

// Recupera el usuario desde localStorage (ajusta si usas store)
const user = computed(() => {
  const raw = localStorage.getItem('user')
  return raw ? JSON.parse(raw) : {}
})

function cambiarContrasena() {
  menuOpen.value = false
  router.push('/cambiar-contrasena')
}

function cerrarSesion() {
  menuOpen.value = false
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

function goControlUsuarios() {
  menuOpen.value = false
  router.push('/admin/usuarios')
}

function onRegulacionMunicipal() {
  // En vez de mostrar una alerta, navegar a la búsqueda de titulares
  router.push('/busqueda-titular')
}

function onCertificadoUsos() {
  // Navegar a la búsqueda de ICUS
  router.push('/busqueda-icus')
}
</script>
