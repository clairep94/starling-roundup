<template>
  <Notifications />
  <div class="w-full min-h-screen bg-home-peach">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import Notifications from './components/Notifications.vue'
</script>