<template>
  <div class="flex flex-col justify-between p-2 border-t border-b border-gray-200">
    {{ amount.currency }}
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