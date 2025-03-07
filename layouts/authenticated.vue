<template>
  <div class="w-full min-h-screen bg-white flex flex-row">
    <NavigationBar
    />
    <main class="flex-grow">
      <slot/>
    </main>
  </div>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue'

</script>

<style lang="scss" scoped>

</style>