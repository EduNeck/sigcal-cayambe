import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SolicitarTramite from '../components/SolicitarTramite.vue'
import GeneraReportes from '../components/GeneraReportes.vue'
import ReporteIRM from '../components/ReporteIRM.vue'
import ReporteIcus from '../components/ReporteIcus.vue'
import BusquedaTitular from '../components/BusquedaTitular.vue'

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
    path: '/reporte-irm/:claveCatastral?',
    name: 'ReporteIRM',
    component: ReporteIRM,
    props: true
  },
  {
    path: '/reporte-icus',
    name: 'ReporteIcus',
    component: ReporteIcus,
  },
  {
    path: '/busqueda-titular',
    name: 'BusquedaTitular',
    component: BusquedaTitular,
    meta: { requiresAuth: true }
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
