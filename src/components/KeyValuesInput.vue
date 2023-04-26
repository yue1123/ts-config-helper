<template>
  <NSpace v-auto-animate vertical>
    <NSpace v-for="(item, i) in data" :key="i">
      <NInput
        :placeholder="keyDesc"
        style="min-width: 170px"
        @keyup="handleUpdate"
        @blur="handleUpdate"
        v-model:value="item.key"
      ></NInput>
      <NDynamicTags
        size="large"
        :value="item.value"
        :render-tag="(tag:string,index:number) => renderTag(tag,index,item)"
        @update:value="(event: any) => handleArrayDataItemCheck(event, item)"
      />
    </NSpace>
  </NSpace>
  <div class="create-button mt-2" role="container">
    <NButton @click="handleCreate" dashed style="width: 100%">{{ $t('add') }}</NButton>
  </div>
</template>

<script lang="ts" setup>
import { NInput, NSpace, NDynamicTags, NTag, NButton, useMessage } from 'naive-ui'
import { withDefaults, ref, watch, h } from 'vue'
import { debounce } from '@utils'
export interface Props {
  data?: Record<string, any>
  keyDesc: string
  valueDesc: string
}
interface KeyValues {
  key: string
  value: string[]
}
const message = useMessage()
const props = withDefaults(defineProps<Props>(), {
  keyDesc: 'key',
  valueDesc: 'value'
})
const dataValue = keyValuesToObjectKeyValues(props.data || {})
const defaultValueGetter = () => {
  return { key: '', value: [] }
}
const data = ref<KeyValues[]>(dataValue.length ? dataValue : [defaultValueGetter()])
const emit = defineEmits(['update:data'])
const handleUpdate = debounce(() => {
  emit(
    'update:data',
    Object.fromEntries(
      data.value.reduce((resData, { key, value }) => {
        key && value && resData.push([key, value])
        return resData
      }, [] as [string, string[]][]) as Iterable<string[]>
    )
  )
}, 200)
// listen data change and convert it to object key value
watch(
  () => props.data,
  (newValue) => {
    if (newValue) data.value = keyValuesToObjectKeyValues(newValue)
  }
)
function keyValuesToObjectKeyValues(obj: Record<string, any[]>) {
  return Object.entries(obj || {}).map(([key, value]: [string, any[]]) => {
    return {
      key,
      value
    }
  })
}
function handleCreate() {
  data.value.push(defaultValueGetter())
}
function renderTag(tag: string, index: number, item: KeyValues) {
  return h(
    NTag,
    {
      closable: true,
      size: 'large',
      onClose: () => {
        item.value.splice(index, 1)
      }
    },
    {
      default: () => tag
    }
  )
}
function handleArrayDataItemCheck(value: string[], item: KeyValues) {
  let _value: any = value
  // check uniqueItems
  let inputItem = _value.slice().pop()
  let savedValue = item.value
  if (savedValue.indexOf(inputItem) !== -1) {
    return message.warning(`已存在 ${inputItem}`)
  }
  item.value = _value
  handleUpdate()
}
</script>

<style></style>
