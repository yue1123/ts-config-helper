<script setup lang="ts">
import { NSkeleton } from 'naive-ui'
</script>
<template>
  <div style="padding: 15px 24px 15px 30px" class="space-y-4">
    <div class="flex justify-between space-x-4">
      <NSkeleton height="30px" width="33%" :sharp="false" />
      <NSkeleton width="30px" height="30px" :sharp="false" />
    </div>
    <NSkeleton height="40px" :sharp="false" />
    <div class="flex justify-start space-x-4">
      <NSkeleton width="30px" height="30px" :sharp="false" />
      <NSkeleton height="30px" width="50%" :sharp="false" />
    </div>
    <div class="flex justify-start space-x-4">
      <NSkeleton width="30px" height="30px" :sharp="false" />
      <NSkeleton height="30px" width="25%" :sharp="false" />
    </div>
    <div class="flex justify-start space-x-4">
      <NSkeleton width="30px" height="30px" :sharp="false" />
      <NSkeleton height="30px" width="75%" :sharp="false" />
    </div>
  </div>
</template>
<style scoped></style>
