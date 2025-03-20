<template>
  <!-- LOADING -->
  <div data-test="loading-transactions" v-if="props.isLoading"
  class="flex flex-col flex-grow gap-4 w-full items-center justify-center text-black/60 mt-10"
  >
    <pie-spinner variant="secondary"/>
    <p class="text-lg text-black/70">
      Loading balance...
    </p>
  </div>

  <!-- NO DATA -->
  <div data-test="no-transactions-found-message" v-else-if="props.items.length == 0"
  class="flex flex-col flex-grow gap-4 w-full items-center justify-center text-black/60 mt-10"
  >
    <p class="text-center">
      No transactions found. 
      <br>
      <br>
      Update the date range, or simulate transactions on the Starling API Sandbox to see them here.
    </p>
  </div>

  <!-- TRANSACTIONS LIST -->
  <div data-test="transaction-feed-list" v-else
    class="flex flex-col gap-3">

    <div data-test="transaction-list-group" v-for="transactionGroup in organisedByDatesItems" :key="transactionGroup.date"
      class="flex flex-col"
    >
      <div data-test="transaction-list-group-date" class="text-black/50 text-sm font-medium py-3 border-b border-input-border">
        {{ 
          (currentDate.split('T')[0] === transactionGroup.date) ?
          'Today'
          : extractDate(transactionGroup.date) 
        }}
      </div>

      <TransactionFeedItem
        v-for="transaction in transactionGroup.items"
        :transactionFeedItem="transaction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed } from 'vue'
import TransactionFeedItem from '../components/TransactionFeedItem.vue'
import type { FeedItem } from '../types/feedItem.type';
import { extractDate } from '../utils/formatData';
import '@justeattakeaway/pie-webc/components/spinner.js'

const props = defineProps<{
  isLoading: boolean,
  items: FeedItem[],
  currentDate: string,
}>();

const organisedByDatesItems = computed(() => {
  return props.items.reduce((acc, item) => {
    const date = item.settlementTime.split('T')[0];
    const existingGroup = acc.find(group => group.date === date);

    if (existingGroup) {
      existingGroup.items.push(item);
    } else {
      acc.push({ date, items: [item] });
    }

    return acc;
  }, []);
})

</script>

<style scoped>

</style>