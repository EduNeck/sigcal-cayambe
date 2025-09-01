<template>
  <v-form @submit.prevent="login">
    <v-text-field
      v-model="usuario"
      label="Usuario"
      prepend-inner-icon="mdi-account"
      variant="outlined"
      density="compact"
      autocomplete="username"
      class="mb-4"
      :error="!!error"
      color="primary"
      required
    />
    <v-text-field
      v-model="password"
      label="Contraseña"
      type="password"
      prepend-inner-icon="mdi-lock"
      variant="outlined"
      density="compact"
      autocomplete="current-password"
      class="mb-2"
      :error="!!error"
      color="primary"
      required
    />
    <v-btn
      :loading="loading"
      block
      color="primary"
      size="large"
      rounded="xl"
      type="submit"
      class="mb-1"
    >
      Ingresar
    </v-btn>
    <v-alert v-if="error" type="error" class="mt-3" border="start" elevation="2">
      {{ error }}
    </v-alert>
  </v-form>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import API_BASE_URL from '@/config/apiConfig';

const usuario = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)
const emit = defineEmits(['login-success'])

const login = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await axios.post(
      `${API_BASE_URL}/auth/login`,
      { usuario: usuario.value, password: password.value }
    )
    if (res.data && res.data.token) {
      localStorage.setItem('token', res.data.token)
      
      // También guardamos la información del usuario si está disponible
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user))
      } else {
        // Si no hay datos de usuario, crear uno básico basado en el nombre de usuario
        const basicUser = {
          id: Date.now().toString(),
          nombre: usuario.value,
          roles: ['user']
        }
        localStorage.setItem('user', JSON.stringify(basicUser))
      }
      
      emit('login-success')
    } else {
      error.value = 'Usuario o contraseña incorrectos'
    }
  } catch (e) {
    error.value = 'Usuario o contraseña incorrectos'
  }
  loading.value = false
}
</script>
