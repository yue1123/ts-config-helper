<script setup lang="ts">
import { NSkeleton } from 'naive-ui'
import { skeletonHeight } from '@constants'
</script>
<template>
  <div class="space-y-6" style="padding: 15px 24px 15px 30px">
    <div v-for="i in 4" class="space-y-6">
      <NSkeleton text style="width: 30%" :sharp="false" :height="skeletonHeight" />
      <NSkeleton text :height="skeletonHeight" :sharp="false" />
    </div>
  </div>
</template>
