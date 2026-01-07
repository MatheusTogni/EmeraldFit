/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'

// PWA
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('Nova versão disponível!')
  },
  onOfflineReady() {
    console.log('App pronto para funcionar offline!')
  },
})

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
