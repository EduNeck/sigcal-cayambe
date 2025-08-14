import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SolicitarTramite from '../components/SolicitarTramite.vue'
import GeneraReportes from '../components/GeneraReportes.vue'
import ReporteIRM from '../components/ReporteIRM.vue'
import ReporteIcus from '../components/ReporteIcus.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  {
    path: '/',
    name: 'GeneraReportes',
    component: GeneraReportes,
    meta: { requiresAuth: true }
  },
  {
    path: '/solicitar-tramite',
    name: 'SolicitarTramite',
    component: SolicitarTramite,    
  },
  {
    path: '/reporte-irm',
    name: 'ReporteIRM',
    component: ReporteIRM,
  },
  {
    path: '/reporte-icus',
    name: 'ReporteIcus',
    component: ReporteIcus,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const loggedIn = !!localStorage.getItem('token')
  if (to.meta.requiresAuth && !loggedIn) {
    next('/login')
  } else if (to.path === '/login' && loggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
