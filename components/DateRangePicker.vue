<template>
  <div id="date-range-picker" date-rangepicker class="flex items-center justify-center w-full">

    <!-- START TIME -->
    <div class="relative">
      <!-- CALENDAR ICON -->
      <div class="absolute inset-y-0 end-3 flex items-center pointer-events-none">
        <div data-test="calendar-icon" class="w-5 h-5 bg-gray-50">
          <icon-calendar-day class="text-gray-500" size="xs"/>
        </div>
      </div>
      <input id="datepicker-range-start" name="start" type="date" class="bg-gray-50 border border-gray-300 text-black/50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-6 p-2.5 " placeholder="Select date start">
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
      <input id="datepicker-range-end" name="end" type="date" class="bg-gray-50 border border-gray-300 text-black/50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-6 p-2.5 " placeholder="Select date end">
    </div>
  </div>
  
</template>

<script setup lang="ts">
import "@justeattakeaway/pie-icons-webc/dist/IconCalendarDay.js";


// gets fed props -- start = date 7 days ago at 00:00:00, end = current date at 23:59:59
// emits "date-range-selected" event with start and end date whenever start or end is changed
// date pickers only control the date, not the time
// time is calculated so that start time is 00:00:00 and end time is 23:59:59

</script>

<style scoped>

</style>