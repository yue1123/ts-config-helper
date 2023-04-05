<script lang="ts" setup>
import { NSpace, NInput, NButton, NScrollbar, NDropdown, type DropdownOption } from 'naive-ui'
import { useProperty } from '@hooks'
import useRuntimeStore from '@store/runtime'
import { debounce } from '../utils'
import OptionsCheckbox from './OptionsCheckbox.vue'
import { BIconFilterSquare } from 'bootstrap-icons-vue'
import { commonConfigurationMap } from '@constants'
import { ref } from 'vue'

const { property, allFlatPropertyKeys } = useProperty()
const runtimeStore = useRuntimeStore()

const activeFilter = ref<string>('AllConfiguration')
const filterLabelMap = {
  AllConfiguration: '所有配置项',
  CommonConfiguration: '常用配置项',
  TypeChecking: '类型检查相关配置'
}
const filterOptions: DropdownOption[] = [
  {
    label: '所有配置项',
    key: 'AllConfiguration'
  },
  {
    label: '常用配置项',
    key: 'CommonConfiguration'
  },
  {
    type: 'divider'
  },
  {
    disabled: true,
    label: '类型检查相关配置',
    key: 'TypeChecking'
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
    runtimeStore.resetHitKeysMap(runtimeStore)
  }
}, 200)
function handleChangeFilterType(type: string) {
  activeFilter.value = type
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
      <div class="flex justify-between items-center">
        <span class="font-bold">{{ filterLabelMap[activeFilter] }}</span>
        <div>
          <NDropdown
            placement="bottom-end"
            @select="handleChangeFilterType"
            :value="activeFilter"
            trigger="click"
            :options="filterOptions"
          >
            <NButton strong tertiary>
              <template #icon> <BIconFilterSquare /> </template
            ></NButton>
          </NDropdown>
        </div>
      </div>
      <NInput clear @input="handleSearch" :placeholder="$t('config.searchConfig')">
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
