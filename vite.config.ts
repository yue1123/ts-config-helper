import { resolve, join } from 'node:path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { spaLoading } from 'vite-plugin-spa-loading'

import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/ts-config-helper/',
  plugins: [
    vue(),
    VitePWA(),
    spaLoading('svg', {
      debounce: 100,
      path: './src/assets/loading.svg',
      devEnable: true
    })
  ],
  define: {
    process: process
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src/'),
      '@themeVars': resolve(__dirname, './src/styles/theme.module.scss'),
      '@layout': resolve(__dirname, './src/layout'),
      '@views': resolve(__dirname, './src/views'),
      '@components': join(__dirname, 'src/components/'),
      '@i18n': join(__dirname, 'src/i18n/'),
      '@utils': join(__dirname, 'src/utils/'),
      '@router': join(__dirname, 'src/router/'),
      '@store': join(__dirname, 'src/store/'),
      '@api': join(__dirname, 'src/api/'),
      '@modules': join(__dirname, 'src/modules/'),
      '@styles': join(__dirname, 'src/styles/'),
      '@constants': join(__dirname, 'src/constants/'),
      '@hooks': join(__dirname, 'src/hooks/'),
      '@static': join(__dirname, 'src/static/'),
      '@types': join(__dirname, 'src/types/'),
      '@plugins': join(__dirname, 'src/plugins/'),
      '@package': join(__dirname, './package.json'),
      '@schema': join(__dirname, 'src/schema/')
    }
  }
})
