<script setup lang="ts">
import { NSkeleton } from 'naive-ui'
import { skeletonHeight } from '@constants'
</script>
<template>
  <div style="padding: 15px 24px 15px 30px" class="space-y-6">
    <div class="flex justify-between space-x-4">
      <NSkeleton :height="skeletonHeight" width="33%" :sharp="false" />
      <div class="flex justify-start space-x-4">
        <NSkeleton width="30px" :height="skeletonHeight" :sharp="false" />
        <NSkeleton width="30px" :height="skeletonHeight" :sharp="false" />
      </div>
    </div>
    <NSkeleton :height="skeletonHeight" :sharp="false" />
    <div class="flex justify-start space-x-4">
      <NSkeleton width="30px" :height="skeletonHeight" :sharp="false" />
      <NSkeleton :height="skeletonHeight" width="50%" :sharp="false" />
    </div>
    <div class="flex justify-start space-x-4">
      <NSkeleton width="30px" height="30px" :sharp="false" />
      <NSkeleton :height="skeletonHeight" width="25%" :sharp="false" />
    </div>
    <div v-for="i in 10" class="flex justify-start space-x-4">
      <NSkeleton width="30px" :height="skeletonHeight" :sharp="false" />
      <NSkeleton :height="skeletonHeight" width="75%" :sharp="false" />
    </div>
  </div>
</template>
<style scoped></style>
