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
import Tabs from './Tabs/index.vue'
import TabsLoadingSkeleton from './Tabs/components/LoadingSkeleton.vue'
import { useSchemaData } from '@hooks'

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

const asyncComSharedLoadingState = ref<boolean>(true)
useSchemaData().finally(() => {
  asyncComSharedLoadingState.value = false
})
</script>

<template>
  <NLayout class="h-screen">
    <Header @showAbout="showGuideModal" />
    <NLayout style="height: calc(100vh - 64px)">
      <Splitpanes @resize="handleResize" :dblClickSplitter="false">
        <Pane role="left-side-container" min-size="10" size="20">
          <Suspense>
            <SidePanel />
            <template #fallback>
              <SidePanelLoadingSkeleton />
            </template>
          </Suspense>
        </Pane>
        <Pane role="right-main-container" min-size="10" size="80">
          <Splitpanes :push-other-panes="false" horizontal :dblClickSplitter="false">
            <Pane role="tabs-container" style="min-height: 42px; height: 42px">
              <TabsLoadingSkeleton v-if="asyncComSharedLoadingState" />
              <Tabs v-else />
            </Pane>
            <Pane role="tabs-content-container" size="99">
              <Splitpanes
                :push-other-panes="false"
                @resize="handleResize"
                :dblClickSplitter="false"
              >
                <Pane role="visualization-container" min-size="10" size="50">
                  <Suspense>
                    <VisualizationPanel />
                    <template #fallback>
                      <VisualizationPanelLoadingSkeleton />
                    </template>
                  </Suspense>
                </Pane>
                <Pane role="editor-container" min-size="10" size="50">
                  <Suspense>
                    <EditorPanel ref="editorPanel" />
                    <template #fallback>
                      <EditorPanelLoadingSkeleton />
                    </template>
                  </Suspense>
                </Pane>
              </Splitpanes>
            </Pane>
          </Splitpanes>
        </Pane>
      </Splitpanes>
    </NLayout>
  </NLayout>
  <Guide ref="guideModal" />
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
