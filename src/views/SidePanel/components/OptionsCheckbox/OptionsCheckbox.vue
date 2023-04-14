<script setup lang="ts">
import { NDivider, NCheckbox, NCollapse, NButton, NCollapseItem, NTooltip, NBadge } from 'naive-ui'
import { currentLang } from '@i18n'
import type { Options } from '@types'
import useRuntimeStore from '@store/runtime'
import { descriptionMap } from '@schema'
import { BIconQuestion } from 'bootstrap-icons-vue'
import { computed, watchEffect } from 'vue'
export interface Props {
  data: Options[]
  level: number
}

const runtimeStore = useRuntimeStore()
const props = defineProps<Props>()
const renderData = computed(() => {
  if (runtimeStore.searchHitKeysCountMap !== null) {
    return props.data.filter((item) => {
      return runtimeStore.searchHitKeysCountMap![item.flatKeys]
    })
  }
  return props.data
})
</script>

<script lang="ts">
export default {
  name: 'OptionsCheckbox'
}
</script>

<template>
  <div :style="{ paddingLeft: `${props.level >= 1 ? 18 : 0}px` }">
    <template v-for="(options, i) in renderData" :key="options.flatKeys">
      <!-- has children, recursive rendering -->
      <template v-if="options.children.length">
        <NCollapse display-directive="show" class="mt-2" :key="i">
          <NCollapseItem :title="options.key" :name="options.key">
            <template #header-extra v-if="runtimeStore.searchHitKeysCountMap">
              <NBadge
                type="success"
                :value="runtimeStore.searchHitKeysCountMap![options.flatKeys]"
              />
            </template>
            <OptionsCheckbox :level="props.level + 1" :data="options.children" />
          </NCollapseItem>
        </NCollapse>
        <NDivider />
      </template>
      <template v-else>
        <div
          :key="i"
          class="flex items-center justify-start px-2 py-1 transition-colors checked-box-item"
        >
          <NCheckbox size="large" class="flex-1 w-full" :value="options.flatKeys">
            <div
              class="overflow-hidden text-ellipsis whitespace-nowrap"
              style="max-width: calc(100% - 20px)"
            >
              {{ options.key }}
            </div>
          </NCheckbox>
          <NTooltip :delay="400" placement="top-end" :style="{ maxWidth: '400px' }">
            <template #trigger>
              <NButton class="opacity-0 help" size="tiny" quaternary type="primary">
                <template #icon>
                  <BIconQuestion />
                </template>
              </NButton>
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
.checked-box-item {
  border-radius: 4px;
}
.dark .checked-box-item:hover {
  background: var(--n-scrollbar-color);
}
.light .checked-box-item:hover {
  background: #f1f1f1;
}
.checked-box-item:hover .help {
  opacity: 1;
}
/* .help */
</style>
