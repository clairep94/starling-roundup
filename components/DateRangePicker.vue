<template>
  <div id="date-range-picker" class="flex items-center gap-2">
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
        @change="setDateRange(start, end)"
        class="bg-gray-50 border border-gray-300 text-black/50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-6 p-2.5" 
        placeholder="Select date start"/>
    </div>
    
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
        @change="setDateRange(start, end)"
        :min="start"
        :max="currentDate"
        :disabled="props.disabled"
        class="bg-gray-50 border border-gray-300 text-black/50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-6 p-2.5" 
        placeholder="Select date end"/>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { useDateRangeStore } from '../store/dateRange';
import { ref, defineProps } from 'vue'
import { storeToRefs } from 'pinia';
import "@justeattakeaway/pie-icons-webc/dist/IconCalendarDay.js";

const props = defineProps<{
  currentDate: string,
  disabled: boolean
}>();

const dateRangeStore = useDateRangeStore()
const { selectedStart, selectedEnd } = storeToRefs(dateRangeStore)
const { setDateRange } = dateRangeStore

const start = ref<string>(selectedStart.value.split('T')[0])
const end = ref<string>(selectedEnd.value.split('T')[0])
const currentDate = ref<string>(props.currentDate.split('T')[0])

</script>

<style scoped>

</style>