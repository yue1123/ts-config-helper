<script setup lang="ts">
import { NSkeleton } from 'naive-ui'
import { skeletonHeight } from '@constants'
</script>
<template>
  <div class="space-y-4" style="padding: 15px 24px 15px 30px">
    <NSkeleton text :height="skeletonHeight" :sharp="false" />
    <NSkeleton text style="width: 60%" :height="skeletonHeight" />
    <NSkeleton text :repeat="2" :height="skeletonHeight" :sharp="false" />
  </div>
</template>
