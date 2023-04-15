<script lang="ts" setup>
import { NSpace, NModal, NButton, NH2, NTag, NText, NA } from 'naive-ui'
import { ref, nextTick } from 'vue'
import Version from '@components/Version.vue'
import useGuide from '@store/guide'
const guideStore = useGuide()
// defineExpose({
//   show: () => {
//     showSetting.value = true
//   },
//   hide: () => {
//     showSetting.value = false
//   }
// })
// 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
const showSetting = ref(false)
nextTick(() => {
  console.log(guideStore.isFirst)
  showSetting.value = guideStore.isFirst
})

function handleSkip() {
  import('https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js').then(
    () => {
      const myCanvas = document.createElement('canvas')
      document.body.appendChild(myCanvas)
      const duration = 5 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: NodeJS.Timer = setInterval(function () {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          showSetting.value = false
          guideStore.isFirst = false
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        // @ts-ignore
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          })
        )
        // @ts-ignore
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          })
        )
      }, 250)
    }
  )
}
</script>

<template>
  <NModal
    v-model:show="showSetting"
    :mask-closable="false"
    class="guide-modal"
    preset="card"
    :style="{ width: '600px' }"
    size="huge"
    :bordered="true"
    :closable="false"
  >
    <template #header>
      <img src="../assets/guideCover.svg" alt="" />
    </template>
    <div class="content">
      <NH2 class="m-0 pb-2">TS Config Helper</NH2>
      <div class="space-x-2">
        <Version />
        <img
          alt="GitHub"
          src="https://img.shields.io/github/license/yue1123/ts-config-helper?style=flat-square"
        />
        <img
          alt="GitHub Repo stars"
          src="https://img.shields.io/github/stars/yue1123/ts-config-helper?color=green&style=flat-square"
        />
      </div>
      <NText>
        Ts Config Helper 是一个功能强大、易用性高的 TypeScript
        配置工具，提供可视化配置、详细Ts官网文档查阅、预设配置列表和分类过滤等多种功能，帮助你更快速、准确地完成
        <NText code> tsconfig.json </NText> 的配置。
      </NText>

      <div class="flex py-4 gap-4 flex-wrap">
        <NTag round :bordered="false"> 可视化配置 </NTag>
        <NTag round :bordered="false"> 详细文档查阅 </NTag>
        <NTag round :bordered="false"> 预设配置列表 </NTag>
        <NTag round :bordered="false"> 分类过滤 </NTag>
        <NTag round :bordered="false"> 分类过滤 </NTag>
      </div>
      <div>
        Built by
        <n-button
          tag="a"
          href="https://baike.baidu.com/item/%E4%B8%94%E5%90%AC%E9%A3%8E%E5%90%9F"
          target="_blank"
          text
        >
          @yue1123
        </n-button>
      </div>
    </div>
    <template #footer>
      <NSpace justify="center">
        <!-- <NButton type="primary" secondary strong> 新手引导 </NButton> -->
        <NButton quaternary type="primary" @click="handleSkip"> 知道了 </NButton>
      </NSpace>
    </template>
  </NModal>
  <!-- <Teleport to="body"> -->
  <!-- <canvas id="J_Canvas_Confetti" /> -->
  <!-- </Teleport> -->
</template>

<style lang="scss">
.guide-modal {
  overflow: hidden;
  .n-card-header {
    padding: 0;
  }
}
</style>
