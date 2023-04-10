<script setup lang="ts">
import { NSkeleton } from 'naive-ui'
</script>
<template>
  <div style="padding: 15px 24px 15px 30px" class="space-y-4">
    <div class="flex">
      <NSkeleton width="20%" height="30px" :sharp="false" />
      <NSkeleton width="40%" height="30px" :sharp="false" />
    </div>
    <div class="flex ml-6 space-x-4">
      <NSkeleton width="40%" height="30px" :sharp="false" />
      <NSkeleton width="40%" height="30px" :sharp="false" />
    </div>
    <div class="flex ml-6 space-x-4">
      <NSkeleton width="30%" height="30px" :sharp="false" />
      <NSkeleton width="10%" height="30px" :sharp="false" />
      <NSkeleton width="15%" height="30px" :sharp="false" />
    </div>
    <NSkeleton width="10%" height="30px" :sharp="false" />
  </div>
</template>
