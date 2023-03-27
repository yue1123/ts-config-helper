<template>
  <NPopover
    style="max-width: 500px; max-height: 50vh"
    header-style="position: sticky; top:0; background: var(--n-color)"
    footer-style="position: sticky; bottom:0; background: var(--n-color)"
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
      <div class="flex justify-between">
        <div class="flex items-center space-x-2">
          <span>{{ $t('quote') }}:</span>
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
    <template #footer>
      <div class="flex flex-col">
        <div v-if="configVersion" class="flex items-center space-x-2">
          <span>{{ $t('release') }}:</span>
          <NButton
            text
            tag="a"
            :href="`https://www.typescriptlang.org/docs/handbook/release-notes/typescript-${configVersion.replace(
              '.',
              '-'
            )}.html`"
            target="_blank"
            type="primary"
          >
            {{ configVersion }}
          </NButton>
        </div>
        <div v-if="relatedTo" class="flex items-center flex-wrap space-y-2 space-x-2">
          <div>{{ $t('related') }}:</div>
          <NTag v-for="item in relatedTo" type="success" size="small" :bordered="false">
            {{ item }}
          </NTag>
        </div>
      </div>
    </template>
  </NPopover>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { NPopover, NButton, NTag } from 'naive-ui'
import { BIconMarkdown, BIconLink45deg } from 'bootstrap-icons-vue'
import { usePropertyRemoteMarkdown } from '@hooks'
import { configReleaseMap, relatedToMap } from '@utils'

export interface Props {
  property: string
}
const configVersion = computed(() => configReleaseMap[props.property])
const relatedTo = computed(() => relatedToMap[props.property])
const props = defineProps<Props>()

const { get, data, isLoading } = usePropertyRemoteMarkdown()

const showPopover = ref<boolean>(false)
function handleGetMarkdownDesc() {
  get(props.property).then(() => {
    showPopover.value = true
  })
}
</script>

<style lang="scss" scoped></style>
