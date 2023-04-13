<script lang="ts" setup>
import { NSpace, NInput, NButton, NScrollbar, NDropdown, NTooltip } from 'naive-ui'
import { useSchemaDataWithFilter, useOptionsFilterOptions, useBaseTsConfig } from '@hooks'
import useRuntimeStore from '@store/runtime'
import useDataStore from '@store/data'
import { debounce } from '@utils'
import OptionsCheckbox from './components/OptionsCheckbox/index.vue'
import { BIconBookmarkStar, BIconFunnel } from 'bootstrap-icons-vue'
import { ref, computed, watch } from 'vue'
import type { FilterKey } from '@types'
import { Icon } from '@iconify/vue'
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
const { getConfigJson, configJson, isLoading, baseTsConfigLibOptions } = useBaseTsConfig()
const handleSearch = debounce((searchKeyword: string) => {
  let obj = Object.create(null)
  if (searchKeyword) {
    for (const item of allOptionsFlatKeys.value) {
      if (item.indexOf(searchKeyword) !== -1) {
        obj[item] = true
      }
    }
    runtimeStore.searchHitKeysMap = obj
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
    if (newValue) dataStore.dispatchConfigWithJsonString(newValue, allOptionsFlatKeysMap)
  }
)
</script>
<template>
  <NScrollbar style="padding: 15px 24px 15px 30px; height: calc(100vh - 64px)">
    <NSpace :size="15" vertical>
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
      <OptionsCheckbox :level="0" :data="filterData" />
    </NSpace>
  </NScrollbar>
</template>
