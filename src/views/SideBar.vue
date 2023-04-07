<script lang="ts" setup>
import { NSpace, NInput, NButton, NScrollbar, NDropdown, type DropdownOption } from 'naive-ui'
import { useProperty } from '@hooks'
import useRuntimeStore from '@store/runtime'
import { debounce } from '../utils'
import OptionsCheckbox from './OptionsCheckbox.vue'
import {
  BIconFilterRight,
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
  BIconUiChecksGrid
} from 'bootstrap-icons-vue'
import { filterMap } from '@constants'
import { ref, type Component, h } from 'vue'
import type { FilterKey } from '@types'

const { property, filter, allFlatPropertyKeys } = useProperty()
const runtimeStore = useRuntimeStore()

const activeFilter = ref<FilterKey>('All')
const filterLabelMap: Record<FilterKey, string> = {
  All: '所有配置项',
  common: '常用配置项',
  typeChecking: '类型检查相关配置',
  modules: '模块相关配置',
  emit: '类型生成相关配置',
  javaScriptSupport: 'Javascript 支持相关配置',
  editorSupport: '编辑器支持相关配置',
  interopConstraints: '互操作约束相关配置',
  backwardsCompatibility: '兼容性相关配置',
  languageEnvironment: '语言与环境相关配置',
  compilerDiagnostics: '编译器诊断相关配置',
  projects: '工程化相关配置',
  outputFormatting: '输出格式相关配置',
  completeness: '完整性相关配置'
}

const renderIcon = (icon: Component) => {
  return () => h(icon, null)
}
const filterOptions: DropdownOption[] = [
  {
    label: '所有配置项',
    key: 'All',
    icon: renderIcon(BIconGrid)
  },
  {
    label: '常用配置项',
    key: 'common',
    icon: renderIcon(BIconStarFill)
  },
  {
    type: 'divider'
  },
  {
    label: '分类',
    key: 'others1',
    icon: renderIcon(BIconUiChecksGrid),
    children: [
      {
        label: '类型检查',
        key: 'typeChecking',
        icon: renderIcon(BIconLightningFill)
      },
      {
        label: '模块',
        key: 'modules',
        icon: renderIcon(BIconBoxes)
      },
      {
        label: '类型生成',
        key: 'emit',
        icon: renderIcon(BIconCodeSlash)
      },
      {
        label: 'Javascript 支持',
        key: 'javaScriptSupport',
        icon: renderIcon(BIconFiletypeJs)
      },
      {
        label: '编辑器支持',
        key: 'editorSupport',
        icon: renderIcon(BIconLayoutTextWindowReverse)
      },
      {
        label: '互操作约束',
        key: 'interopConstraints',
        icon: renderIcon(BIconBoundingBoxCircles)
      },
      {
        label: '兼容性',
        key: 'backwardsCompatibility',
        icon: renderIcon(BIconPlug)
      },
      {
        label: '语言与环境',
        key: 'languageEnvironment',
        icon: renderIcon(BIconTerminal)
      },
      {
        label: '工程化',
        key: 'projects',
        icon: renderIcon(BIconStack)
      },
      {
        label: '输出格式',
        key: 'outputFormatting',
        icon: renderIcon(BIconListColumns)
      },
      {
        label: '完整性',
        key: 'completeness',
        icon: renderIcon(BIconLifePreserver)
      }
    ]
  }
]

const handleSearch = debounce((searchKeyword: string) => {
  // runtimeStore
  let obj = Object.create(null)
  if (searchKeyword) {
    for (const item of allFlatPropertyKeys) {
      if (item.indexOf(searchKeyword) !== -1) {
        obj[item] = true
      }
    }
    runtimeStore.searchHitKeysMap = obj
  } else {
    runtimeStore.resetHitKeysMap(runtimeStore, null)
  }
}, 200)
function handleChangeFilterType(type: FilterKey) {
  activeFilter.value = type
  if (type === 'All') {
    filter(type, () => true)
  } else {
    filter(type, (item: any) => {
      return (filterMap[type] as any)[item.key]
    })
  }
}
</script>
<template>
  <!-- <NLayoutSider
      collapse-mode="transform"
      :collapsed-width="0"
      :width="430"
      show-trigger="bar"
      content-style="padding:15px 24px;"
      bordered
      :native-scrollbar="false"
      :on-after-enter="handleResize"
      :on-after-leave="handleResize"
    >
      
    </NLayoutSider> -->
  <NScrollbar style="padding: 15px 24px 15px 30px; height: calc(100vh - 64px)">
    <NSpace :size="15" vertical>
      <div class="flex items-center justify-between">
        <span>{{ filterLabelMap[activeFilter] }}</span>
        <div>
          <NDropdown
            placement="bottom-end"
            @select="handleChangeFilterType"
            :value="activeFilter"
            trigger="click"
            :options="filterOptions"
          >
            <NButton quaternary size="small">
              <template #icon> <BIconFilterRight /> </template
            ></NButton>
          </NDropdown>
        </div>
      </div>
      <NInput
        :disabled="activeFilter !== 'All'"
        clear
        @input="handleSearch"
        :placeholder="$t('config.searchConfig')"
      >
        <template #suffix>
          <div
            :style="{
              height: '25px',
              lineHeight: '25px',
              opacity: runtimeStore.searchHitKeysMap ? 1 : 0
            }"
          >
            {{ runtimeStore.searchHitKeysMap && Object.keys(runtimeStore.searchHitKeysMap).length }}
            {{ $t('result') }}
          </div>
        </template>
      </NInput>
      <OptionsCheckbox :level="0" :data="property" />
    </NSpace>
  </NScrollbar>
</template>
