import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import { setupI18n } from '@i18n'
import './modules/monaco'
import '@styles/main.css'
import 'highlight.js/styles/base16/github.css'

const app = createApp(App)
const store = createPinia()
const i18n = setupI18n()
store.use(piniaPluginPersistedstate)

app.use(i18n)
app.use(store)
app.mount('#app')
