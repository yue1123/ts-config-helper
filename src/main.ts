import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import { setupI18n } from '@i18n'
import '@modules/monaco'
import '@modules/baiduAnalysis'
import '@styles/main.css'

const app = createApp(App)
const store = createPinia()
setupI18n().then((i18n) => {
  app.use(i18n)
  app.mount('#app')
})
app.use(store)
store.use(piniaPluginPersistedstate)
