import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

// Layouts y componentes base
import LoginLayout from '@/layouts/LoginLayout.vue';
import SistemaLayout from '@/layouts/SistemaLayout.vue';
import LoginSistema from '@/components/seguridad/LoginSistema.vue';
import MenuIngreso from '@/components/menus/MenuIngreso.vue';
import MenuPredial from '@/components/menus/MenuPredial.vue';
import MenuAdministracion from '@/components/menus/MenuAdministracion.vue';

// Rutas modulares
import visoresRoutes from './visores';
import urbanoRoutes from './urbano';
import seguridadRoutes from './seguridad';
import parametrizacionRoutes from './parametrizacion';
import validacionesRoutes from './validaciones';
import valoracionRoutes from './valoracion';
import reportesRoutes from './reportes';
import cemRoutes from './cem';
import consultaWsRoutes from './wsRegistro';
import geoRoutes from './geo';

// Definición de rutas
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
      ...cemRoutes,
      ...consultaWsRoutes,
      ...geoRoutes,
    ]
  }
];

// Creación del router
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guardia de navegación
router.beforeEach((to, from, next) => {
  const isAuth = store.getters.isAuthenticated;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuth) {
      console.warn('🔒 Usuario no autenticado, redirigiendo al login...');
      return next({ path: '/login', query: { redirect: to.fullPath } });
    }

    // Logs de control
    console.log('Acceso permitido a la ruta:', to.path);
    console.log('Index Permiso Urbano:', store.getters.canAccessUrbanoMenu);
    console.log('Index Permiso Rural:', store.getters.canAccessRuralMenu);
    console.log('Index Permiso Admin:', store.getters.isAdmin);
    console.log('Index Permiso Valor Urb:', store.getters.canAccessValoracionUrb);
    console.log('Index Permiso Valor Rur:', store.getters.canAccessValoracionRur);

    // Restricción para /menu-predial: debe tener acceso urbano o rural
    if (to.path.includes('/menu-predial')) {
      const accesoUrb = store.getters.canAccessUrbanoMenu;
      const accesoRur = store.getters.canAccessRuralMenu;
      if (!accesoUrb && !accesoRur) {
        return next('/menu-ingreso');
      }
    }

    // Restricción para /menu-admin: solo admin
    if (to.path.includes('/menu-admin') && !store.getters.isAdmin) {
      return next('/menu-ingreso');
    }

    // Restricción para /valoracion rutas
    if (
      to.path.includes('/valoracion') &&
      !(store.getters.canAccessValoracionUrb || store.getters.canAccessValoracionRur)
    ) {
      return next('/menu-ingreso');
    }

    // ✅ Acceso permitido
    return next();
  }

  // Rutas públicas
  return next();
});

export default router;
