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
        icon: icon ? renderIcon(icon) : renderIcon('mdi:code-json')
      })
      return options
    }, [])

    return [
      {
        type: 'group',
        key: 'user config',
        label: 'user tab config',
        children: tabConfigList.filter((item) => item.label !== data.currentConfigName)
      },
      {
        type: 'group',
        key: '@tsconfig',
        label: '@tsconfig',
        children: baseTsConfigLibOptions
          .slice(0, -1)
          .reduce<AutoCompleteOption[]>((total, current) => {
            if (current.children) {
              total.push(
                ...(current.children.map((item) => {
                  item.icon = current.icon
                  return item
                }) as any)
              )
            } else {
              total.push(current as any)
            }
            return total
          }, [])
      }
    ]
  })
}
