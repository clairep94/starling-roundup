<template>
  <div class="flex flex-col gap-1 items-center justify-center">
    <h3 data-test="spending-insights-title"
    class="text-center text-sm font-semibold text-black/70">
      Your Spending by Category
    </h3>

    <div data-test="spending-insights-loading" v-if="isLoading" 
    class="flex items-center justify-center flex-col min-h-[300px] w-full">
      <pie-spinner variant="secondary"/>
      <p class="text-md text-black/70">Loading spending breakdown...</p>
    </div>
  
    <DoughnutChart data-test="doughnut" v-else
      :data="formattedChartData" >
      <div data-test="center-info-summary"
      class="flex flex-col items-center justify-center">
        <p v-if="!insights?.breakdown" data-test="spending-insights-no-data"
        class="text-center text-sm text-black/60">
          No data available
        </p>
        <h3 v-else data-test="spending-insights-amount"
        class="text-xl font-extrabold text-black/70">
          {{netAmountDisplay}}
        </h3>
        <p data-test="spending-insights-date-range"
        class="text-center text-xs text-black/60">
          {{ dateRangeDisplay }}
        </p>
      </div>
    </DoughnutChart>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia';
import { useSpendingInsightsStore } from '../store/spendingInsights';
import '@justeattakeaway/pie-webc/components/spinner.js'
import DoughnutChart from './DoughnutChart.vue';
import { formatCurrencyAmount } from '../utils/formatData';

const props = defineProps<{
  dateRange?: {
    summaryStartPeriodInclusive: string,
    summaryEndPeriodExclusive: string
  }
}>();

const spendingInsightsStore = useSpendingInsightsStore();
const { spendingInsightsSummaryByCategory: insights, isLoadingSpendingInsightsByCategory: isLoading } = storeToRefs(spendingInsightsStore);

const dateRangeDisplay = computed(() => {
  if(props.dateRange){
    return `between ${new Date(props.dateRange?.summaryStartPeriodInclusive.split('T')[0]).toLocaleDateString('en-GB')} - ${new Date(props.dateRange?.summaryEndPeriodExclusive.split('T')[0]).toLocaleDateString('en-GB')}`
  } else{
    return `for ${insights.value?.period}`
  }
})

const netAmountDisplay = computed(() => {
  if(!insights.value){
    return ''
  } else {
    return `${insights.value?.direction === 'IN' ? '+' : ''} ${formatCurrencyAmount({currency: insights.value.currency, minorUnits: (insights.value.netSpend*100)})}`
  }
})

const formattedChartData = computed(() => {
  if(!insights.value){
    return undefined
  } else {
    let labels:string[] = [] //categories
    let datasets:{ label: string, data: number[] }[] = [
      { label: `Total ${insights.value.currency}`, data:[]},
      { label: "Number of Transactions", data:[]}
    ]

    insights.value.breakdown.forEach((el) => {
      labels.push(`${el.spendingCategory[0]}${el.spendingCategory.slice(1).toLowerCase()}`)
      datasets[0].data.push((el.netDirection === 'IN' ? 1 : -1)*el.netSpend)
      datasets[1].data.push(el.transactionCount)
    })

    return {
      labels,
      datasets
    }
  }
})

const fetchInsights = () => {
  spendingInsightsStore.fetchSpendingInsightsByCategory(props.dateRange);
};

watch(() => props.dateRange, fetchInsights, { immediate: true, deep: true });

</script>

<style scoped>

</style>
