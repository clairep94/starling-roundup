<template>
  <div class="relative inline-block ">
    <div
      class="text-xs font-bold px-1.5 text-white bg-amber-500 rounded-full cursor-pointer"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >New</div>
    <div
      v-if="isHovered"
      class="absolute opacity-80 font-medium z-50 left-10 top-0 bg-gray-800 text-white text-[10px] rounded-lg p-2 shadow-lg"
    >
      Not in original tech test submission
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isHovered = ref(false);
</script>

<style scoped>
</style>