import { createRouter, createWebHistory } from 'vue-router'
import LoginLayout from '../layout/loginLayout.vue'
import LoginSistema from '../components/seguridad/LoginSistema.vue'
import MenuIngreso from '../components/menus/MenuIngreso.vue'
import SistemaLayout from '../layout/SistemaLayout.vue'

// Página de inicio básica
const routes = [
  {
    path: '/',
    component: LoginLayout,
    children: [
      { path: '', component: LoginSistema },
      { path: '/login', component: LoginSistema },
    ]
  },
    {
    path: '/',
    component: SistemaLayout,
    children: [
      { path: '/menu-ingreso', component: MenuIngreso, meta: { requiresAuth: true } },
      //{ path: '/menu-predial', component: MenuPredial, meta: { requiresAuth: true } },      
      //{ path: '/menu-admin', component: MenuAdmin, meta: { requiresAuth: true } },


    ]
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
