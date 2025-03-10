<template>
  <pre>
    {{ transactionFeedItem }}
  </pre>
</template>

<script setup lang="ts">
import type { FeedItem } from "@/types/FeedItem";
const props = defineProps<{
  transactionFeedItem: FeedItem;
}>();
</script>

<style scoped>

</style>