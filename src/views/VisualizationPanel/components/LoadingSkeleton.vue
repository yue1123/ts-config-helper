<script setup lang="ts">
import { NSkeleton } from 'naive-ui'
</script>
<template>
  <div class="space-y-4" style="padding: 15px 24px 15px 30px">
    <NSkeleton text height="30px" :sharp="false" />
    <NSkeleton text style="width: 60%" height="30px" />
    <NSkeleton text :repeat="2" height="30px" :sharp="false" />
  </div>
</template>
