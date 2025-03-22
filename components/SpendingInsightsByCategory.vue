<template>
  <div v-if="isLoading" class="flex items-center justify-center flex-col">
    <pie-spinner variant="secondary"/>
    <p class="text-lg text-black/70">Loading spending breakdown...</p>
  </div>

  <div v-else-if="!insights?.breakdown">
    <p>No breakdown found...</p>
  </div>

  <div v-else class="relative w-50 h-50">
    <div 
      class="w-full h-full rounded-full border-4 border-white"
      :style="pieChartStyle"
    ></div>
    
    <!-- Overlay Circle -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="w-40 h-40 rounded-full bg-gray-200 border-6 border-white flex items-center justify-center flex-col">
        <p class="text-center text-black/70 text-xs">
          {{ insights.netSpend }} {{ insights.direction }} {{ insights.currency }}
        </p>
        <p class="text-center text-black/70 text-xs">
          between {{ props.dateRange?.summaryStartPeriodInclusive.split('T')[0] }} and {{ props.dateRange?.summaryEndPeriodExclusive.split('T')[0] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useSpendingInsightsStore } from '../store/spendingInsights';
import '@justeattakeaway/pie-webc/components/spinner.js'

const props = defineProps<{
  dateRange?: {
    summaryStartPeriodInclusive: string,
    summaryEndPeriodExclusive: string
  }
}>();

const spendingInsightsStore = useSpendingInsightsStore()
const { spendingInsightsSummaryByCategory: insights, isLoadingSpendingInsightsByCategory: isLoading } = storeToRefs(spendingInsightsStore)

const fetchInsights = () => {
  spendingInsightsStore.fetchSpendingInsightsByCategory(props.dateRange)
};

watch(() => props.dateRange, fetchInsights, { immediate: true, deep: true });

const pieChartStyle = computed(() => {
  if (!insights.value?.breakdown || insights.value.breakdown.length === 0) return ''

  const total = insights.value.breakdown.reduce((sum, item) => sum + item.netSpend, 0);
  let currentPercentage = 0;
  const gapSize = 0.5; // Small gap in percentage

  const gradientColors = insights.value.breakdown.flatMap((item, index) => {
    const percentage = (item.netSpend / total) * 100 - gapSize; // Reduce to accommodate gaps
    const start = currentPercentage;
    const end = currentPercentage + percentage;
    currentPercentage = end + gapSize; // Add the gap

    const color = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][index % 5];

    return [
      `${color} ${start}% ${end}%`, // Main segment
      `white ${end}% ${end + gapSize}%` // White gap
    ];
  }).join(', ');

  return {
    background: `conic-gradient(${gradientColors})`
  };
});

</script>

<style scoped>
div {
  max-width: 400px;
  max-height: 400px;
}
</style>
