<script lang="ts" setup>
import { NLayout, NSkeleton } from 'naive-ui'
import { Pane, Splitpanes } from 'splitpanes'
import { ref } from 'vue'
import SideBar from './SideBar.vue'
import Header from './Header.vue'
import VisualizationPanel from './VisualizationPanel.vue'
import EditorPanel from './EditorPanel.vue'

const refreshId = ref(0)
const editorPanel = ref<typeof EditorPanel>()
const handleReady = () => {
  setTimeout(() => {
    refreshId.value += 1
  }, 300)
}
const handleResize = () => {
  // console.log(editorPanel.value?.resizeEditor)
  editorPanel.value?.resizeEditor()
}
</script>

<template>
  <NLayout class="h-screen">
    <Header />
    <NLayout style="height: calc(100vh - 64px)">
      <Splitpanes @ready="handleReady" @resize="handleResize" :dblClickSplitter="false">
        <Pane min-size="10">
          <Suspense>
            <SideBar />
            <template #fallback>
              <div style="padding: 15px 24px 15px 30px">
                <NSkeleton text :repeat="2" />
              </div>
            </template>
          </Suspense>
        </Pane>
        <Pane min-size="10">
          <Suspense>
            <VisualizationPanel />
            <template #fallback>
              <div style="padding: 15px 24px 15px 30px">
                <NSkeleton text :repeat="2" />
              </div>
            </template>
          </Suspense>
        </Pane>
        <Pane min-size="10">
          <Suspense>
            <EditorPanel ref="editorPanel" />
            <template #fallback>
              <div style="padding: 15px 24px 15px 30px">
                <NSkeleton text :repeat="2" />
              </div>
            </template>
          </Suspense>
        </Pane>
      </Splitpanes>
    </NLayout>
  </NLayout>
</template>
