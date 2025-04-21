import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

import App from './App.vue'
import router from './router'

import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueToast)

const authStore = useAuthStore()
authStore.fetchCurrentUser()

app.mount('#app')
