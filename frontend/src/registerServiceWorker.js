import { registerSW } from 'virtual:pwa-register';
import store from './store';

export function setupPWA() {
  // Monitorear estado de la red
  const updateNetworkStatus = () => {
    store.commit('pwa/setNetworkStatus', navigator.onLine);
  };

  // Inicializar estado de red
  updateNetworkStatus();

  // Event listeners para conexión
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);

  // Registrar service worker
  const updateSW = registerSW({
    onNeedRefresh(registration) {
      store.commit('pwa/setUpdateAvailable', true);
      store.commit('pwa/setRegistration', registration);
    },
    onOfflineReady() {
      store.commit('pwa/setOfflineReady', true);
      console.log('La aplicación está lista para uso offline');
    },
    onRegisterError(error) {
      console.error('Error al registrar el service worker:', error);
    }
  });

  // Exponer función de actualización globalmente
  window.updateSW = () => {
    updateSW();
    store.commit('pwa/setUpdateAvailable', false);
  };

  return { updateSW };
}