import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { setupI18n } from '@i18n'
import './modules/monaco'
import './assets/main.css'
import 'highlight.js/styles/base16/github.css'

const app = createApp(App)
const store = createPinia()
const i18n = setupI18n()

app.use(i18n)
app.use(store)
app.mount('#app')
