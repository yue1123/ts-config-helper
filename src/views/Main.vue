<script lang="ts" setup>
import { NLayout, NSkeleton } from 'naive-ui'
import { Pane, Splitpanes } from 'splitpanes'
import { ref } from 'vue'
import SidePanel from './SidePanel/index.vue'
import Header from './Header.vue'
import VisualizationPanel from './VisualizationPanel/index.vue'
import SidePanelLoadingSkeleton from './SidePanel/components/LoadingSkeleton.vue'
import VisualizationPanelLoadingSkeleton from './VisualizationPanel/components/LoadingSkeleton.vue'
import EditorPanelLoadingSkeleton from './EditorPanel/components/LoadingSkeleton.vue'
import EditorPanel from './EditorPanel/index.vue'

const refreshId = ref(0)
const editorPanel = ref<typeof EditorPanel>()
const handleReady = () => {
  setTimeout(() => {
    refreshId.value += 1
  }, 300)
}
const handleResize = () => {
  // console.log(editorPanel.value?.resizeEditor)
  // editorPanel.value?.resizeEditor()
}
</script>

<template>
  <NLayout class="h-screen">
    <Header />
    <NLayout style="height: calc(100vh - 64px)">
      <Splitpanes @ready="handleReady" @resize="handleResize" :dblClickSplitter="false">
        <Pane min-size="10">
          <Suspense>
            <SidePanel />
            <template #fallback>
              <SidePanelLoadingSkeleton />
            </template>
          </Suspense>
        </Pane>
        <Pane min-size="10">
          <Suspense>
            <VisualizationPanel />
            <template #fallback>
              <VisualizationPanelLoadingSkeleton />
            </template>
          </Suspense>
        </Pane>
        <Pane min-size="10">
          <Suspense>
            <EditorPanel ref="editorPanel" />
            <template #fallback>
              <EditorPanelLoadingSkeleton />
            </template>
          </Suspense>
        </Pane>
      </Splitpanes>
    </NLayout>
  </NLayout>
</template>
