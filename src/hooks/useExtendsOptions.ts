import { useBaseTsConfig, configLibIcon, renderIcon } from './useBaseTsConfig'
import type { AutoCompleteOption } from 'naive-ui'
import useDataStore from '@store/data'
import { computed, watchEffect } from 'vue'
export function useExtendsOptions() {
  const { baseTsConfigLibOptions } = useBaseTsConfig()
  const data = useDataStore()

  return computed(() => {
    const tabConfigList = data.configList.reduce<AutoCompleteOption[]>((options, { name }) => {
      let icon = configLibIcon[name]
      options.push({
        key: name,
        label: name,
        value: name,
        icon: icon ? renderIcon(icon) : null
      })
      return options
    }, [])
    return [
      {
        type: 'group',
        key: 'user config',
        label: 'user tab config',
        children: tabConfigList
      },
      {
        type: 'group',
        key: '@tsconfig',
        label: '@tsconfig',
        children: baseTsConfigLibOptions.slice(0, -1)
      }
    ]
  })
}
