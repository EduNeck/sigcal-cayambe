import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import vuetify from './plugins/vuetify'
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;


const app = createApp(App)
app.use(router)
app.use(vuetify)
app.use(store)
app.mount('#app')
