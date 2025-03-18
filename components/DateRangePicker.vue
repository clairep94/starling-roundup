<template>
  <div id="date-range-picker" class="flex items-center justify-center w-full">
    <span class="mx-4 text-gray-500">from</span>
    <!-- START TIME -->
    <div class="relative">
      <!-- CALENDAR ICON -->
      <div class="absolute inset-y-0 end-3 flex items-center pointer-events-none">
        <div data-test="calendar-icon" class="w-5 h-5 bg-gray-50">
          <icon-calendar-day class="text-gray-500" size="xs"/>
        </div>
      </div>
      <input id="datepicker-range-start" name="start" type="date" 
      :value="start"
      @input="start = $event.target.value"
      :max="end"
      :disabled="props.disabled"
      @change="emit('date-range-selected', start, end)"
      class="bg-gray-50 border border-gray-300 text-black/50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-6 p-2.5 " placeholder="Select date start">
    </div>

    <span class="mx-4 text-gray-500">to</span>
    
     <!-- END TIME -->
     <div class="relative">
      <!-- CALENDAR ICON -->
      <div class="absolute inset-y-0 end-3 flex items-center pointer-events-none">
        <div data-test="calendar-icon" class="w-5 h-5 bg-gray-50">
          <icon-calendar-day class="text-gray-500" size="xs"/>
        </div>
      </div>
      <input id="datepicker-range-end" name="end" type="date" 
      :value="end"
      @input="end = $event.target.value"
      @change="emit('date-range-selected', start, end)"
      :min="start"
      :max="props.currentDate"
      :disabled="props.disabled"
      class="bg-gray-50 border border-gray-300 text-black/50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-6 p-2.5 " placeholder="Select date end">
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import "@justeattakeaway/pie-icons-webc/dist/IconCalendarDay.js";

const props = defineProps<{
  startProp: string,
  endProp: string,
  currentDate: string,
  disabled: boolean
}>();

const start = ref<string>(props.startProp.split('T')[0])
const end = ref<string>(props.endProp.split('T')[0])
const emit = defineEmits(['date-range-selected'])
</script>

<style scoped>

</style>