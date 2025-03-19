<template>
  <!-- LOADING -->
  <div data-test="loading-transactions" v-if="props.isLoading"
  class="flex flex-col flex-grow gap-4 w-full items-center justify-center text-black/60 mt-10"
  >
    Loading transactions...
  </div>

  <!-- NO DATA -->
  <div data-test="no-transactions-found-message" v-else-if="props.items.length == 0"
  class="flex flex-col flex-grow gap-4 w-full items-center justify-center text-black/60 mt-10"
  >
    No transactions found.
  </div>

  <!-- TRANSACTIONS LIST -->
  <div data-test="transaction-feed-list" v-else
    class="flex flex-col gap-2">
    <TransactionFeedItem v-for="transaction in props.items" :transactionFeedItem="transaction" :key="transaction.id" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import TransactionFeedItem from '../components/TransactionFeedItem.vue'
import type { FeedItem } from '../types/feedItem.type';

const props = defineProps<{
  isLoading: boolean,
  items: FeedItem[]
}>();


</script>

<style scoped>

</style>