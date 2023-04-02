<script lang="ts" setup>
import { computed, h, ref, getCurrentInstance } from 'vue'
import { NPopover, NButton, NTooltip, NTag, useMessage, type PopoverTrigger } from 'naive-ui'
import { BIconMarkdown, BIconLink45deg } from 'bootstrap-icons-vue'
import { useEventListener, usePropertyRemoteMarkdown } from '@hooks'
import { configReleaseMap, relatedToMap } from '@utils'

export interface Props {
  property: string
}
const configVersion = computed(() => configReleaseMap[props.property])
const relatedTo = computed(() => relatedToMap[props.property])
const props = defineProps<Props>()
const { get, data, isLoading } = await usePropertyRemoteMarkdown()
const message = useMessage()
const { ctx } = getCurrentInstance() as unknown as { ctx: any }
const showPopover = ref<boolean>(false)
function handleGetMarkdownDesc() {
  showPopover.value = false
  get(props.property)
    .then(() => {
      showPopover.value = true
    })
    .catch(() => {
      message.error(ctx.$t('notFound', { property: props.property }))
    })
}
function handleUpdateShow(value: boolean) {
  if (!value) showPopover.value = value
}
</script>

<template>
  <NPopover
    style="max-width: 500px; max-height: 50vh"
    header-style="position: sticky; top:0; background: var(--n-color);border-radius: 4px 4px 0 0;"
    footer-style="position: sticky; bottom:0; background: var(--n-color);border-radius: 0 0 4px 4px;"
    scrollable
    :show="showPopover"
    placement="right"
    trigger="click"
    @update:show="handleUpdateShow"
  >
    <template #trigger>
      <NTooltip placement="right" trigger="hover">
        <template #trigger>
          <NButton text :bordered="false" :loading="isLoading" @click="handleGetMarkdownDesc">
            <template #icon>
              <BIconMarkdown />
            </template>
          </NButton>
        </template>
        {{ $t('showMarkdownDesc') }}
      </NTooltip>
    </template>
    <template #header v-if="data">
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
        <NButton text :bordered="false" @click="showPopover = false">{{ $t('close') }}</NButton>
      </div>
    </template>
    <div v-if="data" class="markdown-body h-full overflow-hidden" v-html="data"></div>
    <template #footer v-if="configVersion || relatedTo">
      <div class="flex flex-col space-y-2">
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
        <div v-if="relatedTo" class="flex items-center flex-wrap gap-2">
          <div>{{ $t('related') }}:</div>
          <NTag v-for="item in relatedTo" type="success" size="small" :bordered="false">
            {{ item }}
          </NTag>
        </div>
      </div>
    </template>
  </NPopover>
</template>
