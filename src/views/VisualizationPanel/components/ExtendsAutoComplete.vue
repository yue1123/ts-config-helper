<script lang="ts" setup>
import { NSelect, NButton, type SelectOption } from 'naive-ui'
import { useExtendsOptions } from '@hooks'
import { h, ref, type VNode, type VNodeChild } from 'vue'
const extendsOptions = useExtendsOptions()
const value = ref()
const renderLabel = (option: SelectOption): VNodeChild => {
  const icon = option.icon as () => VNode

  return [
    h(
      'div',
      {
        class: 'flex space-x-4'
      },
      { default: icon }
    ),
    option.label as string
  ]
}

console.log(extendsOptions)
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
