<template>
  <div class="relative items-center justify-center flex">
    <div class="absolute bg-none rounded-full h-[164px] w-[164px] flex items-center justify-center translate-y-4 ">
      <slot></slot>
    </div>
    <Doughnut
      v-if="loaded"
      id="my-chart-id"
      :data="chartData"
      :options="{ maintainAspectRatio: false, cutout: '70%', radius: '90%' }"
    />
  </div>
</template>

<script setup lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ref } from "vue";
import { Doughnut } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

const loaded = ref(true);

const chartData = {
  "labels": ["Savings", "Income", "Payments"],
  "datasets": [
    {
      "label": "Net amount",
      "data": [300, 50, 100],
      "backgroundColor": [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)"
      ],
      "hoverOffset": 4
    },
    {
      "label": "Transactions",
      "data": [3, 5,2],
      "backgroundColor": [
        "rgb(255, 99, 132)",
        "rgb(54, 162, 235)",
        "rgb(255, 205, 86)"
      ],
      "hoverOffset": 4
    }
  ]
}
</script>

<style scoped>

</style>