<template>
  <NCheckboxGroup
    v-model:value="store.selectedKeys"
    :style="{ paddingLeft: `${props.level >= 1 ? 18 : 0}px` }"
    @update:value="handleChange"
  >
    <template v-for="(item, i) in props.data">
      <template v-if="item.children.length">
        <NCollapse style="margin-top: 10px" :key="i">
          <NCollapseItem :title="item.label">
            <MyCheckbox :level="props.level + 1" :data="item.children" />
          </NCollapseItem>
        </NCollapse>
        <NDivider />
      </template>
      <template v-else>
        <NSpace
          v-if="!runtimeStore.searchHitKeysMap || runtimeStore.searchHitKeysMap?.[item.key]"
          :key="i"
          ><NCheckbox :value="item.key" :label="item.label"
        /></NSpace>
      </template>
    </template>
  </NCheckboxGroup>
</template>

<script setup lang="ts">
import { NSpace, NDivider, NCheckbox, NCollapse, NCollapseItem, NCheckboxGroup } from 'naive-ui'
import type { Options } from '../types'
import useStore from '@store/data'
import useRuntimeStore from '@store/runtime'
import { deletePropertyByPath } from '../utils'

export interface Props {
  data: Options[]
  level: number
}
type eventValue = {
  actionType: 'check' | 'uncheck'
  value: string | number
}

const runtimeStore = useRuntimeStore()
const props = defineProps<Props>()
const store = useStore()
function handleChange(_e: any, { actionType, value: path }: eventValue) {
  const item = props.data.find((item) => item.key === path)
  if (item && actionType === 'check' && item.default !== undefined) {
    store.rawConfig[path] = item.default
  } else if (actionType === 'uncheck') {
    deletePropertyByPath(store.rawConfig, [path as string])
  }
}
</script>

<script lang="ts">
export default {
  name: 'MyCheckbox'
}
</script>

<style scoped>
:deep(.n-divider:not(.n-divider--vertical)) {
  margin-top: 12px;
  margin-bottom: 12px;
}
:deep(.n-collapse-item-arrow) {
  margin-right: 10px !important;
}
:deep(.n-collapse .n-collapse-item .n-collapse-item) {
  margin-left: 0;
}
</style>
