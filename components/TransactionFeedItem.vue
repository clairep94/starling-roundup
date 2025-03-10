<template>
  <div class="flex flex-row w-full justify-between p-4 border-t border-b border-gray-200">
    <div data-test="left-side" class="flex flex-row gap-4 justify-center items-center">
      <div data-test="logo-container"
        class="bg-red-500 w-12 h-12 rounded-sm"
      >
        {{ spendingCategory }}
      </div>
      <div data-test="transaction-details" class="flex flex-col">
        <div data-test="counter-party-name" class="text-sm font-semibold">
          {{ counterPartyName }}
        </div>
        <div data-test="transaction-time-and-category" class="text-xs text-gray-500">
          {{ settlementTime }} | {{ spendingCategory }}
        </div>
      </div>
    </div>
    
    <!-- AMOUNT & TOGGLE -->
    <div data-test="right-side" class="flex flex-row gap-4 justify-center items-center">
      <!-- TODO: icon if round up has already been applied -->
       ICON
      <!-- TODO: util function -->
      {{ amount.currency }} {{ amount.minorUnits }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FeedItem } from "@/types/FeedItem";
const props = defineProps<{
  transactionFeedItem: FeedItem;
}>();

const { amount, direction, settlementTime, counterPartyName, spendingCategory } = props.transactionFeedItem;

</script>

<style scoped>

</style>