<script lang="ts" setup>
import { NSpace, NInput, NButton, NScrollbar, NDropdown, NTooltip } from 'naive-ui'
import { useSchemaDataWithFilter, useOptionsFilterOptions, useBaseTsConfig } from '@hooks'
import useRuntimeStore from '@store/runtime'
import useDataStore from '@store/data'
import { debounce } from '@utils'
import OptionsCheckbox from './components/OptionsCheckbox/index.vue'
import { BIconBookmarkStar, BIconFunnel } from 'bootstrap-icons-vue'
import { ref, computed, watch, nextTick } from 'vue'
import type { FilterKey } from '@types'
import { Icon } from '@iconify/vue'
import { editor } from 'monaco-editor'
const dataStore = useDataStore()
// 当前过滤配置列表
const activeFilter = ref<FilterKey>('all')
const runtimeStore = useRuntimeStore()
// tsconfig schema json data
const { filterData, filter, allOptionsFlatKeys, allOptionsFlatKeysMap } =
  await useSchemaDataWithFilter()
// 配置过滤下拉选项
const { filterLabelMap, filterOptions } = useOptionsFilterOptions()
// 预设配置列表
const { getConfigJson, configJson, currentLoadedLibName, isLoading, baseTsConfigLibOptions } =
  useBaseTsConfig()
const handleSearch = debounce((searchKeyword: string) => {
  let hitKeysMap = Object.create(null)
  let hitCountMap = Object.create(null)
  if (searchKeyword) {
    for (const item of allOptionsFlatKeys.value) {
      if (item.indexOf(searchKeyword) !== -1) {
        hitKeysMap[item] = true
        // 计算命中个数
        hitCountMap[item] = 1
        const keys = item.split('.')
        if (keys.length > 0) {
          keys.forEach((splitKey, index) => {
            const _splitKey = index > 0 ? [keys[index - 1], splitKey].join('.') : splitKey
            let count = hitCountMap[_splitKey] || 0
            hitCountMap[_splitKey] = hitCountMap[_splitKey] ? count + 1 : 1
          })
        }
      }
    }
    runtimeStore.searchHitKeysCountMap = hitCountMap
    runtimeStore.searchHitKeysMap = hitKeysMap
  } else {
    runtimeStore.resetHitKeysMap(runtimeStore, null)
  }
}, 300)

const searchResult = computed(() => {
  return runtimeStore.searchHitKeysMap ? Object.keys(runtimeStore.searchHitKeysMap).length : 0
})

function handleChangeFilterType(type: FilterKey) {
  activeFilter.value = type
  filter(type)
}

watch(
  () => configJson.value,
  (newValue) => {
    if (newValue) {
      if (!dataStore.configList.some((item) => item.name === currentLoadedLibName.value)) {
        dataStore.addConfigTab(currentLoadedLibName.value)
      } else {
        dataStore.currentConfigName = currentLoadedLibName.value
      }
      nextTick(() =>
        dataStore.dispatchConfigWithJsonString(newValue, allOptionsFlatKeysMap, true)
      )
    }
  }
)
</script>
<template>
  <div class="flex flex-col">
    <NSpace
      class="pb-2"
      style="background: var(--n-color); padding: 15px 24px 0 30px"
      :size="15"
      vertical
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Icon icon="bi:ui-checks-grid" />
          <span>{{ filterLabelMap[activeFilter] }}</span>
        </div>
        <div class="flex items-center">
          <NDropdown
            placement="bottom-end"
            trigger="click"
            @select="getConfigJson"
            :options="baseTsConfigLibOptions"
          >
            <NTooltip placement="bottom" trigger="hover">
              <template #trigger>
                <NButton :loading="isLoading" quaternary size="small">
                  <template #icon>
                    <BIconBookmarkStar />
                  </template>
                </NButton>
              </template>
              {{ $t('sidebar.presetConfig') }}
            </NTooltip>
          </NDropdown>
          <NDropdown
            placement="bottom-end"
            @select="handleChangeFilterType"
            :value="activeFilter"
            trigger="click"
            :options="filterOptions"
          >
            <NTooltip placement="bottom" trigger="hover">
              <template #trigger>
                <NButton quaternary size="small">
                  <template #icon>
                    <BIconFunnel />
                  </template>
                </NButton>
              </template>
              {{ $t('sidebar.configFilter') }}
            </NTooltip>
          </NDropdown>
        </div>
      </div>
      <NInput
        clear
        @input="handleSearch"
        :placeholder="$t('config.searchConfig', { type: filterLabelMap[activeFilter] })"
      >
        <template #suffix>
          <div
            :style="{
              height: '25px',
              lineHeight: '25px',
              opacity: runtimeStore.searchHitKeysMap ? 1 : 0
            }"
          >
            {{
              $t('sidebar.result', {
                count: searchResult
              })
            }}
          </div>
        </template>
      </NInput>
    </NSpace>
    <NScrollbar style="padding: 15px 24px 15px 30px; height: calc(100vh - 64px - 92px)">
      <OptionsCheckbox id="J_Options_Container" :level="0" :data="filterData" />
    </NScrollbar>
  </div>
</template>
