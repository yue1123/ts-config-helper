<script setup lang="ts">
import { NSkeleton } from 'naive-ui'
import { skeletonHeight } from '@constants'
</script>
<template>
  <div style="padding: 15px 24px 15px 30px" class="space-y-6">
    <div class="flex space-x-4">
      <NSkeleton width="20%" :height="skeletonHeight" :sharp="false" />
      <NSkeleton width="40%" :height="skeletonHeight" :sharp="false" />
    </div>
    <div class="flex ml-6 space-x-4">
      <NSkeleton width="40%" :height="skeletonHeight" :sharp="false" />
      <NSkeleton width="40%" :height="skeletonHeight" :sharp="false" />
    </div>
    <div class="flex ml-6 space-x-4">
      <NSkeleton width="30%" :height="skeletonHeight" :sharp="false" />
      <NSkeleton width="10%" :height="skeletonHeight" :sharp="false" />
      <NSkeleton width="15%" :height="skeletonHeight" :sharp="false" />
    </div>
    <NSkeleton width="10%" :height="skeletonHeight" :sharp="false" />
  </div>
</template>
