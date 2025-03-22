<template>
  <div v-if="isLoading" class="flex items-center justify-center flex-col min-h-[300px] w-full">
    <pie-spinner variant="secondary"/>
    <p class="text-md text-black/70">Loading spending breakdown...</p>
  </div>

  <div v-else-if="!insights?.breakdown" class="flex items-center justify-center flex-col min-h-[300px] w-full">
    <p>No breakdown found...</p>
  </div>

  <div v-else>
   <Doughnut>
    <h3 class="text-xl font-extrabold text-black/70">
      {{ insights.direction === 'IN' ? '+' : '' }}
      {{ formatCurrencyAmount({
        currency: insights.currency,
        minorUnits: (insights.netSpend*100)
      }) }}
    </h3>

    <h4 data-test="roundup-title" class="text-xs font-semibold text-black/50 text-center">
      between <br>{{ 
        new Date(props.dateRange?.summaryStartPeriodInclusive.split('T')[0]).toLocaleDateString('en-GB')
         }} - {{ new Date(props.dateRange?.summaryEndPeriodExclusive.split('T')[0]).toLocaleDateString('en-GB') }}
    </h4>
   </Doughnut>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useSpendingInsightsStore } from '../store/spendingInsights';
import '@justeattakeaway/pie-webc/components/spinner.js'
import Doughnut from './Doughnut.vue';
import { formatCurrencyAmount } from '../utils/formatData';

const props = defineProps<{
  dateRange: {
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

</style>
