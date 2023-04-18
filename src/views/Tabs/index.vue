<script lang="ts" setup>
import { NTabs, NTab } from 'naive-ui'
import useDataStore from '@store/data'
import { useSchemaData } from '@hooks'
const dataStore = useDataStore()
await useSchemaData()
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
    <NTab v-for="item in dataStore.configList" :key="item.name" :name="item.name">
      <!-- <NInput :value="item.name"></NInput> -->
      {{ item.name }}
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
</style>
