<template>
  <select 
    :value="modelValue"
    @change="handleInput($event)"
    class="bg-gray-50 border min-w-[140px] border-gray-300 text-black/50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-3 p-2.5"
  >
    <option
      v-for="option in options"
      :key="option"
      :value="option"
    >
      {{ option[0].toUpperCase() + option.slice(1).toLowerCase() }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
defineProps({
  modelValue: String,
  options: Array
});
const emit = defineEmits(['update:modelValue']);

const handleInput = ($event) => {
  emit('update:modelValue', $event.target.value)
}
</script>

<style scoped>

</style>