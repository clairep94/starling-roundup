<template>
  <div v-if="isLoading" class="flex items-center justify-center flex-col">
    <pie-spinner variant="secondary"/>
    <p class="text-lg text-black/70">Loading spending breakdown...</p>
  </div>

  <div v-else-if="!insights?.breakdown">
    <p>No breakdown found...</p>
  </div>

  <div v-else>
   <Doughnut>
    <p>Test</p>

   </Doughnut>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useSpendingInsightsStore } from '../store/spendingInsights';
import '@justeattakeaway/pie-webc/components/spinner.js'
import Doughnut from './Doughnut.vue';

const props = defineProps<{
  dateRange?: {
    summaryStartPeriodInclusive: string,
    summaryEndPeriodExclusive: string
  }
}>();

const spendingInsightsStore = useSpendingInsightsStore();
const { spendingInsightsSummaryByCategory: insights, isLoadingSpendingInsightsByCategory: isLoading } = storeToRefs(spendingInsightsStore);

const fetchInsights = () => {
  spendingInsightsStore.fetchSpendingInsightsByCategory(props.dateRange);
};

watch(() => props.dateRange, fetchInsights, { immediate: true, deep: true });

</script>

<style scoped>
div {
  max-width: 400px;
  max-height: 400px;
}
</style>
