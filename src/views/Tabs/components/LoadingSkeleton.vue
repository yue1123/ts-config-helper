<script setup lang="ts">
import { NSkeleton } from 'naive-ui'
import { skeletonHeight } from '@constants'
</script>
<template>
  <div
    class="flex items-center h-full px-2 space-x-4"
    style="border-bottom: 1px solid var(--vt-c-divider-dark-2)"
  >
    <NSkeleton width="120px" height="30px" :sharp="false" />
    <NSkeleton width="120px" height="30px" :sharp="false" />
    <NSkeleton width="120px" height="30px" :sharp="false" />
  </div>
</template>
