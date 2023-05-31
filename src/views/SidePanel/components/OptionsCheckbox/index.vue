<script setup lang="ts">
import { NCheckboxGroup } from 'naive-ui'
import type { Options } from '@types'
import useStore from '@stores/data'
import { deletePropertyByPath } from '@utils'
import OptionsCheckbox from './OptionsCheckbox.vue'
export interface Props {
  data: Options[]
  level: number
}
type eventValue = {
  actionType: 'check' | 'uncheck'
  value: string | number
}

const props = defineProps<Props>()
const store = useStore()
function handleChange(_e: any, { actionType, value: path }: eventValue) {
  // const item = props.data.find((item) => item.key === path)
  // if (item && actionType === 'check' && item.default !== undefined) {
  //   // store.rawConfig[path] = item.default
  // } else
  if (actionType === 'uncheck') {
    deletePropertyByPath(store.rawConfig, [path as string])
  }
}
</script>

<template>
  <NCheckboxGroup v-model:value="store.selectedKeys" @update:value="handleChange">
    <OptionsCheckbox v-bind="props"/>
  </NCheckboxGroup>
</template>
