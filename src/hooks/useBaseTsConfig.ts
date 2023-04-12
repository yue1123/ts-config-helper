import { h, ref } from 'vue'
import { useMessage, type DropdownOption } from 'naive-ui'
import { Icon } from '@iconify/vue'
import { request } from '@utils'
import json5 from 'json5'
import useSettingStore from '@store/setting'

const loadLink = (libName: string) =>
  `https://cdn.jsdelivr.net/npm/@tsconfig/${libName}@latest/tsconfig.json`

const renderIcon = (icon: string) => {
  return () => {
    return h(Icon, { icon })
  }
}
const configJsonCache = new Map<string, string>()
export function useBaseTsConfig() {
  /**
   * @link https://github.com/tsconfig/bases
   * @link loadLink https://cdn.jsdelivr.net/npm/@tsconfig/{liblabel}@latest/tsconfig.json
   */
  const settingStore = useSettingStore()
  const baseTsConfigLibOptions: DropdownOption[] = [
    {
      label: 'create-react-app',
      key: 'create-react-app',
      icon: renderIcon('vscode-icons:file-type-reactjs')
    },
    {
      label: 'cypress',
      key: 'cypress',
      icon: renderIcon('vscode-icons:file-type-cypress')
    },
    {
      label: 'deno',
      key: 'deno',
      icon: renderIcon('vscode-icons:file-type-deno')
    },
    {
      label: 'docusaurus',
      key: 'docusaurus',
      icon: renderIcon('logos:docusaurus')
    },
    {
      label: 'ember',
      key: 'ember',
      icon: renderIcon('vscode-icons:file-type-ember')
    },
    {
      label: 'esm',
      key: 'esm',
      icon: renderIcon('vscode-icons:file-type-js-official')
    },
    {
      label: 'next',
      key: 'next',
      icon: renderIcon('vscode-icons:file-type-next')
    },
    {
      label: 'node',
      key: 'node',
      icon: renderIcon('vscode-icons:file-type-node'),
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
      icon: renderIcon('vscode-icons:file-type-nuxt')
    },
    {
      key: 'react-native',
      label: 'react-native',
      icon: renderIcon('vscode-icons:file-type-reactjs')
    },
    {
      key: 'recommended',
      label: 'recommended',
      icon: renderIcon('vscode-icons:file-type-bazel-ignore')
    },
    {
      key: 'remix',
      label: 'remix',
      icon: renderIcon('ri:remixicon-fill')
    },
    {
      key: 'strictest',
      label: 'strictest',
      icon: renderIcon('openmoji:locked')
    },
    {
      key: 'svelte',
      label: 'svelte',
      icon: renderIcon('vscode-icons:file-type-svelte')
    },
    {
      key: 'taro',
      label: 'taro',
      icon: renderIcon('twemoji:glowing-star')
    },
    {
      key: 'vite-react',
      label: 'vite-react',
      icon: renderIcon('vscode-icons:file-type-vite')
    },
    {
      key: 'vue',
      label: 'vue (is coming)',
      icon: renderIcon('vscode-icons:file-type-vue'),
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
    }
  ]
  const isLoading = ref<boolean>()
  const configJson = ref<string>()
  const message = useMessage()
  const getConfigJson = (libName: string) => {
    let res
    if ((res = configJsonCache.get(libName))) return (configJson.value = res)
    isLoading.value = true
    request(loadLink(libName))
      .then((json) => {
        const config = json5.parse(json)
        // remove $schema and display property
        config['$schema'] && Reflect.deleteProperty(config, '$schema')
        config['display'] && Reflect.deleteProperty(config, 'display')
        configJson.value = json5.stringify(config, null, settingStore.editor.tabSize)
      })
      .catch((err) => {
        message.error(err.message || 'Unknown Error !!')
      })
      .finally(() => {
        isLoading.value = false
      })
  }
  return { getConfigJson, configJson, isLoading, baseTsConfigLibOptions }
}
