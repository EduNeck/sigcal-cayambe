import { createRouter, createWebHistory } from 'vue-router'
import LoginLayout from '../layout/loginLayout.vue'
import LoginSisteam from '../components/seguridad/LoginSistema.vue'

// Página de inicio básica
const routes = [
  {
    path: '/',
    component: LoginLayout,
    children: [
      { path: '', component: LoginSisteam },
    ]

  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
