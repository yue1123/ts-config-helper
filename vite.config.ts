import { resolve, join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@themeVars': resolve(__dirname, './src/styles/theme.module.scss'),
      '@layout': resolve(__dirname, './src/layout'),
      '@pages': resolve(__dirname, './src/pages'),
      '@components': join(__dirname, 'src/components/'),
      '@i18n': join(__dirname, 'src/i18n/'),
      '@utils': join(__dirname, 'src/utils/'),
      '@router': join(__dirname, 'src/router/'),
      '@store': join(__dirname, 'src/store/'),
      '@api': join(__dirname, 'src/api/'),
      '@styles': join(__dirname, 'src/styles/'),
      '@constants': join(__dirname, 'src/constants/'),
      '@hooks': join(__dirname, 'src/hooks/'),
      '@static': join(__dirname, 'src/static/'),
      '@types': join(__dirname, 'src/types/'),
      '@plugins': join(__dirname, 'src/plugins/')
    }
  }
})
