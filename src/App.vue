<script setup lang="ts">
import { RouterView } from 'vue-router';
import Notifications from '@/components/Notifications/Notifications.vue';
</script>

<template>
  <main class="global-bg">
    <RouterView />
    <Notifications />
  </main>
</template>

<style scoped>
  .global-bg {
    background-color:rgb(241, 241, 241);
    background-size: cover;
    height: 100vh
  }
</style>