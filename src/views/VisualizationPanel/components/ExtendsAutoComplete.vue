<script lang="ts" setup>
import { NSelect, NButton, type SelectOption } from 'naive-ui'
import { useExtendsOptions } from '@hooks'
import { h, ref, type VNode, type VNodeChild } from 'vue'

const props = defineProps(['value'])
const emits = defineEmits(['update:value'])
const extendsOptions = useExtendsOptions()
const value = ref(props.value || [])
const renderLabel = (option: SelectOption): VNodeChild => {
  if (option.type === 'group') return option.label as string
  const icon = option.icon as () => VNode
  return [
    h('div', { class: 'flex space-x-2 items-center' }, [
      icon && icon(),
      h('span', null, option.key as string)
    ])
  ]
}
function handleUpdateValue() {
  emits('update:value', value)
}
</script>

<template>
  <NSelect
    :options="extendsOptions"
    :render-label="renderLabel"
    v-model:value="value"
    placeholder="configuration file"
    filterable
    multiple
    tag
    class="extends-select"
    @update:value="handleUpdateValue"
  >
    <template #action>
      <NButton
        text
        tag="a"
        target="_blank"
        type="primary"
        href="https://github.com/tsconfig/bases"
        >{{ $t('sidebar.learnMore') }}</NButton
      >
    </template>
  </NSelect>
</template>
