<script lang="ts" setup>
import { NLayout } from 'naive-ui'
import { Pane, Splitpanes } from 'splitpanes'
import { ref } from 'vue'
import SidePanel from './SidePanel/index.vue'
import Header from './Header.vue'
import VisualizationPanel from './VisualizationPanel/index.vue'
import SidePanelLoadingSkeleton from './SidePanel/components/LoadingSkeleton.vue'
import VisualizationPanelLoadingSkeleton from './VisualizationPanel/components/LoadingSkeleton.vue'
import EditorPanelLoadingSkeleton from './EditorPanel/components/LoadingSkeleton.vue'
import EditorPanel from './EditorPanel/index.vue'
import Guide from './Guide.vue'
import useGuide from '@store/guide'
const guideStore = useGuide()

const editorPanel = ref<typeof EditorPanel>()
const guideModal = ref<typeof Guide>()

function handleResize() {
  editorPanel.value?.handleResize && editorPanel.value?.handleResize()
}
function showGuideModal() {
  if (guideModal.value) {
    guideModal.value.show()
  }
}
</script>

<template>
  <NLayout class="h-screen">
    <Header @showAbout="showGuideModal" />
    <NLayout style="height: calc(100vh - 64px)">
      <Splitpanes @resize="handleResize" :dblClickSplitter="false">
        <Pane min-size="10" size="20">
          <Suspense>
            <SidePanel />
            <template #fallback>
              <SidePanelLoadingSkeleton />
            </template>
          </Suspense>
        </Pane>
        <Pane min-size="10" size="40">
          <Suspense>
            <VisualizationPanel />
            <template #fallback>
              <VisualizationPanelLoadingSkeleton />
            </template>
          </Suspense>
        </Pane>
        <Pane min-size="10" size="40">
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
  <Guide ref="guideModal" />
</template>
