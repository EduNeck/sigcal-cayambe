import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';
import LoginLayout from '@/layouts/LoginLayout.vue'
import SistemaLayout from '@/layouts/SistemaLayout.vue'
import LoginSistema from '@/components/seguridad/LoginSistema.vue'
import MenuIngreso from '@/components/menus/MenuIngreso.vue'
import MenuPredial from '@/components/menus/MenuPredial.vue'
import MenuAdministracion from '@/components/menus/MenuAdministracion.vue'
import visoresRoutes from './visores'
import urbanoRoutes from './urbano'
import seguridadRoutes from './seguridad' 
import parametrizacionRoutes from './parametrizacion'
import validacionesRoutes from './validaciones'
import valoracionRoutes from './valoracion'
import reportesRoutes from './reportes'

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
      { path: '/menu-predial', component: MenuPredial, meta: { requiresAuth: true } },      
      { path: '/menu-admin', component: MenuAdministracion, meta: { requiresAuth: true } },

      ...visoresRoutes,
      ...urbanoRoutes,      
      ...seguridadRoutes,
      ...parametrizacionRoutes,
      ...validacionesRoutes,
      ...valoracionRoutes,
      ...reportesRoutes,   

    ]
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Protecciones personalizadas antes de cada navegación
router.beforeEach((to, from, next) => {
  const isAuth = store.getters.isAuthenticated;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuth) {
      console.warn('🔒 Usuario no autenticado, redirigiendo al login...');
      next({ path: '/login', query: { redirect: to.fullPath } });
    } else {
      // Validación por menú
      /*console.log('Acceso permitido a la ruta:', to.path);
      console.log('Permiso Urbano:', store.getters.canAccessUrbanoMenu);
      console.log('Permiso Rural:', store.getters.canAccessRuralMenu);
      console.log('Permiso Admin:', store.getters.isAdmin);
      console.log('Permiso Valor Urb:', store.getters.canAccessValoracionUrb);
      console.log('Permiso Valor Rur:', store.getters.canAccessValoracionRur);*/

      if (to.path.includes('/menu-predial') && !store.getters.canAccessUrbanoMenu) {
        return next('/menu-ingreso');
      }
      if (to.path.includes('/menu-rural') && !store.getters.canAccessRuralMenu) {
        return next('/menu-ingreso');
      }
      if (to.path.includes('/menu-admin') && !store.getters.isAdmin) {
        return next('/menu-ingreso');
      }      
      if (to.path.includes('/valoracion') &&
         !(store.getters.canAccessValoracionUrb || store.getters.canAccessValoracionRur)) {
        return next('/menu-ingreso');
      }

      // ✅ Acceso permitido
      return next();
    }
  } else {
    return next(); // Rutas públicas (como /login)
  }
});


export default router
