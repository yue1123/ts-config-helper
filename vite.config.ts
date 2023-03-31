import { resolve, join } from 'node:path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { spaLoading } from 'vite-plugin-spa-loading'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import importToCDN from 'vite-plugin-cdn-import'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA(),
    spaLoading('svg', {
      debounce: 100,
      path: './src/assets/loading.svg',
      devEnable: true,
      tipText: 'Please stand by, source is loading...',
      css: '.loading-text{margin-top:20px}',
      onError() {
        // @ts-ignore
        const search = window.location.search
        const reloadNum = +search.match(/slr=(\d+)/)?.[1] || 1
        // @ts-ignore
        if (reloadNum < 3) window.location.search = `slt=${Date.now()}&slr=${reloadNum + 1}`
      }
    }),
    visualizer({
      emitFile: true,
      filename: 'stats.html'
    }),
    importToCDN({
      modules: [
        {
          name: 'vue',
          var: 'Vue',
          path: `https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.esm-browser.js`
        },
        {
          name: 'naive-ui',
          var: 'naive-ui',
          path: `https://cdn.jsdelivr.net/npm/naive-ui@2.34.3/es/index.js`
        },
        {
          name: 'pinia',
          var: 'pinia',
          path: `https://cdn.jsdelivr.net/npm/pinia@2.0.33/dist/pinia.esm-browser.js`
        }
      ]
    })
  ],
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
