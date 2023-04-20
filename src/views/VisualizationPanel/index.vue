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
    <NScrollbar class="p-5 pb-0" style="height: calc(100vh - 64px - 42px)">
      <div class="pt-20" key="tipText" v-if="!store.selectedKeys.length">
        <Empty />
      </div>
      <div v-else v-auto-animate>
        <Property key="property" :level="1" :definition="treeData"></Property>
      </div>
    </NScrollbar>
  </NLayoutContent>
</template>

<style scoped>
.tipText {
  color: var(--vt-c-placeholder);
  text-align: center;
}
</style>
