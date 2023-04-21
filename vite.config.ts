import { resolve, dirname, join } from 'node:path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { spaLoading } from 'vite-plugin-spa-loading'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
// import vueI18n from '@intlify/unplugin-vue-i18n'
// import { fileURLToPath } from 'url'
// import importToCDN from 'vite-plugin-cdn-import'

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
      error: {
        tip: '🎉New version Updated! Try force refresh to load updating.',
        handler() {
          // const search = window.location.search
          // const reloadNum = +search.match(/slr=(\d+)/)?.[1] || 1
          // if (reloadNum < 3) location.reload()
        }
      }
    }),
    visualizer({
      emitFile: true,
      open: true,
      openOptions: {
        app: {
          name: 'chrome'
        }
      },
      filename: 'stats.html'
    })
    // vueI18n.vite({
    //   /* options */
    //   // locale messages resourece pre-compile option
    //   include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/modules/**')
    // })
  ],
  build: {
    rollupOptions: {
      manualChunks: {
        'monaco-editor': ['monaco-editor']
      }
    }
  },
  define: {
    __VUE_I18N_LEGACY_API__: false
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src/'),
      '@themeVars': resolve(__dirname, './src/styles/theme.module.scss'),
      '@layout': resolve(__dirname, './src/layout'),
      '@views': resolve(__dirname, './src/views'),
      '@assets': resolve(__dirname, './src/assets'),
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
