<template>
  <NDynamicInput
    :value="data"
    preset="pair"
    :key-placeholder="props.keyDesc"
    :value-placeholder="props.valueDesc"
    @update:value="handleUpdate"
  />
</template>

<script lang="ts" setup>
import { NDynamicInput } from 'naive-ui'
import { withDefaults, ref, watch } from 'vue'
import { debounce } from '@utils'
export interface Props {
  data: any
  keyDesc: string
  valueDesc: string
}
interface KeyValue {
  key: string
  value: string
}
const data = ref()
const props = withDefaults(defineProps<Props>(), {
  keyDesc: 'key',
  valueDesc: 'value'
})
// TODO: 至少保留一项
// 空的时候
const emit = defineEmits(['update:data'])
const handleUpdate = debounce((values: KeyValue[]) => {
  const res = Object.fromEntries(
    values.reduce((resData, { key, value }) => {
      key && value && resData.push([key, value])
      return resData
    }, [] as [string, string][]) as Iterable<string[]>
  )
  if (props.data?.length || Object.keys(res).length) {
    emit('update:data', res)
  }
}, 300)
watch(
  () => props.data,
  (newValue) => {
    console.log(newValue)
  }
)
</script>

<style></style>
