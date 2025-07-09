<template>
  <v-form @submit.prevent="login" ref="loginForm">
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
      'http://localhost:4001/api/auth/login',
      { usuario: usuario.value, password: password.value }
    )
    if (res.data && res.data.token) {
      localStorage.setItem('token', res.data.token)
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
