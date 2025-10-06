import { defineStore } from 'pinia';

export const usePwaStore = defineStore('pwa', {
  state: () => ({
    updateAvailable: false,
    registration: null,
    isOnline: navigator.onLine,
    offlineReady: false
  }),
  
  actions: {
    setUpdateAvailable(value) {
      this.updateAvailable = value;
    },
    
    setRegistration(registration) {
      this.registration = registration;
    },
    
    setOfflineReady(value) {
      this.offlineReady = value;
    },
    
    updateNetworkStatus(status) {
      this.isOnline = status;
    },
    
    async refreshApp() {
      if (this.registration && this.registration.waiting) {
        // Send message to service worker to skip waiting and activate new version
        this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      
      // Reload the page to ensure everything is fresh
      window.location.reload();
    }
  }
});