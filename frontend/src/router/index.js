import { createRouter, createWebHistory } from 'vue-router'

// Página de inicio básica
const routes = [
  {
    path: '/',
    component: {
      template: '<v-container class="text-center"><h1>Página de Inicio</h1></v-container>'
    }
  },
  {
    path: '/about',
    component: {
      template: '<v-container class="text-center"><h1>Acerca de SIGCAL Cayambe</h1></v-container>'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
