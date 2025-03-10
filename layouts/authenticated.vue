<template>
  <div class="w-full min-h-screen max-h-screen overflow-clip bg-white flex flex-row">
    <NavigationBar
    />
    <main class="flex-grow overflow-scroll">
      <slot/>
    </main>
  </div>
</template>

<script setup>
import NavigationBar from '@/components/NavigationBar.vue'

</script>

<style lang="scss" scoped>

</style>