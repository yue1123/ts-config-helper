<script lang="ts" setup>
import {
  NSpace,
  NInput,
  NButton,
  NScrollbar,
  NDropdown,
  type DropdownOption
  // NSelect
} from 'naive-ui'
import { useSchemaDataWithFilter } from '@hooks'
import useRuntimeStore from '@store/runtime'
import { debounce } from '@utils'
import OptionsCheckbox from './components/OptionsCheckbox/index.vue'
import {
  // BIconFilterRight,
  BIconLightningFill,
  BIconBoxes,
  BIconCodeSlash,
  BIconFiletypeJs,
  BIconGrid,
  BIconStarFill,
  BIconTerminal,
  BIconStack,
  BIconBoundingBoxCircles,
  BIconLayoutTextWindowReverse,
  BIconLifePreserver,
  BIconListColumns,
  BIconPlug,
  BIconUiChecksGrid,
  BIconBookmarkStar,
  BIconFunnel
} from 'bootstrap-icons-vue'

import { ref, type Component, h, computed } from 'vue'
import type { FilterKey } from '@types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
const { filterData, filter, allOptionsFlatKeys } = await useSchemaDataWithFilter()
const runtimeStore = useRuntimeStore()

const activeFilter = ref<FilterKey>('all')
const filterLabelMap = computed<Record<FilterKey, string>>(() => ({
  all: t('sidebar.all'),
  common: t('sidebar.common'),
  typeChecking: t('sidebar.typeChecking'),
  modules: t('sidebar.modules'),
  emit: t('sidebar.emit'),
  javaScriptSupport: t('sidebar.javaScriptSupport'),
  editorSupport: t('sidebar.editorSupport'),
  interopConstraints: t('sidebar.interopConstraints'),
  backwardsCompatibility: t('sidebar.backwardsCompatibility'),
  languageEnvironment: t('sidebar.languageEnvironment'),
  compilerDiagnostics: t('sidebar.compilerDiagnostics'),
  projects: t('sidebar.projects'),
  outputFormatting: t('sidebar.outputFormatting'),
  completeness: t('sidebar.completeness')
}))
const renderIcon = (icon: Component) => {
  return () => h(icon, null)
}
const filterOptions = computed<DropdownOption[]>(() => {
  return [
    {
      label: t('sidebar.all'),
      key: 'all',
      icon: renderIcon(BIconGrid)
    },
    {
      label: t('sidebar.common'),
      key: 'common',
      icon: renderIcon(BIconStarFill)
    },
    {
      type: 'divider'
    },
    {
      label: t('sidebar.more'),
      key: 'others',
      icon: renderIcon(BIconUiChecksGrid),
      children: [
        {
          label: t('sidebar.dropdown.typeChecking'),
          key: 'typeChecking',
          icon: renderIcon(BIconLightningFill)
        },
        {
          label: t('sidebar.dropdown.modules'),
          key: 'modules',
          icon: renderIcon(BIconBoxes)
        },
        {
          label: t('sidebar.dropdown.emit'),
          key: 'emit',
          icon: renderIcon(BIconCodeSlash)
        },
        {
          label: t('sidebar.dropdown.javaScriptSupport'),
          key: 'javaScriptSupport',
          icon: renderIcon(BIconFiletypeJs)
        },
        {
          label: t('sidebar.dropdown.editorSupport'),
          key: 'editorSupport',
          icon: renderIcon(BIconLayoutTextWindowReverse)
        },
        {
          label: t('sidebar.dropdown.interopConstraints'),
          key: 'interopConstraints',
          icon: renderIcon(BIconBoundingBoxCircles)
        },
        {
          label: t('sidebar.dropdown.backwardsCompatibility'),
          key: 'backwardsCompatibility',
          icon: renderIcon(BIconPlug)
        },
        {
          label: t('sidebar.dropdown.languageEnvironment'),
          key: 'languageEnvironment',
          icon: renderIcon(BIconTerminal)
        },
        {
          label: t('sidebar.dropdown.projects'),
          key: 'projects',
          icon: renderIcon(BIconStack)
        },
        {
          label: t('sidebar.dropdown.outputFormatting'),
          key: 'outputFormatting',
          icon: renderIcon(BIconListColumns)
        },
        {
          label: t('sidebar.dropdown.completeness'),
          key: 'completeness',
          icon: renderIcon(BIconLifePreserver)
        }
      ]
    }
  ]
})

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
const configList = ['recommended.json', 'node16.json'].map((item) => {
  return {
    key: item,
    label: item
  }
})
const config = ref('recommended.json')
</script>
<template>
  <NScrollbar style="padding: 15px 24px 15px 30px; height: calc(100vh - 64px)">
    <NSpace :size="15" vertical>
      <div class="flex items-center justify-between">
        <span>{{ filterLabelMap[activeFilter] }}</span>
        <div class="flex items-center">
          <NDropdown
            placement="bottom-end"
            :value="config"
            trigger="click"
            :options="configList"
          >
            <NButton disabled quaternary size="small">
              <template #icon> <BIconBookmarkStar /> </template
            ></NButton>
          </NDropdown>
          <NDropdown
            placement="bottom-end"
            @select="handleChangeFilterType"
            :value="activeFilter"
            trigger="click"
            :options="filterOptions"
          >
            <NButton quaternary size="small">
              <template #icon> <BIconFunnel /> </template
            ></NButton>
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