<template>
  <div data-test="subpage-tab" 
    class="text-sm hover:cursor-pointer py-4"
    @click="navigateTo(path)"
    :class="{
      'border-b-2 border-b-teal font-semibold  text-black/80': isCurrentLink,
      'hover:border-b-2 hover:border-b-gray-300 font-medium text-black/60 hover:text-black-80': !isCurrentLink
    }"
    >
    {{ title }}
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps<{
  path: string,
  title: string
}>();

const route = useRoute();
const isCurrentLink = computed(() => route.path === props.path);
</script>

<style scoped>

</style>