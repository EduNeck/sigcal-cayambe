import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { setupPWA } from './registerServiceWorker'
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Iniciar PWA
setupPWA();

// Crear router guard para gestionar estado offline
router.beforeEach((to, from, next) => {
  const isOffline = !navigator.onLine;
  const requiresConnection = to.meta.requiresConnection !== false;
  
  if (isOffline && requiresConnection && to.name !== 'offline') {
    // Redirigir a página offline si no hay conexión y la ruta requiere conexión
    next({ name: 'offline' });
  } else {
    next();
  }
});

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.use(store)
app.mount('#app')
