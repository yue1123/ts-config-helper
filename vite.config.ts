import { resolve, dirname, join } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA, type VitePWAOptions } from 'vite-plugin-pwa'
import { spaLoading } from 'vite-plugin-spa-loading'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import vueI18n from '@intlify/unplugin-vue-i18n'
import { fileURLToPath } from 'url'
// import importToCDN from 'vite-plugin-cdn-import'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const pwaOptions: Partial<VitePWAOptions> = {
    mode: 'production',
    base: '/',
    includeAssets: ['favicon.png'],
    manifest: {
      name: 'Ts Config Helper',
      short_name: 'Ts Configer',
      theme_color: '#101014',
      icons: [
        {
          src: 'pwa-128x128.png',
          sizes: '128x128',
          type: 'image/png'
        },
        {
          src: 'pwa-256x256.png',
          sizes: '256x256',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  }
  const plugins = [
    vue(),
    VitePWA(pwaOptions),
    spaLoading('svg', {
      debounce: 100,
      path: './src/assets/loading.svg',
      devEnable: true,
      tipText: 'Please stand by, source is loading...',
      cssPath: './src/styles/loading.css',
      error: {
        tip: 'New version assets unload! Try force refresh to load updating.',
        detail: false
      }
    }),
    vueI18n.vite({
      /* options */
      // locale messages resourece pre-compile option
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/modules/**')
    })
  ]
  if (env.VITE_APP_VISUALIZER_ENABLE === 'true') {
    plugins.push(
      visualizer({
        open: true,
        openOptions: {
          app: {
            name: 'chrome'
          }
        },
        filename: 'visualizer/stats.html'
      }) as any
    )
  }
  return {
    plugins,
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
  }
})
