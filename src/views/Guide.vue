<script lang="ts" setup>
import { NSpace, NModal, NButton, NTag, NText, NA, NH1 } from 'naive-ui'
import { ref, nextTick } from 'vue'
import Version from '@components/Version.vue'
import useGuide from '@store/guide'
import confetti from 'canvas-confetti'
const guideStore = useGuide()
const showGuide = ref(false)
nextTick(async () => {
  showGuide.value = guideStore.isFirst
})
defineExpose({
  show: () => {
    showGuide.value = true
  },
  hide: () => {
    showGuide.value = false
  }
})
function handleSkip() {
  const count = 240
  const defaults = {
    zIndex: 9999,
    origin: { y: 0.7 }
  }

  function fire(particleRatio: number, opts: any) {
    // @ts-ignore
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      })
    )
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55
  })
  fire(0.2, {
    spread: 60
  })
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 1
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.5
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 45
  })
  setTimeout(() => {
    showGuide.value = false
    guideStore.isFirst = false
  }, 100)
}
</script>

<template>
  <NModal
    v-model:show="showGuide"
    :mask-closable="false"
    class="guide-modal"
    preset="card"
    :style="{ width: '600px' }"
    size="huge"
    :bordered="true"
    :closable="false"
    :close-on-esc="false"
  >
    <template #header>
      <img src="../assets/guideCover.svg" alt="" />
    </template>
    <div class="content">
      <NH1 class="m-0 pb-2">TS Config Helper</NH1>
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
        {{ $t('site.desc') }}
      </NText>

      <div class="flex py-4 gap-4 flex-wrap">
        <NTag round :bordered="false"> {{ $t('site.visualizationConfig') }} </NTag>
        <NTag round :bordered="false"> {{ $t('site.docs') }} </NTag>
        <NTag round :bordered="false"> {{ $t('site.optionsList') }} </NTag>
        <NTag round :bordered="false"> {{ $t('site.optionsFilter') }} </NTag>
        <NTag round :bordered="false"> {{ $t('site.twoWayParse') }} </NTag>
      </div>
      <div>
        Built by
        <n-button tag="a" href="https://github.com/yue1123" target="_blank" text>
          @yue1123
        </n-button>
      </div>
    </div>
    <template #footer>
      <NSpace justify="center">
        <NButton secondary type="primary" @click="handleSkip"> {{ $t('gotIt') }} </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style lang="scss">
.guide-modal {
  overflow: hidden;
  .n-card-header {
    padding: 0;
  }
}
</style>
