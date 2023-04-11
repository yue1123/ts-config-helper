import { baseTsConfigLibName } from '@constants'
import {} from '@utils'
import { NIcon } from 'naive-ui'
import { h } from 'vue'
import { Icon } from '@iconify/vue'

type BaseTsConfigLibNameList = (typeof baseTsConfigLibName)[number]['name']

const loadLink = (libName: BaseTsConfigLibNameList) =>
  `https://cdn.jsdelivr.net/npm/@tsconfig/${libName}@latest/tsconfig.json`

const renderIcon = (icon: string) => {
  return () => {
    return h(Icon, { icon })
  }
}
export function useBaseTsConfig() {
  const baseTsConfigOptions = baseTsConfigLibName.map((item) => ({
    label: item.name,
    key: item.name,
    icon: renderIcon(item.icon || 'vscode-icons:file-type-next')
  }))
  return { baseTsConfigOptions }
}
