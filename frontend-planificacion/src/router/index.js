import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SolicitarTramite from '../components/SolicitarTramite.vue'
import GeneraReportes from '../components/GeneraReportes.vue'
import ReporteIRM from '../components/ReporteIRM.vue'
import ReporteIcus from '../components/ReporteIcus.vue'
import BusquedaIRM from '../components/BusquedaIRM.vue'
import BusquedaICUS from '../components/BusquedaICUS.vue'
import CrearIcus from '../components/CrearIcus.vue'


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
    path: '/reporte-icus/:id?',
    name: 'ReporteIcus',
    component: ReporteIcus,
    props: true
  },
  {
    path: '/crear-icus',
    name: 'CrearIcus',
    component: CrearIcus,
    meta: { requiresAuth: true }
  },
  {
    path: '/busqueda-irm',
    name: 'BusquedaIRM',
    component: BusquedaIRM,
    meta: { requiresAuth: true }
  },
  {
    path: '/busqueda-icus',
    name: 'BusquedaICUS',
    component: BusquedaICUS,
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
