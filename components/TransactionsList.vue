<template>
  <!-- LOADING -->
  <div data-test="loading-transactions" v-if="props.isLoading"
  class="flex flex-col flex-grow gap-4 w-full items-center justify-center text-black/60 mt-10"
  >
    <pie-spinner variant="secondary"/>
    <p class="text-lg text-black/70">
      Loading transactions...
    </p>
  </div>

  <!-- NO DATA -->
  <div data-test="no-transactions-found-message" v-else-if="props.items.length == 0"
  class="flex flex-col flex-grow gap-4 w-full items-center justify-center text-black/50 mt-10"
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

    <!-- SELECT ALL/ DESELECT ALL BUTTONS -->
    <div class="flex flex-row items-center justify-end gap-2 -mb-5 pt-2">
      <button data-test="select-all-button" v-if="isSelectingRoundupTransactions"
      class="rounded-full text-text-default py-1.5 px-3 text-xs transition-all cursor-pointer bg-button-teal hover:bg-button-teal-hover"
        @click="handleSelectAll"
      >
        Select all
      </button>
      <button data-test="deselect-all-button" v-if="isSelectingRoundupTransactions"
      class="rounded-full text-text-default py-1.5 px-3 text-xs transition-all cursor-pointer bg-button-teal hover:bg-button-teal-hover"
        @click="handleDeselectAll"
      >
        Deselect all
      </button>
    </div>

    <!-- TRANSACTIONS LIST GROUPED BY DAY -->
    <div data-test="transaction-list-group" v-for="transactionGroup in organisedByDatesItems" :key="transactionGroup.date"
      class="flex flex-col"
    >
      <div data-test="transaction-list-group-date" class="flex flex-row  gap-3 text-black/50 text-sm font-medium py-3 border-b border-input-border">
        <p>
          {{ 
            (currentDate.split('T')[0] === transactionGroup.date) ?
            'Today'
            : extractDate(transactionGroup.date) 
          }}
        </p>
      </div>

      <!-- INDIVIDUAL ITEM -->
      <div class="flex flex-row border-b border-b-input-border" v-for="transaction in transactionGroup.items" >
        <!-- CHECKBOX -->
        <div v-if="isSelectingRoundupTransactions" class="flex w-8 items-center justify-center">
          <input v-if="isEligibleForRoundup(transaction)"
            type="checkbox"
            :checked="selectedTransactions.some(t => t.feedItemUid === transaction.feedItemUid)"
            @change="toggleTransaction(transaction, $event.target.checked)"
          />
        </div>
        <!-- ITEM -->
        <TransactionFeedItem
          :key="transaction.feedItemUid"
          :transactionFeedItem="transaction"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue'
import TransactionFeedItem from '../components/TransactionFeedItem.vue'
import type { FeedItem } from '../types/feedItem.type';
import { extractDate } from '../utils/formatData';
import '@justeattakeaway/pie-webc/components/spinner.js'
import { isEligibleForRoundup } from '../utils/roundUpCalculate';

const props = defineProps<{
  isLoading: boolean,
  items: FeedItem[], //all potential items
  selectedTransactions: FeedItem[], //selected items
  currentDate: string,
  isSelectingRoundupTransactions: boolean
}>();

const emit = defineEmits(['update:selectedTransactions'])

const organisedByDatesItems = computed(() => {
  const grouped = new Map<string, FeedItem[]>();

  props.items.forEach((item) => {
    const date = item.settlementTime.split('T')[0];
    if (!grouped.has(date)) {
      grouped.set(date, []);
    }
    grouped.get(date)?.push(item);
  });

  return Array.from(grouped, ([date, items]) => ({ date, items }));
});

function toggleTransaction(transaction: FeedItem, isSelected: boolean){
  const updatedArray = isSelected ? [...props.selectedTransactions, transaction] : props.selectedTransactions.filter(el => el.feedItemUid !== transaction.feedItemUid)
  emit('update:selectedTransactions', updatedArray)
}

function handleSelectAll(){
  emit('update:selectedTransactions', props.items.filter(el => isEligibleForRoundup(el)))
}

function handleDeselectAll(){
  emit('update:selectedTransactions', [])
}
</script>

<style scoped>

</style>