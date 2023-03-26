<template>
  <NPopover
    style="max-width: 500px; max-height: 50vh"
    header-style="position: sticky; top:0; background: var(--n-color)"
    scrollable
    :show="showPopover"
    placement="right"
    trigger="manual"
  >
    <template #trigger>
      <NButton text :bordered="false" :loading="isLoading" @click="handleGetMarkdownDesc">
        <template #icon>
          <BIconMarkdown />
        </template>
      </NButton>
    </template>
    <template #header>
      <div style="display: flex; justify-content: space-between">
        <div class="flex items-center space-x-2">
          <span>引用自:</span>
          <NButton
            text
            tag="a"
            :href="'https://www.typescriptlang.org/zh/tsconfig#' + props.property"
            target="_blank"
            type="primary"
          >
            <BIconLink45deg />
          </NButton>
        </div>
        <NButton text :bordered="false" @click="showPopover = false">关闭</NButton>
      </div>
    </template>
    <div class="markdown-body" style="height: 100%; overflow: hidden" v-html="data"></div>
  </NPopover>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { NPopover, NButton } from 'naive-ui'
import { BIconMarkdown, BIconLink45deg } from 'bootstrap-icons-vue'
import { usePropertyRemoteMarkdown } from '@hooks'
export interface Props {
  property: string
}
const props = defineProps<Props>()

const { get, data, isLoading } = usePropertyRemoteMarkdown()

const showPopover = ref<boolean>(false)
function handleGetMarkdownDesc() {
  get(props.property).then(() => {
    showPopover.value = true
    console.log()
  })
}
</script>

<style lang="scss" scoped></style>
