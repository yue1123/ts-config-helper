import { h, ref } from 'vue'
import { useMessage, NButton, type DropdownOption } from 'naive-ui'
import { Icon } from '@iconify/vue'
import { request } from '@utils'
import json5 from 'json5'
import useSettingStore from '@store/setting'
import { useI18n } from 'vue-i18n'

const loadLink = (libName: string) =>
  `https://cdn.jsdelivr.net/npm/@tsconfig/${libName}@latest/tsconfig.json`

const renderIcon = (icon: string) => {
  return () => {
    return h(Icon, { icon })
  }
}
const configJsonCache = new Map<string, string>()
export const configLibIcon: Record<string, string> = {
  'create-react-app': 'vscode-icons:file-type-reactjs',
  cypress: 'vscode-icons:file-type-cypress',
  deno: 'vscode-icons:file-type-deno',
  docusaurus: 'logos:docusaurus',
  ember: 'vscode-icons:file-type-ember',
  esm: 'vscode-icons:file-type-js-official',
  next: 'vscode-icons:file-type-next',
  node: 'vscode-icons:file-type-node',
  'node-lts': 'vscode-icons:file-type-node',
  node10: 'vscode-icons:file-type-node',
  node12: 'vscode-icons:file-type-node',
  node14: 'vscode-icons:file-type-node',
  node16: 'vscode-icons:file-type-node',
  node17: 'vscode-icons:file-type-node',
  node18: 'vscode-icons:file-type-node',
  nuxt: 'vscode-icons:file-type-nuxt',
  'vite-react': 'vscode-icons:file-type-vite',
  vue: 'vscode-icons:file-type-vue',
  'react-native': 'vscode-icons:file-type-reactjs',
  recommended: 'vscode-icons:file-type-bazel-ignore',
  remix: 'ri:remixicon-fill',
  strictest: 'openmoji:locked',
  svelte: 'vscode-icons:file-type-svelte',
  taro: 'twemoji:glowing-star'
}
export function useBaseTsConfig() {
  /**
   * @link https://github.com/tsconfig/bases
   * @link loadLink https://cdn.jsdelivr.net/npm/@tsconfig/{liblabel}@latest/tsconfig.json
   */
  const { t } = useI18n()
  const settingStore = useSettingStore()
  const baseTsConfigLibOptions: DropdownOption[] = [
    {
      label: 'create-react-app',
      key: 'create-react-app',
      icon: renderIcon(configLibIcon['create-react-app'])
    },
    {
      label: 'cypress',
      key: 'cypress',
      icon: renderIcon(configLibIcon['cypress'])
    },
    {
      label: 'deno',
      key: 'deno',
      icon: renderIcon(configLibIcon['deno'])
    },
    {
      label: 'docusaurus',
      key: 'docusaurus',
      icon: renderIcon(configLibIcon['docusaurus'])
    },
    {
      label: 'ember',
      key: 'ember',
      icon: renderIcon(configLibIcon['ember'])
    },
    {
      label: 'esm',
      key: 'esm',
      icon: renderIcon(configLibIcon['esm'])
    },
    {
      label: 'next',
      key: 'next',
      icon: renderIcon(configLibIcon['next'])
    },
    {
      label: 'node',
      key: 'node',
      icon: renderIcon(configLibIcon['node']),
      children: [
        {
          key: 'node-lts',
          label: 'node-lts'
        },
        {
          key: 'node10',
          label: 'node10'
        },
        {
          key: 'node12',
          label: 'node12'
        },
        {
          key: 'node14',
          label: 'node14'
        },
        {
          key: 'node16',
          label: 'node16'
        },
        {
          key: 'node17',
          label: 'node17'
        },
        {
          key: 'node18',
          label: 'node18'
        }
      ]
    },
    {
      key: 'nuxt',
      label: 'nuxt',
      icon: renderIcon(configLibIcon['nuxt'])
    },
    {
      key: 'react-native',
      label: 'react-native',
      icon: renderIcon(configLibIcon['react-native'])
    },
    {
      key: 'recommended',
      label: 'recommended',
      icon: renderIcon(configLibIcon['recommended'])
    },
    {
      key: 'remix',
      label: 'remix',
      icon: renderIcon(configLibIcon['remix'])
    },
    {
      key: 'strictest',
      label: 'strictest',
      icon: renderIcon(configLibIcon['strictest'])
    },
    {
      key: 'svelte',
      label: 'svelte',
      icon: renderIcon(configLibIcon['svelte'])
    },
    {
      key: 'taro',
      label: 'taro',
      icon: renderIcon(configLibIcon['taro'])
    },
    {
      key: 'vite-react',
      label: 'vite-react',
      icon: renderIcon(configLibIcon['vite-react'])
    },
    {
      key: 'vue',
      label: 'vue (is coming)',
      icon: renderIcon(configLibIcon['vue']),
      disabled: true,
      children: [
        {
          key: 'vue-node',
          label: 'vue-node'
        },
        {
          key: 'vue-web',
          label: 'vue-web'
        },
        {
          key: 'vue-common',
          label: 'vue-common'
        }
      ]
    },
    {
      key: 'more',
      type: 'render',
      render() {
        return h(
          NButton,
          {
            class: 'p-3',
            text: true,
            tag: 'a',
            href: 'https://github.com/tsconfig/bases',
            target: '_blank',
            type: 'primary'
          },
          () => t('sidebar.learnMore')
        )
      }
    }
  ]
  const isLoading = ref<boolean>(false)
  const configJson = ref<string>('')
  const currentLoadedLibName = ref<string>('')
  const message = useMessage()
  const timerClear = () => {
    setTimeout(() => {
      configJson.value = ''
    }, 500)
  }
  const getConfigJson = (libName: string) => {
    let res
    currentLoadedLibName.value = libName
    if ((res = configJsonCache.get(libName))) {
      configJson.value = res
      timerClear()
      return
    }
    isLoading.value = true
    request(loadLink(libName))
      .then((json) => {
        const config = json5.parse(json)
        // cache config
        // remove $schema and display property
        config['$schema'] && Reflect.deleteProperty(config, '$schema')
        // config['display'] && Reflect.deleteProperty(config, 'display')
        configJson.value = json5.stringify(config, null, settingStore.editor.tabSize)
        configJsonCache.set(libName, configJson.value)
        message.success(t('sidebar.successLoadConfig', { name: libName }), {
          duration: 3000
        })
        timerClear()
      })
      .catch((err) => {
        message.error(err.message || 'Unknown Error !!')
      })
      .finally(() => {
        isLoading.value = false
      })
  }
  return { getConfigJson, configJson, currentLoadedLibName, isLoading, baseTsConfigLibOptions }
}
