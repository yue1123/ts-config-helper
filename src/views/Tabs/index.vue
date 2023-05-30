<script lang="ts" setup>
import useDataStore, { type ConfigItemState } from '@store/data'
import { NTab, NTabs, NButton, NInput } from 'naive-ui'
import { ref, shallowRef } from 'vue'
import { Icon } from '@iconify/vue'
import { configLibIcon } from '@hooks'
const dataStore = useDataStore()

const renameValue = ref<string>('')
const currentRenameItem = shallowRef<ConfigItemState | null>(null)
function handleRename(item: ConfigItemState) {
  currentRenameItem.value = item
  renameValue.value = item.name
}
function handleQuitRename() {
  currentRenameItem.value = null
  renameValue.value = ''
}
function handleSureRename() {
  if (currentRenameItem.value) dataStore.renameConfigTab(currentRenameItem.value, renameValue.value)
  handleQuitRename()
}
function handleChangeTab(index: number) {
  dataStore.currentConfigIndex = index
}
</script>

<template>
  <NTabs
    v-model:value="dataStore.currentConfigName"
    addable
    :closable="dataStore.configList.length > 1"
    class="file-tabs"
    type="card"
    style="height: 100%"
    @close="dataStore.removeConfigTab"
    @add="dataStore.addConfigTab"
  >
    <NTab
      v-for="(item, index) in dataStore.configList"
      :key="item.name"
      :name="item.name"
      class="config-name-tab"
      @click="handleChangeTab(index)"
    >
      <div v-if="currentRenameItem === item" class="rename" @click.stop>
        <NInput
          autofocus
          autosize
          :placeholder="currentRenameItem.name"
          v-model:value="renameValue"
          style="min-width: 120px"
          @blur="handleSureRename"
          @keyup.enter="handleSureRename"
        ></NInput>
      </div>
      <div v-else class="flex items-center space-x-2">
        <template v-if="configLibIcon[item.name.replace('@tsconfig/', '')]">
          <Icon width="14" :icon="configLibIcon[item.name.replace('@tsconfig/', '')]" />
        </template>
        <template v-else>
          <Icon width="14" icon="mdi:code-json" />
        </template>
        <span>{{ item.name }}</span>
        <NButton class="rename-btn" text :bordered="false" @click.stop="handleRename(item)">
          <template #icon>
            <Icon width="16" icon="ph:pencil-simple-line-light" />
          </template>
        </NButton>
      </div>
    </NTab>
  </NTabs>
</template>

<style lang="scss">
.file-tabs {
  .n-tabs-nav,
  .n-tabs-nav-scroll-wrapper,
  .v-x-scroll,
  .n-tabs-nav-scroll-content {
    height: 100%;
  }
}
.config-name-tab .rename-btn {
  transition: opacity 0.3s;
  opacity: 0;
}
.config-name-tab:hover .rename-btn {
  opacity: 1;
}
</style>
