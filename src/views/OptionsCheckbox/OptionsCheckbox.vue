<script setup lang="ts">
import { NDivider, NCheckbox, NCollapse, NCollapseItem, NTooltip } from 'naive-ui'
import { currentLang } from '@i18n'
import type { Options } from '@types'
import useRuntimeStore from '@store/runtime'
import { descriptionMap } from '@schema'
export interface Props {
  data: Options[]
  level: number
}

const runtimeStore = useRuntimeStore()
const props = defineProps<Props>()
</script>

<script lang="ts">
export default {
  name: 'OptionsCheckbox'
}
</script>

<template>
  <div :style="{ paddingLeft: `${props.level >= 1 ? 18 : 0}px` }">
    <template v-for="(options, i) in props.data" :key="options.flatKeys">
      <!-- has children, recursive rendering -->
      <template v-if="options.children.length">
        <NCollapse class="mt-2" :key="i">
          <NCollapseItem :title="options.key" :name="options.key">
            <OptionsCheckbox :level="props.level + 1" :data="options.children" />
          </NCollapseItem>
        </NCollapse>
        <NDivider />
      </template>
      <template v-else>
        <div
          v-if="!runtimeStore.searchHitKeysMap || runtimeStore.searchHitKeysMap?.[options.flatKeys]"
          :key="i"
        >
          <NTooltip placement="top-start" :style="{ maxWidth: '400px' }">
            <template #trigger>
              <NCheckbox size="large" class="w-full mt-1" :value="options.key">
                <div
                  class="text-ellipsis overflow-hidden whitespace-nowrap"
                  style="max-width: calc(100% - 20px)"
                >
                  {{ options.key }}
                </div>
              </NCheckbox>
            </template>
            {{ descriptionMap[currentLang][options.flatKeys]?.message }}
          </NTooltip>
        </div>
      </template>
    </template>
  </div>
</template>

<style scoped>
:deep(.n-divider:not(.n-divider--vertical)) {
  margin-top: 12px;
  margin-bottom: 12px;
}
:deep(.n-collapse-item-arrow) {
  margin-right: 10px !important;
}
:deep(.n-collapse .n-collapse-item .n-collapse-item) {
  margin-left: 0;
}
:deep(.n-checkbox__label) {
  width: 100%;
}
</style>
