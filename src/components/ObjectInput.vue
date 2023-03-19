<template>
  <NDynamicInput @update:value="handleUpdate" v-model:value="data" :on-create="onCreate">
    <template #create-button-default> {{ $t('add') }} </template>
    <template #default="{ value }">
      <div class="key_value-item">
        <div v-for="(v, k) in value" role="container" class="key_value-input-container">
          <span role="label">{{ k }} : </span
          ><NInput
            @update:value="handleUpdate"
            :placeholder="props.placeholder"
            v-model:value="value[k]"
            type="text"
          />
        </div>
      </div>
    </template>
  </NDynamicInput>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { NInput, NDynamicInput } from 'naive-ui'
import { debounce, getObjectSchema, deepClone } from '@utils'

export interface Props {
  data: Record<string, any>[]
  property: any
  placeholder?: string
}
const emit = defineEmits(['update:data'])
const props = withDefaults(defineProps<Props>(), {
  placeholder: 'place input value'
})

const data = ref<Record<string, any>[]>(props.data)
const schema = getObjectSchema(props.property)
function onCreate() {
  return deepClone(schema)
}
const handleUpdate = debounce(() => {
  emit(
    'update:data',
    data
    // Object.fromEntries(
    //   data.value.reduce((resData, { key, value }) => {
    //     key && value && resData.push([key, value])
    //     return resData
    //   }, [] as [string, string[]][]) as Iterable<string[]>
    // )
  )
}, 200)
watch(
  () => props.data,
  (newValue) => {
    data.value = newValue
  }
)
</script>

<style scoped>
:deep(.n-dynamic-input-item .n-dynamic-input-item__action) {
  align-self: center;
}
.key_value-item {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  width: 100%;
}
.key_value-input-container {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}
[role='label'] {
  min-width: 80px;
  text-align: right;
}
</style>
