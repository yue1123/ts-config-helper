<template>
  <NDynamicInput @update:value="handleUpdate" v-model:value="data" :on-create="onCreate">
    <template #create-button-default> {{ $t('add') }} </template>
    <template #default="{ value }">
      <div class="key_value-item">
        <div v-for="(v, k) in value" :key="k" role="container" class="key_value-input-container">
          <NInput disabled role="label" :value="k as unknown as string" />
          <span>:</span>
          <NInput
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
import { computed, nextTick, ref, watch } from 'vue'
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
  emit('update:data', deepClone(data.value))
}, 200)

watch(
  () => props.data,
  (newValue) => {
    if (JSON.stringify(newValue) === JSON.stringify(data.value)) return
    data.value = newValue.map((item) => Object.assign(deepClone(schema), deepClone(item)))
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
  width: 120px;
  min-width: 120px;
  text-align: right;
}
</style>
