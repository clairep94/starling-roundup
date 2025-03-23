<template>
  <div class="relative items-center justify-center flex">
    <div class="absolute mix-blend-multiply bg-gray-100 rounded-full h-40 w-40 flex flex-col items-center justify-center translate-y-4">
      <slot></slot>
    </div>
    <Doughnut
      data-test="doughnut-chart"
      :data="chartData"
      class="opacity-90"
      :options="options"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  optionsOverrides?: any,
  data?: {
    labels: string[],
    datasets: {
      label: string,
      data: number[]
    }[]
  }
}>();

// ==== Options ========
const options = computed(() => {
  return {
    maintainAspectRatio: false,
    cutout: '70%',
    radius: '90%',
    ...(props.optionsOverrides ? props.optionsOverrides : {})
  }
})

// ===== ChartData =======
const chartData = computed(() => {
  if (!props.data) {
    return noDataChartData
  } else {
    return {
      labels: props.data.labels,
      datasets: props.data.datasets.map((el) => {
        return {
          ...el,
          backgroundColor: segmentColours,
          hoverOffset: hoverOffset
        }
      })
    }
  }
})

const segmentColours = [
  "rgba(3,199,194,255)",
  "rgba(196,39,80,255)",
  "rgba(52,149,173,255)",
  "rgba(201,62,133,255)",
  "rgba(242,133,100,255)",
  "rgba(0,95,130,255)",
  "rgba(123,137,64,255)",
  "rgba(175,175,175,255)"
]

const noDataSegment = "rgba(175,175,175,255)"

const hoverOffset = 4

const noDataChartData = {
  "labels": ["No transaction data available"],
  "datasets": [
    {
      "label": "No data available",
      "data": [1],
      "backgroundColor": [noDataSegment],
      "hoverOffset": hoverOffset
    }
  ]
}
</script>

<style scoped>

</style>