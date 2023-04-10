<script lang="ts" setup>
import { useSchemaData } from '@hooks'
import useStore from '@store/data'
import { NLayoutContent, NScrollbar } from 'naive-ui'
import Property from './components/Property.vue'
import Empty from './components/Empty.vue'

const store = useStore()
const { treeData } = await useSchemaData()
</script>

<template>
  <NLayoutContent>
    <NScrollbar class="p-5" style="height: calc(100vh - 64px)">
      <template key="tipText" v-if="!store.selectedKeys.length">
        <Empty />
      </template>
      <template v-else>
        <Property key="property" :level="1" :definition="treeData"></Property>
      </template>
    </NScrollbar>
  </NLayoutContent>
</template>

<style scoped>
.tipText {
  color: var(--vt-c-placeholder);
  text-align: center;
}
</style>
