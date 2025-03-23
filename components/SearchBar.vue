<template>
  <input 
    :value="modelValue"
    :placeholder="placeholder"
    id="search"
    type="text"
    @input="handleInput($event)"
    class="bg-gray-50 border min-w-[140px] border-gray-300 text-black/50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-4.5 p-2.5"
  >
  </input>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
defineProps({
  modelValue: String,
  placeholder: { type: String, default: 'Search' }
});
const emit = defineEmits(['update:modelValue']);

const handleInput = ($event) => {
  emit('update:modelValue', $event.target.value)
}
</script>

<style scoped>

</style>